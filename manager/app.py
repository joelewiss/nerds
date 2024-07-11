# Joe Lewis 2021
#
# This software may be modified and distributed under the terms
# of the MIT license.  See the LICENSE file for details.
import docker
import sys
import redis
import signal
import os
import logging
from time import sleep
from statsd import StatsClient
from threading import Thread, current_thread
import manager_config as config

RUNNING_CONTAINERS = []
STAT_PREFIX = "devob.manager"
logging.basicConfig(stream=sys.stdout)
log = logging.getLogger()


def sigint_handler(sig, frame):
    log.info("Interrupt received, stopping all containers")
    cont_names = [c.name for c in RUNNING_CONTAINERS]

    if len(cont_names) > 0:
        #os.execvp("docker", ["docker", "container", "stop", *cont_names])
        pass
    else:
        sys.exit(0)


def check_cwd():
    # TODO: Implement directory checks
    return True


def create_container(client, tag):
    """Run docker create to make a new instance and return the created
    container"""

    # Retrieve the network we're using from docker
    nets = client.networks.list(names=config.NETWORK_NAME)
    if len(nets) == 0:
        raise Exception("ERROR: Couldn't get docker network to attach instance"
                        " to, are the main containers started?")
    elif len(nets) > 1:
        raise Exception("ERROR: Got multiple networks back from docker, check"
                        " your networks for duplicates")

    net = nets[0]

    cont = client.containers.run(tag,
            detach=True,
            #auto_remove=True,
            network=net.name,
            #TODO: make configurable constant for this
            mem_limit="1G",
            cpu_shares=512
    )
    RUNNING_CONTAINERS.append(cont)

    return cont

def stop_container(client, cont_id):
    def stop_cont_thread(container):
        me = current_thread().name
        thread_log = logging.getLogger("thread." + str(me))

        try:
            thread_log.info(f"Removing container {container.name}")
            container.stop()
            container.remove()
        except docker.errors.APIError as e:
            thread_log.error("API Error from thread: %s", str(e))

    try:
        cont = client.containers.get(cont_id)

        # Start a thread to stop the container, since this process takes a
        # while and we dont want to block the main thread.
        t = Thread(target=stop_cont_thread, kwargs={"container":cont})
        t.start()

        RUNNING_CONTAINERS.remove(cont)
        return True
    except ValueError:
        log.warning(f"Couldn't remove container {cont_id} from running containers list")
        return False
    except docker.errors.NotFound:
        log.warning(f"Couldn't remove container {cont_id}: Container not found")


def get_stopped_containers(client, tag):
    filt = {"status": "exited", "ancestor": tag}
    conts = client.containers.list(all=True, sparse=True, filters=filt)
    return conts

def dint(s):
    if type(s) == int:
        return s
    elif type(s) == bytes:
        return int(s.decode())
    elif type(s) == str:
        return int(s)
    else:
        raise Exception(f"Could not handle type {type(s)}")

def print_docker_stream(stream: list) -> None:
    for line in stream:
        if "stream" in line:
            print(line["stream"], end="")


if __name__ == "__main__":
    if not check_cwd():
        log.critical("Looks like the script isn't running in the correct directory, "
                "please run from the root directory of developer observatory")
        exit(1)

    log.setLevel(config.LOG_LEVEL)
    log.info("Developer Observatory Docker Management Script")
    log.debug("Starting...")
    log.debug("Debug messages are on")

    # Setup signal handler
    signal.signal(signal.SIGINT, sigint_handler)

    # Setup redis
    r = redis.Redis(host="localhost", port=6379, db=0)
    # Reset various redis keys
    r.delete(config.REDIS_QUEUE)
    r.delete(config.REDIS_BOOTING_COUNTER)
    r.delete(config.REDIS_OLD_LIST)

    # Setup docker
    client = docker.from_env()

    log.debug("Building most recent version of instance server")
    """
    try:
        instance_image, logs = client.images.build(path="./instance/", rm=True,
                                                    tag=config.INSTANCE_TAG)
    except docker.errors.BuildError as build_error:
        print(f"Instance container build failed: {build_error}")
        print("Build log (last 50 lines):")
        print_docker_stream(list(build_error.build_log)[-50:])
        exit(1)
    """
    # This makes the builds a lot faster since I recently learned that the
    # docker python API uses an old version of the docker API which does not
    # support buildx
    ret_code = os.system(f"docker build -t {config.INSTANCE_TAG} instance/")
    if ret_code != 0:
        sys.exit(ret_code)

    log.debug(f"Finished building {config.INSTANCE_TAG}")

    # Setup statsd
    statsd = StatsClient()
    statsd.gauge(f"{STAT_PREFIX}.died_early_cumulative", 0)

    log.info("Monitoring redis for events, press Ctrl-C to stop...")
    while(True):
        # -- Add new containers if needed --
        # Ensure booting counter is not negative
        try:
            booting = r.get(config.REDIS_BOOTING_COUNTER)
        except redis.exceptions.ConnectionError:
            log.error("Lost connection to redis, stopping script...")
            sigint_handler(None,None)

        # Check booting counter
        if booting == None or dint(booting) < 0:
            r.set(config.REDIS_BOOTING_COUNTER, 0)

        # Log number of containers to statsd
        queue_len = dint(r.llen(config.REDIS_QUEUE))
        booting = dint(r.get(config.REDIS_BOOTING_COUNTER))
        statsd.gauge(f"{STAT_PREFIX}.running_containers", len(RUNNING_CONTAINERS))
        statsd.gauge(f"{STAT_PREFIX}.container_queue", queue_len)
        statsd.gauge(f"{STAT_PREFIX}.booting", booting)

        # -- Add new containers --
        if queue_len + booting < config.POOL_SIZE:
            r.incr(config.REDIS_BOOTING_COUNTER)
            statsd.gauge(f"{STAT_PREFIX}.started_containers", 1, delta=True)
            with statsd.timer(f"{STAT_PREFIX}.create_container"):
                # Create docker container
                c = create_container(client, config.INSTANCE_TAG)
                r.rpush(config.REDIS_QUEUE, f"{c.name}|||{c.id[:12]}")
            log.info(f"Started new container: {c.name}")
            r.decr(config.REDIS_BOOTING_COUNTER)

        # -- Remove old containers --
        old_cont = r.lrange(config.REDIS_OLD_LIST, 0, -1)
        if len(old_cont) > 0:
            for cont in old_cont:
                if stop_container(client, cont.decode()):
                    r.lpop(config.REDIS_OLD_LIST)
                    log.info("Stopped old container %s", cont.decode())

        # -- Check for any early exited containers ---
        stopped_conts = get_stopped_containers(client, config.INSTANCE_TAG)
        statsd.gauge(f"{STAT_PREFIX}.died_early_cumulative", len(stopped_conts), delta=True)
        if len(stopped_conts) > 0:
            log.warning("There are some containers that stopped early")
            for cont in stopped_conts:
                stop_container(client, cont.id)

        sleep(config.CHECK_INTERVAL)

