from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from apps.api.database import Base

class UploadSession(Base):
    __tablename__ = "upload_sessions"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String)
    total_size = Column(Integer)
    chunks_uploaded = Column(JSON, default=[]) # List of uploaded chunk numbers
    status = Column(String, default="pending") # pending, uploading, completed, error
    path = Column(String, index=True) # Destination path
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class FileShare(Base):
    __tablename__ = "file_shares"

    id = Column(String, primary_key=True, index=True)
    path = Column(String, index=True)
    token = Column(String, unique=True, index=True)
    expires_at = Column(DateTime(timezone=True))
    max_downloads = Column(Integer, default=-1) # -1 for unlimited
    download_count = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
