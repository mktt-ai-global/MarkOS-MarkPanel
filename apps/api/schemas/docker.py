from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ContainerInfo(BaseModel):
    id: str
    name: str
    status: str
    image: str
    ports: Dict[str, Any]
    created: Optional[str] = None

class ActionRequest(BaseModel):
    action: str  # start, stop, restart, remove
