from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from apps.api.database import Base

class ShortcutCategory(Base):
    __tablename__ = "shortcut_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    sort_order = Column(Integer, default=0)

    shortcuts = relationship("Shortcut", back_populates="category", cascade="all, delete-orphan")

class Shortcut(Base):
    __tablename__ = "shortcuts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    icon = Column(String)  # URL or Emoji
    category_id = Column(Integer, ForeignKey("shortcut_categories.id"))
    sort_order = Column(Integer, default=0)
    is_internal = Column(Boolean, default=False)
    port = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    category = relationship("ShortcutCategory", back_populates="shortcuts")
