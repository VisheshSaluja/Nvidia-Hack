from contextlib import asynccontextmanager
from typing import AsyncIterator

from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_and_tables
from routes import bottle, prescription, progress, schedule
from services.mcp_orchestrator import orchestrator

load_dotenv()
scheduler = BackgroundScheduler()

allow_origins=["http://localhost:3000", "exp://*", "https://yourapp.com"]

def _tick_demo_reminders() -> None:
    """Simulate reminder dispatches so the demo shows activity."""
    orchestrator.simulate_dispatch_reminders()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    create_db_and_tables()
    scheduler.add_job(
        _tick_demo_reminders,
        "interval",
        minutes=1,
        id="demo-reminders",
        replace_existing=True,
    )
    scheduler.start()
    try:
        yield
    finally:
        scheduler.shutdown(wait=False)


app = FastAPI(
    title="Auto Medicine Reminder API",
    version="0.1.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(prescription.router)
app.include_router(schedule.router)
app.include_router(bottle.router)
app.include_router(progress.router)

@app.get("/")
def read_root():
    return {"status": "Backend is running ✅", "message": "Welcome to Auto Medicine Reminder API"}

@app.get("/healthz")
def healthz():
    return {"status": "ok"}
