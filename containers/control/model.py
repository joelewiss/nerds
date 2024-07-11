from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, DateTime, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class CreatedInstances(Base):
    __tablename__ = "createdInstances"
    id = Column(Integer, primary_key=True)
    userid = Column(String)
    ip = Column(String)
    origin = Column(Integer)
    time = Column(DateTime, default=func.current_timestamp())
    ec2instance = Column(String)
    category = Column(Integer)
    condition = Column(Integer)
    instanceid = Column(String)
    finished = Column(Boolean)
    heartbeat = Column(DateTime, default=func.current_timestamp())
    instanceTerminated = Column(Boolean)

class Jupyter(Base):
    __tablename__ = "jupyter"
    id = Column(Integer, primary_key=True)
    userid = Column(String)
    token = Column(String)
    code = Column(JSON)
    time = Column(JSON)
    status = Column(String)
    date = Column(DateTime)
