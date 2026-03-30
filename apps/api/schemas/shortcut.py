from pydantic import BaseModel
from typing import List, Optional

class ShortcutBase(BaseModel):
    name: str
    url: str
    icon: Optional[str] = None
    category_id: int
    sort_order: Optional[int] = 0
    is_internal: Optional[bool] = False
    port: Optional[int] = None

class ShortcutCreate(ShortcutBase):
    pass

class ShortcutUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    category_id: Optional[int] = None
    sort_order: Optional[int] = None
    is_internal: Optional[bool] = None
    port: Optional[int] = None

class Shortcut(ShortcutBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class ShortcutCategoryBase(BaseModel):
    name: str
    sort_order: Optional[int] = 0

class ShortcutCategoryCreate(ShortcutCategoryBase):
    pass

class ShortcutCategoryUpdate(BaseModel):
    name: Optional[str] = None
    sort_order: Optional[int] = None

class ShortcutCategory(ShortcutCategoryBase):
    id: int
    user_id: int
    shortcuts: List[Shortcut] = []

    class Config:
        from_attributes = True
