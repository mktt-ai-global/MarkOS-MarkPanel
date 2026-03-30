import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "MarkPanel"
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    STORAGE_ROOT: str = os.getenv("STORAGE_ROOT", "/tmp/markpanel_storage")
    UPLOAD_TEMP_DIR: str = os.getenv("UPLOAD_TEMP_DIR", "/tmp/markpanel_uploads")
    MAX_UPLOAD_SIZE_GB: int = 50
    WEATHER_API_KEY: Optional[str] = os.getenv("WEATHER_API_KEY")
    WEATHER_CITY: Optional[str] = os.getenv("WEATHER_CITY", "Shanghai")

settings = Settings()

if not settings.SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable must be set!")

# Ensure directories exist
os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
os.makedirs(settings.UPLOAD_TEMP_DIR, exist_ok=True)
