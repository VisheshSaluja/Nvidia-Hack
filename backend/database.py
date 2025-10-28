import os
from datetime import datetime
from typing import Iterator, Optional

from sqlmodel import Field, Session, SQLModel, create_engine


DATABASE_URL = os.getenv("AUTO_MEDICINE_DB", "sqlite:///./auto_medicine.db")
engine = create_engine(
    DATABASE_URL, echo=False, connect_args={"check_same_thread": False}
)


class PrescriptionRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    encrypted_payload: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ScheduleRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    encrypted_payload: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AdherenceRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    status: str
    recorded_at: datetime = Field(default_factory=datetime.utcnow)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session

