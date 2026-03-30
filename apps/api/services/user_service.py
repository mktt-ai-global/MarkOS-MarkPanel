from sqlalchemy.orm import Session
from apps.api.models.user import User
from apps.api.schemas.user import UserUpdate, UserPasswordUpdate
from apps.api.core.security import get_password_hash, verify_password
from apps.api.database import get_db
from fastapi import HTTPException, status, Depends

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def update_profile(self, user_id: int, user_update: UserUpdate):
        db_user = self.get_user_by_id(user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        update_data = user_update.dict(exclude_unset=True)
        
        if "old_password" in update_data and "new_password" in update_data:
            if not verify_password(update_data["old_password"], db_user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Incorrect old password"
                )
            db_user.hashed_password = get_password_hash(update_data["new_password"])
        
        # Remove passwords from update_data so they aren't accidentally set by setattr
        update_data.pop("old_password", None)
        update_data.pop("new_password", None)
        
        for key, value in update_data.items():
            setattr(db_user, key, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)
