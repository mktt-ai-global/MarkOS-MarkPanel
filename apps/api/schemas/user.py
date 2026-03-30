from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    old_password: Optional[str] = None
    new_password: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    old_password: str
    new_password: str

class User(UserBase):
    id: int
    is_active: bool
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
