from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Header, Request, Query
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
import os
import mimetypes

from apps.api.database import get_db
from apps.api.routes.auth import get_current_user
from apps.api.models.user import User as UserModel
from apps.api.services.file_service import FileService
from apps.api.schemas.file import (
    FileItem, CreateDirRequest, DeleteItemRequest, MoveItemRequest, RenameItemRequest,
    UploadInitRequest, UploadInitResponse, UploadChunkResponse, UploadCompleteRequest, UploadCompleteResponse
)
from apps.api.core.config import settings

router = APIRouter(prefix="/api/files", tags=["files"])

def get_file_service(db: Session = Depends(get_db)):
    return FileService(db)

@router.get("/list", response_model=List[FileItem])
def list_files(
    path: str = "",
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    return file_service.list_directory(path)

@router.post("/mkdir")
def create_directory(
    req: CreateDirRequest,
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    path = file_service.create_directory(req.path, req.name)
    return {"path": path, "message": "Directory created successfully"}

@router.delete("/delete")
def delete_item(
    req: DeleteItemRequest,
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    file_service.delete_item(req.paths)
    return {"message": "Items deleted successfully"}

@router.post("/move")
def move_item(
    req: MoveItemRequest,
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    file_service.move_item(req.src, req.dst)
    return {"message": "Item moved successfully"}

@router.post("/rename")
def rename_item(
    req: RenameItemRequest,
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    file_service.rename_item(req.path, req.new_name)
    return {"message": "Item renamed successfully"}

# Chunked Upload
@router.post("/upload/init", response_model=UploadInitResponse)
def init_upload(
    req: UploadInitRequest,
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    session_id = file_service.init_upload(req.filename, req.total_size, req.path)
    return {"session_id": session_id}

@router.post("/upload/chunk/{session_id}")
async def upload_chunk(
    session_id: str,
    chunk_index: int = Form(...),
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    content = await file.read()
    file_service.save_chunk(session_id, chunk_index, content)
    return {"status": "success"}

@router.post("/upload/complete", response_model=UploadCompleteResponse)
def complete_upload(
    req: UploadCompleteRequest,
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    path = file_service.complete_upload(req.session_id)
    return {"path": path, "message": "Upload completed and file merged successfully"}

# Download with Range Support
@router.get("/download")
async def download_file(
    path: str,
    request: Request,
    current_user: UserModel = Depends(get_current_user),
    file_service: FileService = Depends(get_file_service)
):
    full_path = file_service._safe_join(path)
    if not full_path.exists() or not full_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    
    file_size = full_path.stat().st_size
    range_header = request.headers.get("Range")
    
    mime_type, _ = mimetypes.guess_type(str(full_path))
    if not mime_type:
        mime_type = "application/octet-stream"

    if range_header:
        # Simple Range parsing: bytes=start-end
        try:
            range_str = range_header.replace("bytes=", "")
            start_str, end_str = range_str.split("-")
            start = int(start_str)
            end = int(end_str) if end_str else file_size - 1
            
            if start >= file_size or end >= file_size or start > end:
                raise HTTPException(status_code=416, detail="Requested range not satisfiable")
            
            chunk_size = (end - start) + 1
            
            def iter_file_range(p, s, c):
                with open(p, "rb") as f:
                    f.seek(s)
                    yield f.read(c)

            headers = {
                "Content-Range": f"bytes {start}-{end}/{file_size}",
                "Accept-Ranges": "bytes",
                "Content-Length": str(chunk_size),
                "Content-Type": mime_type,
            }
            return StreamingResponse(iter_file_range(full_path, start, chunk_size), status_code=206, headers=headers)
        except Exception as e:
            # Fallback to full file if range parsing fails
            pass
            
    return FileResponse(
        path=full_path,
        media_type=mime_type,
        filename=full_path.name,
        headers={"Accept-Ranges": "bytes"}
    )
