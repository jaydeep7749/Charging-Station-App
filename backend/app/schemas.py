from pydantic import BaseModel, HttpUrl, Field
from typing import Optional
from enum import Enum
from datetime import datetime


class StatusEnum(str, Enum):
    OPERATIONAL = "Operational"
    MAINTENANCE = "Maintenance"
    INACTIVE = "Inactive"


class StationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    address: str = Field(..., min_length=5, max_length=255)
    pincode: str = Field(..., pattern=r"^\d{6}$")
    connector_type: str = Field(..., min_length=1, max_length=50)
    status: StatusEnum = StatusEnum.OPERATIONAL
    image: Optional[str] = None
    location_link: Optional[HttpUrl] = None


class StationCreate(StationBase):
    pass


class StationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, min_length=5, max_length=255)
    pincode: Optional[str] = Field(None, pattern=r"^\d{6}$")
    connector_type: Optional[str] = Field(None, min_length=1, max_length=50)
    status: Optional[StatusEnum] = None
    image: Optional[str] = None
    location_link: Optional[HttpUrl] = None


class Station(StationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True