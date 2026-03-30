import os
import shutil
import uuid
import json
from typing import List, Optional, Dict, Any
from pathlib import Path
from sqlalchemy.orm import Session
from apps.api.models.file import UploadSession
from apps.api.core.config import settings
from fastapi import HTTPException, status

class FileService:
    def __init__(self, db: Session = None):
        self.db = db
        self.storage_root = Path(settings.STORAGE_ROOT).resolve()

    def _safe_join(self, *paths: str) -> Path:
        """Join paths and ensure the resulting path is within STORAGE_ROOT."""
        try:
            full_path = self.storage_root.joinpath(*paths).resolve()
            if not str(full_path).startswith(str(self.storage_root)):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Access denied: Path is outside storage root"
                )
            return full_path
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid path"
            )

    def list_directory(self, path: str = "") -> List[Dict[str, Any]]:
        full_path = self._safe_join(path)
        if not full_path.exists():
            raise HTTPException(status_code=404, detail="Directory not found")
        if not full_path.is_dir():
            raise HTTPException(status_code=400, detail="Not a directory")

        results = []
        for entry in full_path.iterdir():
            stat = entry.stat()
            results.append({
                "name": entry.name,
                "path": str(entry.relative_to(self.storage_root)),
                "is_dir": entry.is_dir(),
                "size": stat.st_size if entry.is_file() else 0,
                "mtime": stat.st_mtime,
                "extension": entry.suffix if entry.is_file() else None
            })
        return sorted(results, key=lambda x: (not x["is_dir"], x["name"].lower()))

    def create_directory(self, path: str, name: str) -> str:
        parent_path = self._safe_join(path)
        new_dir = parent_path / name
        if new_dir.exists():
            raise HTTPException(status_code=400, detail="Directory already exists")
        new_dir.mkdir(parents=True, exist_ok=True)
        return str(new_dir.relative_to(self.storage_root))

    def delete_item(self, paths: List[str]):
        for path in paths:
            full_path = self._safe_join(path)
            if not full_path.exists():
                continue
            if full_path.is_dir():
                shutil.rmtree(full_path)
            else:
                full_path.unlink()

    def move_item(self, src: str, dst: str):
        src_path = self._safe_join(src)
        dst_path = self._safe_join(dst)
        
        if not src_path.exists():
            raise HTTPException(status_code=404, detail=f"Source {src} not found")
        
        # Ensure destination parent exists
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        
        shutil.move(str(src_path), str(dst_path))

    def rename_item(self, path: str, new_name: str):
        old_path = self._safe_join(path)
        if not old_path.exists():
            raise HTTPException(status_code=404, detail="Path not found")
        
        new_path = old_path.parent / new_name
        if new_path.exists():
            raise HTTPException(status_code=400, detail="Name already exists")
        
        old_path.rename(new_path)

    # Chunked Upload methods
    def init_upload(self, filename: str, total_size: int, path: str) -> str:
        session_id = str(uuid.uuid4())
        upload_path = self._safe_join(path) / filename
        
        # Ensure path is safe for upload
        if upload_path.exists():
            # Optionally add a suffix if file exists, or let user decide.
            # Here we just allow it for simplicity or throw error.
            pass

        new_session = UploadSession(
            id=session_id,
            filename=filename,
            total_size=total_size,
            path=str(upload_path.relative_to(self.storage_root)),
            chunks_uploaded=[],
            status="uploading"
        )
        self.db.add(new_session)
        self.db.commit()
        
        # Create a temp directory for chunks
        temp_dir = Path(settings.UPLOAD_TEMP_DIR) / session_id
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        return session_id

    def save_chunk(self, session_id: str, chunk_index: int, chunk_data: bytes):
        session = self.db.query(UploadSession).filter(UploadSession.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Upload session not found")
        
        temp_dir = Path(settings.UPLOAD_TEMP_DIR) / session_id
        if not temp_dir.exists():
             temp_dir.mkdir(parents=True, exist_ok=True)

        chunk_path = temp_dir / f"chunk_{chunk_index}"
        with open(chunk_path, "wb") as f:
            f.write(chunk_data)
        
        # Update session chunks
        chunks = list(session.chunks_uploaded or [])
        if chunk_index not in chunks:
            chunks.append(chunk_index)
            session.chunks_uploaded = chunks
            self.db.commit()

    def complete_upload(self, session_id: str):
        session = self.db.query(UploadSession).filter(UploadSession.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Upload session not found")
        
        temp_dir = Path(settings.UPLOAD_TEMP_DIR) / session_id
        dest_path = self._safe_join(session.path)
        
        # Ensure destination parent exists
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Merge chunks
        chunks = sorted(session.chunks_uploaded)
        with open(dest_path, "wb") as outfile:
            for i in chunks:
                chunk_path = temp_dir / f"chunk_{i}"
                if not chunk_path.exists():
                    raise HTTPException(status_code=400, detail=f"Chunk {i} missing")
                with open(chunk_path, "rb") as infile:
                    outfile.write(infile.read())
        
        # Clean up
        shutil.rmtree(temp_dir)
        session.status = "completed"
        self.db.commit()
        
        return str(dest_path.relative_to(self.storage_root))
