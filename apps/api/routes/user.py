from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from apps.api.database import get_db
from apps.api.models.user import User as UserModel
from apps.api.schemas.user import User as UserSchema, UserUpdate, UserPasswordUpdate
from apps.api.services.user_service import UserService, get_user_service
from apps.api.routes.auth import get_current_user

router = APIRouter(prefix="/api/user", tags=["user"])

@router.get("/profile", response_model=UserSchema)
def get_profile(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserSchema)
def update_profile(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
    user_service: UserService = Depends(get_user_service)
):
    return user_service.update_profile(current_user.id, user_update)
