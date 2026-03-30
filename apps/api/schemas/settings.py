from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class SystemSettingsBase(BaseModel):
    language: Optional[str] = "zh_CN"
    theme: Optional[str] = "light"
    storage_root: Optional[str] = None
    notification_config: Optional[Dict[str, Any]] = {}

class SystemSettingsUpdate(SystemSettingsBase):
    pass

class SystemSettings(SystemSettingsBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
