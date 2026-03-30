from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends
from typing import List, Optional
from apps.api.services.docker_service import docker_service
from apps.api.schemas.docker import ContainerInfo, ActionRequest
from apps.api.routes.auth import get_current_user, get_current_user_ws
from apps.api.models.user import User as UserModel
import asyncio

router = APIRouter(tags=["docker"])

@router.get("/api/docker/containers", response_model=List[ContainerInfo])
async def list_containers(current_user: UserModel = Depends(get_current_user)):
    """List all Docker containers."""
    return docker_service.list_containers()

@router.post("/api/docker/{container_id}/action")
async def container_action(
    container_id: str,
    request: ActionRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """Perform action (start, stop, restart, remove) on a container."""
    success = docker_service.container_action(container_id, request.action)
    if not success:
        raise HTTPException(status_code=400, detail=f"Action '{request.action}' failed for container '{container_id}'")
    return {"status": "success"}

@router.websocket("/ws/docker/logs/{container_id}")
async def container_logs(
    websocket: WebSocket,
    container_id: str,
    current_user: Optional[UserModel] = Depends(get_current_user_ws)
):
    """Stream container logs via WebSocket."""
    if not current_user:
        return
    await websocket.accept()
    
    try:
        # Docker log stream is a generator
        log_stream = docker_service.get_container_logs(container_id)
        if not log_stream:
            await websocket.send_text("Error: Could not access container logs.")
            await websocket.close()
            return
            
        # Function to read logs in background thread
        def read_and_send():
            try:
                for line in log_stream:
                    if isinstance(line, bytes):
                        line = line.decode('utf-8', errors='replace')
                    loop.call_soon_threadsafe(
                        lambda l=line: loop.create_task(websocket.send_text(l))
                    )
            except Exception as e:
                loop.call_soon_threadsafe(
                    lambda err=str(e): loop.create_task(websocket.send_text(f"Error: {err}"))
                )

        loop = asyncio.get_running_loop()
        # Better: run the blocking iteration in a separate thread
        await loop.run_in_executor(None, read_and_send)
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_text(f"Error: {str(e)}")
        except:
            pass
    finally:
        pass
