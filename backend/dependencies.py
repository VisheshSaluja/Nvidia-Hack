import os

from fastapi import Header, HTTPException, status


CLIENT_KEY = os.getenv("AUTO_MEDICINE_CLIENT_KEY")


async def verify_client_key(x_client_key: str | None = Header(default=None)) -> None:
    if not CLIENT_KEY:
        return
    if x_client_key != CLIENT_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid client key")

