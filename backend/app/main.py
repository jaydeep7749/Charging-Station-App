import os
from dotenv import load_dotenv
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import SessionLocal, engine, get_db

# Load environment variables
load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Charging Station API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Charging Station API"}

@app.get("/stations", response_model=list[schemas.Station])
def read_stations(
    skip: int = 0,
    limit: int = Query(10, le=100),
    search: Optional[str] = None,
    status: Optional[schemas.StatusEnum] = None,
    db: Session = Depends(get_db)
):
    stations = crud.get_stations(db, skip=skip, limit=limit, search=search, status=status)
    return stations

@app.get("/stations/{station_id}", response_model=schemas.Station)
def read_station(station_id: int, db: Session = Depends(get_db)):
    station = crud.get_station(db, station_id=station_id)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return station

@app.post("/stations", response_model=schemas.Station, status_code=201)
def create_station(station: schemas.StationCreate, db: Session = Depends(get_db)):
    return crud.create_station(db=db, station=station)

@app.put("/stations/{station_id}", response_model=schemas.Station)
def update_station(
    station_id: int,
    station_update: schemas.StationUpdate,
    db: Session = Depends(get_db)
):
    updated_station = crud.update_station(db, station_id, station_update)
    if updated_station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return updated_station

@app.delete("/stations/{station_id}")
def delete_station(station_id: int, db: Session = Depends(get_db)):
    success = crud.delete_station(db, station_id)
    if not success:
        raise HTTPException(status_code=404, detail="Station not found")
    return {"message": "Station deleted successfully"}

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    stats = crud.get_station_stats(db)
    stats["timestamp"] = "live"
    return stats