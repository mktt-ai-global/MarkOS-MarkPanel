from pydantic import BaseModel
from typing import Optional

class CPUMetrics(BaseModel):
    percent: float
    cores: int
    frequency: Optional[float]

class MemoryMetrics(BaseModel):
    total: int
    available: int
    used: int
    percent: float

class DiskIOMetrics(BaseModel):
    read_bytes: int
    write_bytes: int
    read_rate: float
    write_rate: float

class NetworkMetrics(BaseModel):
    bytes_sent: int
    bytes_recv: int
    sent_rate: float
    recv_rate: float

class SystemMetrics(BaseModel):
    cpu: CPUMetrics
    memory: MemoryMetrics
    disk_io: DiskIOMetrics
    network: NetworkMetrics
    timestamp: float

class SystemInfo(BaseModel):
    hostname: str
    os_version: str
    kernel_version: str
    uptime: float
    cpu_model: str
    cpu_cores: int
