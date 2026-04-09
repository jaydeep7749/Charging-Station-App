from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func

import enum

from .database import Base


class StatusEnum(enum.Enum):
    OPERATIONAL = "Operational"
    MAINTENANCE = "Maintenance"
    INACTIVE = "Inactive"


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    pincode = Column(String(10), nullable=False)
    connector_type = Column(String(50), nullable=False)
    status = Column(Enum(StatusEnum), default=StatusEnum.OPERATIONAL)
    image = Column(String(500))
    location_link = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())