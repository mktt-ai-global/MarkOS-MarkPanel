from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Optional
from apps.api.services.terminal_service import terminal_service
from apps.api.routes.auth import get_current_user_ws
from apps.api.models.user import User as UserModel
import asyncio
import json

router = APIRouter(tags=["terminal"])

@router.websocket("/ws/terminal")
async def terminal_websocket(
    websocket: WebSocket,
    current_user: Optional[UserModel] = Depends(get_current_user_ws)
):
    if not current_user:
        return
    await websocket.accept()
    
    # Simple session management: one per connection for now
    # We could use session_id from query params if needed
    session_id = f"term_{id(websocket)}"
    session = terminal_service.create_session(session_id)
    
    # Define callback for terminal data -> websocket
    def send_data(data: bytes):
        try:
            # Send binary data (VT100 codes etc.)
            loop.call_soon_threadsafe(
                lambda: loop.create_task(websocket.send_bytes(data))
            )
        except Exception:
            pass

    session.on_data = send_data
    session.on_exit = lambda: loop.call_soon_threadsafe(
        lambda: loop.create_task(websocket.close())
    )

    loop = asyncio.get_running_loop()
    await session.start()

    try:
        while True:
            # Receive input from client
            message = await websocket.receive()
            if "text" in message:
                data = json.loads(message["text"])
                msg_type = data.get("type")
                
                if msg_type == "input":
                    session.write(data.get("data", "").encode())
                elif msg_type == "resize":
                    session.resize(data.get("cols", 80), data.get("rows", 24))
            elif "bytes" in message:
                session.write(message["bytes"])
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"Terminal error: {e}")
    finally:
        terminal_service.remove_session(session_id)
