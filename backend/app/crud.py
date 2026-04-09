from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
import models
import schemas
from typing import List, Optional


def get_stations(
        db: Session,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        status: Optional[schemas.StatusEnum] = None
) -> List[models.Station]:
    query = db.query(models.Station)

    if search:
        query = query.filter(
            or_(
                models.Station.name.contains(search),
                models.Station.address.contains(search)
            )
        )

    if status:
        query = query.filter(models.Station.status == status)

    return query.offset(skip).limit(limit).all()


def get_station(db: Session, station_id: int):
    return db.query(models.Station).filter(models.Station.id == station_id).first()


def create_station(db: Session, station: schemas.StationCreate):
    db_station = models.Station(**station.dict())
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station


def update_station(
        db: Session,
        station_id: int,
        station_update: schemas.StationUpdate
):
    db_station = db.query(models.Station).filter(models.Station.id == station_id).first()
    if db_station:
        update_data = station_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_station, field, value)
        db.commit()
        db.refresh(db_station)
    return db_station


def delete_station(db: Session, station_id: int):
    db_station = db.query(models.Station).filter(models.Station.id == station_id).first()
    if db_station:
        db.delete(db_station)
        db.commit()
        return True
    return False


def get_station_stats(db: Session):
    total = db.query(models.Station).count()
    stats = db.query(
        models.Station.status,
        db.func.count(models.Station.id)
    ).group_by(models.Station.status).all()

    status_counts = {stat[0].value: stat[1] for stat in stats}
    return {
        "total": total,
        "operational": status_counts.get("Operational", 0),
        "maintenance": status_counts.get("Maintenance", 0),
        "inactive": status_counts.get("Inactive", 0)
    }