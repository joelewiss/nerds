import logging

from sqlalchemy import func, select

from statsd import StatsClient
from model import CreatedInstances, Jupyter

STAT_PREFIX = "devob.control"
statsd = StatsClient("stats")
log = logging.getLogger(__name__)


def get_stats(session_builder):
    """Retrieves various statistics from the database and submits it to
    statsd"""

    with session_builder.begin() as session:
        # Get number of finished instances
        stmt = select(func.count(CreatedInstances.id))\
               .where(CreatedInstances.finished == True)
        finished = session.execute(stmt).scalar()
        statsd.gauge(f"{STAT_PREFIX}.finished_instances", finished)

        # Get number of terminated instances
        stmt = select(func.count(CreatedInstances.id))\
               .where(CreatedInstances.instanceTerminated == True)
        terminated = session.execute(stmt).scalar()
        statsd.gauge(f"{STAT_PREFIX}.terminated_instances", terminated)

        # Log abandoned instances, those which were killed due to old age
        abandoned = terminated - finished
        statsd.gauge(f"{STAT_PREFIX}.abandoned_instances", abandoned)

        # Get total number of jupyter events in table
        stmt = select(func.count(Jupyter.id))
        total = session.execute(stmt).scalar()
        statsd.gauge(f"{STAT_PREFIX}.total_jupyter", total)

        log.debug("Sent statistics to statsd")
