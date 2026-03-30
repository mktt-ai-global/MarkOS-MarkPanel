from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from apps.api.database import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String, default="zh_CN")
    theme = Column(String, default="light")
    storage_root = Column(String, nullable=True) # If null, use the default from settings.STORAGE_ROOT
    notification_config = Column(JSON, default={})
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
