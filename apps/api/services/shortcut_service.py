from sqlalchemy.orm import Session
from fastapi import Depends
from apps.api.database import get_db
from apps.api.models.shortcut import Shortcut, ShortcutCategory
from apps.api.schemas.shortcut import ShortcutCreate, ShortcutUpdate, ShortcutCategoryCreate, ShortcutCategoryUpdate
from typing import List, Optional

class ShortcutsService:
    def __init__(self, db: Session):
        self.db = db

    def get_categories(self, user_id: int) -> List[ShortcutCategory]:
        return self.db.query(ShortcutCategory).filter(ShortcutCategory.user_id == user_id).order_by(ShortcutCategory.sort_order).all()

    def create_category(self, user_id: int, category: ShortcutCategoryCreate) -> ShortcutCategory:
        db_category = ShortcutCategory(**category.dict(), user_id=user_id)
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def update_category(self, user_id: int, category_id: int, category: ShortcutCategoryUpdate) -> ShortcutCategory:
        db_category = self.db.query(ShortcutCategory).filter(ShortcutCategory.id == category_id, ShortcutCategory.user_id == user_id).first()
        if not db_category:
            return None
        
        update_data = category.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def delete_category(self, user_id: int, category_id: int) -> bool:
        db_category = self.db.query(ShortcutCategory).filter(ShortcutCategory.id == category_id, ShortcutCategory.user_id == user_id).first()
        if not db_category:
            return False
        
        self.db.delete(db_category)
        self.db.commit()
        return True

    def get_shortcuts(self, user_id: int, category_id: Optional[int] = None) -> List[Shortcut]:
        query = self.db.query(Shortcut).filter(Shortcut.user_id == user_id)
        if category_id:
            query = query.filter(Shortcut.category_id == category_id)
        return query.order_by(Shortcut.sort_order).all()

    def create_shortcut(self, user_id: int, shortcut: ShortcutCreate) -> Shortcut:
        db_shortcut = Shortcut(**shortcut.dict(), user_id=user_id)
        self.db.add(db_shortcut)
        self.db.commit()
        self.db.refresh(db_shortcut)
        return db_shortcut

    def update_shortcut(self, user_id: int, shortcut_id: int, shortcut: ShortcutUpdate) -> Shortcut:
        db_shortcut = self.db.query(Shortcut).filter(Shortcut.id == shortcut_id, Shortcut.user_id == user_id).first()
        if not db_shortcut:
            return None
        
        update_data = shortcut.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_shortcut, key, value)
        
        self.db.commit()
        self.db.refresh(db_shortcut)
        return db_shortcut

    def delete_shortcut(self, user_id: int, shortcut_id: int) -> bool:
        db_shortcut = self.db.query(Shortcut).filter(Shortcut.id == shortcut_id, Shortcut.user_id == user_id).first()
        if not db_shortcut:
            return False
        
        self.db.delete(db_shortcut)
        self.db.commit()
        return True

    def reorder_categories(self, user_id: int, category_ids: List[int]):
        for index, category_id in enumerate(category_ids):
            self.db.query(ShortcutCategory).filter(
                ShortcutCategory.id == category_id, 
                ShortcutCategory.user_id == user_id
            ).update({"sort_order": index})
        self.db.commit()

    def reorder_shortcuts(self, user_id: int, category_id: int, shortcut_ids: List[int]):
        for index, shortcut_id in enumerate(shortcut_ids):
            self.db.query(Shortcut).filter(
                Shortcut.id == shortcut_id, 
                Shortcut.user_id == user_id,
                Shortcut.category_id == category_id
            ).update({"sort_order": index})
        self.db.commit()

def get_shortcuts_service(db: Session = Depends(get_db)):
    return ShortcutsService(db)
