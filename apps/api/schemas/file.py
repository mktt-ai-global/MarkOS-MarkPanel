from pydantic import BaseModel
from typing import List, Optional, Any

class FileItem(BaseModel):
    name: str
    path: str
    is_dir: bool
    size: int
    mtime: float
    extension: Optional[str] = None

class CreateDirRequest(BaseModel):
    path: str
    name: str

class DeleteItemRequest(BaseModel):
    paths: List[str]

class MoveItemRequest(BaseModel):
    src: str
    dst: str

class RenameItemRequest(BaseModel):
    path: str
    new_name: str

class UploadInitRequest(BaseModel):
    filename: str
    total_size: int
    path: str

class UploadInitResponse(BaseModel):
    session_id: str

class UploadChunkResponse(BaseModel):
    status: str
    chunks_uploaded: List[int]

class UploadCompleteRequest(BaseModel):
    session_id: str

class UploadCompleteResponse(BaseModel):
    path: str
    message: str
