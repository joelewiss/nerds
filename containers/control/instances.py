import logging
import config
from sqlalchemy import text, select
from model import CreatedInstances

log = logging.getLogger(__name__)

HEARTBEAT_FILTER = """\
(heartbeat <= NOW() - '{}'::INTERVAL AND \
"instanceTerminated" is false) OR \
(finished is true AND "instanceTerminated" is false)"""

# Find instances that have been assigned for more than the interval.
# This provides a strict time limit from study start instead of idle time.
# Pretty sure the `time` value is only updated when the instance is assigned. See landing howTo.php line 126
ASSIGNED_FILTER = """\
(heartbeat <= NOW() - '{}'::INTERVAL AND \
"instanceTerminated" is false) OR \
(finished is true AND "instanceTerminated" is false)"""


def check_old_instances(session_builder, redis):
    stmt = select(CreatedInstances).where(text(ASSIGNED_FILTER.format(config.INSTANCE_IDLE_TIME)))
    with session_builder.begin() as session:
        result = session.execute(stmt)

        for instance in result.scalars().all():
            if instance.instanceid is not None:
                log.info("Terminating %s %s",
                         instance.ec2instance,
                         instance.instanceid)
                redis.rpush(config.REDIS_OLD_LIST, instance.instanceid)
                instance.instanceTerminated = True
