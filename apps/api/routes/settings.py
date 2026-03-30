from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from apps.api.database import get_db
from apps.api.models.user import User as UserModel
from apps.api.schemas.settings import SystemSettings as SettingsSchema, SystemSettingsUpdate
from apps.api.services.settings_service import SettingsService, get_settings_service
from apps.api.routes.auth import get_current_user

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/config", response_model=SettingsSchema)
def get_config(
    current_user: UserModel = Depends(get_current_user),
    settings_service: SettingsService = Depends(get_settings_service)
):
    return settings_service.get_settings()

@router.put("/config", response_model=SettingsSchema)
def update_config(
    settings_update: SystemSettingsUpdate,
    current_user: UserModel = Depends(get_current_user),
    settings_service: SettingsService = Depends(get_settings_service)
):
    # Only allow authenticated users (could add admin check here)
    return settings_service.update_settings(settings_update)
