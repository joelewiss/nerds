# Joe Lewis 2021
#
# This software may be modified and distributed under the terms
# of the MIT license.  See the LICENSE file for details.
import logging
import sys
from time import sleep

import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

import config
from instances import check_old_instances
from stats import get_stats

# Setup SQL Alchemy
engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
session_builder = sessionmaker(bind=engine)

# Setup logging
logging.basicConfig(stream=sys.stdout, level=config.LOG_LEVEL)
log = logging.getLogger(__name__)

if __name__ == "__main__":
    redis = redis.Redis(host="redis", port=6379, db=0)
    log.info("Starting control script.")

    while True:
        try:
            check_old_instances(session_builder, redis)
            get_stats(session_builder)
            sleep(config.CHECK_INTERVAL)
        except OperationalError as e:
            if "Connection refused" in str(e):
                log.warn("Couldn't connect to database, ignoring")
                sleep(2)
            else:
                raise
