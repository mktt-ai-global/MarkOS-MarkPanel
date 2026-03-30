import os
from pathlib import Path
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from apps.api.models.settings import SystemSettings
from apps.api.schemas.settings import SystemSettingsUpdate
from apps.api.core.config import settings
from fastapi import HTTPException, Depends
from apps.api.database import get_db

class SettingsService:
    # Class-level cache for system settings
    _cached_settings: Optional[SystemSettings] = None

    def __init__(self, db: Session):
        self.db = db

    def get_settings(self) -> SystemSettings:
        if SettingsService._cached_settings:
            return SettingsService._cached_settings
        
        db_settings = self.db.query(SystemSettings).first()
        if not db_settings:
            # Create default settings if not exists
            db_settings = SystemSettings(
                language="zh_CN",
                theme="light",
                storage_root=settings.STORAGE_ROOT,
                notification_config={}
            )
            self.db.add(db_settings)
            self.db.commit()
            self.db.refresh(db_settings)
        
        SettingsService._cached_settings = db_settings
        return db_settings

    def update_settings(self, settings_update: SystemSettingsUpdate) -> SystemSettings:
        db_settings = self.get_settings()
        
        update_data = settings_update.dict(exclude_unset=True)
        
        if "storage_root" in update_data and update_data["storage_root"]:
            self._validate_storage_path(update_data["storage_root"])
            
        for key, value in update_data.items():
            setattr(db_settings, key, value)
        
        self.db.commit()
        self.db.refresh(db_settings)
        
        # Invalidate cache
        SettingsService._cached_settings = db_settings
        return db_settings

    def _validate_storage_path(self, path: str):
        p = Path(path).resolve()
        if not p.exists():
            try:
                p.mkdir(parents=True, exist_ok=True)
            except Exception:
                raise HTTPException(status_code=400, detail=f"Cannot create directory: {path}")
        
        if not os.access(p, os.W_OK):
            raise HTTPException(status_code=400, detail=f"Path is not writable: {path}")
        
        return str(p)

def get_settings_service(db: Session = Depends(get_db)):
    return SettingsService(db)
