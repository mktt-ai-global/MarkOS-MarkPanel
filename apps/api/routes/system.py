from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Query, HTTPException, status
from apps.api.services.metrics_service import MetricsService, get_metrics_service
from apps.api.schemas.system import SystemInfo, SystemMetrics
from apps.api.core.security import decode_token
from apps.api.database import get_db
from apps.api.models.user import User as UserModel
from apps.api.core.config import settings
from sqlalchemy.orm import Session
import asyncio
import httpx
from typing import Optional

router = APIRouter(prefix="/api/system", tags=["system"])

async def verify_ws_token(token: str, db: Session):
    payload = decode_token(token)
    if payload is None:
        return None
    username: str = payload.get("sub")
    if username is None:
        return None
    user = db.query(UserModel).filter(UserModel.username == username).first()
    return user

@router.get("/info", response_model=SystemInfo)
async def get_system_info(
    metrics_service: MetricsService = Depends(get_metrics_service)
):
    return metrics_service.get_system_info()

@router.get("/metrics", response_model=SystemMetrics)
async def get_metrics_snapshot(
    metrics_service: MetricsService = Depends(get_metrics_service)
):
    return await metrics_service.get_snapshot()

@router.websocket("/ws/metrics")
async def websocket_metrics(
    websocket: WebSocket,
    token: str = Query(...),
    metrics_service: MetricsService = Depends(get_metrics_service),
    db: Session = Depends(get_db)
):
    user = await verify_ws_token(token, db)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    try:
        # Heartbeat and data push every 2 seconds
        async for metrics in metrics_service.stream(interval=2):
            await websocket.send_json(metrics.dict())
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()

@router.get("/weather")
async def get_weather(
    city: Optional[str] = Query(None)
):
    api_key = settings.WEATHER_API_KEY
    if not api_key:
        return {"error": "Weather API Key not configured"}
    
    city_name = city or settings.WEATHER_CITY
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric&lang=zh_cn"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Weather service error: {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}
