from fastapi import APIRouter, Depends, HTTPException, status, Query
from apps.api.database import get_db
from apps.api.services.shortcut_service import ShortcutsService, get_shortcuts_service
from apps.api.services.favicon_service import FaviconService, get_favicon_service
from apps.api.schemas.shortcut import (
    Shortcut, ShortcutCreate, ShortcutUpdate,
    ShortcutCategory, ShortcutCategoryCreate, ShortcutCategoryUpdate
)
from apps.api.models.user import User as UserModel
from apps.api.routes.auth import get_current_user
from sqlalchemy.orm import Session
from typing import List, Optional

router = APIRouter(prefix="/api/shortcuts", tags=["shortcuts"])

# Categories
@router.get("/categories", response_model=List[ShortcutCategory])
async def get_categories(
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    return service.get_categories(current_user.id)

@router.post("/categories", response_model=ShortcutCategory)
async def create_category(
    category: ShortcutCategoryCreate,
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    return service.create_category(current_user.id, category)

@router.put("/categories/{category_id}", response_model=ShortcutCategory)
async def update_category(
    category_id: int,
    category: ShortcutCategoryUpdate,
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    db_category = service.update_category(current_user.id, category_id, category)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    success = service.delete_category(current_user.id, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"status": "success"}

@router.post("/categories/reorder")
async def reorder_categories(
    category_ids: List[int],
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    service.reorder_categories(current_user.id, category_ids)
    return {"status": "success"}

# Shortcuts
@router.get("/", response_model=List[Shortcut])
async def get_shortcuts(
    category_id: Optional[int] = Query(None),
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    return service.get_shortcuts(current_user.id, category_id)

@router.post("/", response_model=Shortcut)
async def create_shortcut(
    shortcut: ShortcutCreate,
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    return service.create_shortcut(current_user.id, shortcut)

@router.put("/{shortcut_id}", response_model=Shortcut)
async def update_shortcut(
    shortcut_id: int,
    shortcut: ShortcutUpdate,
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    db_shortcut = service.update_shortcut(current_user.id, shortcut_id, shortcut)
    if not db_shortcut:
        raise HTTPException(status_code=404, detail="Shortcut not found")
    return db_shortcut

@router.delete("/{shortcut_id}")
async def delete_shortcut(
    shortcut_id: int,
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    success = service.delete_shortcut(current_user.id, shortcut_id)
    if not success:
        raise HTTPException(status_code=404, detail="Shortcut not found")
    return {"status": "success"}

@router.post("/reorder")
async def reorder_shortcuts(
    category_id: int,
    shortcut_ids: List[int],
    current_user: UserModel = Depends(get_current_user),
    service: ShortcutsService = Depends(get_shortcuts_service)
):
    service.reorder_shortcuts(current_user.id, category_id, shortcut_ids)
    return {"status": "success"}

# Favicon
@router.get("/favicon")
async def get_favicon(
    url: str,
    favicon_service: FaviconService = Depends(get_favicon_service)
):
    icon_url = await favicon_service.get_favicon(url)
    return {"icon": icon_url}
