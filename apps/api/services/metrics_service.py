import asyncio
import psutil
import platform
import time
from typing import AsyncGenerator
from apps.api.schemas.system import SystemMetrics, CPUMetrics, MemoryMetrics, DiskIOMetrics, NetworkMetrics, SystemInfo

class MetricsService:
    def __init__(self):
        # Baseline for rates
        self._last_disk_io = psutil.disk_io_counters()
        self._last_net_io = psutil.net_io_counters()
        self._last_time = time.time()
        # Initialize CPU percent collection
        psutil.cpu_percent(interval=None)

    def get_system_info(self) -> SystemInfo:
        uptime = time.time() - psutil.boot_time()
        cpu_info = platform.processor() or "Unknown"
        
        return SystemInfo(
            hostname=platform.node(),
            os_version=f"{platform.system()} {platform.release()}",
            kernel_version=platform.version(),
            uptime=uptime,
            cpu_model=cpu_info,
            cpu_cores=psutil.cpu_count(logical=True)
        )

    async def get_snapshot(self) -> SystemMetrics:
        # CPU
        cpu_percent = psutil.cpu_percent(interval=None)
        
        # Memory
        mem = psutil.virtual_memory()
        memory_metrics = MemoryMetrics(
            total=mem.total,
            available=mem.available,
            used=mem.used,
            percent=mem.percent
        )
        
        # Disk I/O rates
        now = time.time()
        dt = now - self._last_time
        disk_io = psutil.disk_io_counters()
        
        disk_metrics = DiskIOMetrics(
            read_bytes=disk_io.read_bytes,
            write_bytes=disk_io.write_bytes,
            read_rate=(disk_io.read_bytes - self._last_disk_io.read_bytes) / dt if dt > 0 else 0,
            write_rate=(disk_io.write_bytes - self._last_disk_io.write_bytes) / dt if dt > 0 else 0
        )
        
        # Network rates
        net_io = psutil.net_io_counters()
        net_metrics = NetworkMetrics(
            bytes_sent=net_io.bytes_sent,
            bytes_recv=net_io.bytes_recv,
            sent_rate=(net_io.bytes_sent - self._last_net_io.bytes_sent) / dt if dt > 0 else 0,
            recv_rate=(net_io.bytes_recv - self._last_net_io.bytes_recv) / dt if dt > 0 else 0
        )
        
        # Update last state
        self._last_disk_io = disk_io
        self._last_net_io = net_io
        self._last_time = now
        
        cpu_freq = psutil.cpu_freq()
        
        return SystemMetrics(
            cpu=CPUMetrics(
                percent=cpu_percent,
                cores=psutil.cpu_count(),
                frequency=cpu_freq.current if cpu_freq else None
            ),
            memory=memory_metrics,
            disk_io=disk_metrics,
            network=net_metrics,
            timestamp=now
        )

    async def stream(self, interval: int = 2) -> AsyncGenerator[SystemMetrics, None]:
        while True:
            yield await self.get_snapshot()
            await asyncio.sleep(interval)

metrics_service = MetricsService()

def get_metrics_service() -> MetricsService:
    return metrics_service
