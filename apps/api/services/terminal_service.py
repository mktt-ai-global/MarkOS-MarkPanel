import os
import pty
import struct
import fcntl
import termios
import asyncio
from typing import Dict, Optional, Callable

class TerminalSession:
    def __init__(self, cols: int = 80, rows: int = 24):
        self.fd: Optional[int] = None
        self.pid: Optional[int] = None
        self.cols = cols
        self.rows = rows
        self.on_data: Optional[Callable[[bytes], None]] = None
        self.on_exit: Optional[Callable[[], None]] = None
        self.loop = None

    async def start(self, shell: str = "/bin/bash"):
        self.loop = asyncio.get_running_loop()
        pid, fd = pty.fork()
        
        if pid == 0:  # Child process
            # Set window size
            winsize = struct.pack("HHHH", self.rows, self.cols, 0, 0)
            fcntl.ioctl(0, termios.TIOCSWINSZ, winsize)
            
            os.environ["TERM"] = "xterm-256color"
            os.execv(shell, [shell])
        else:  # Parent process
            self.pid = pid
            self.fd = fd
            
            # Non-blocking IO
            fl = fcntl.fcntl(self.fd, fcntl.F_GETFL)
            fcntl.fcntl(self.fd, fcntl.F_SETFL, fl | os.O_NONBLOCK)
            
            # Register reader
            self.loop.add_reader(self.fd, self._on_fd_readable)

    def _on_fd_readable(self):
        if self.fd is None:
            return
            
        try:
            data = os.read(self.fd, 4096)
            if not data:
                self.close()
                if self.on_exit:
                    self.on_exit()
                return
                
            if self.on_data:
                self.on_data(data)
        except (BlockingIOError, InterruptedError):
            pass
        except Exception:
            self.close()
            if self.on_exit:
                self.on_exit()

    def write(self, data: bytes):
        if self.fd is not None:
            try:
                os.write(self.fd, data)
            except Exception:
                pass

    def resize(self, cols: int, rows: int):
        if self.fd is not None:
            self.cols = cols
            self.rows = rows
            winsize = struct.pack("HHHH", self.rows, self.cols, 0, 0)
            fcntl.ioctl(self.fd, termios.TIOCSWINSZ, winsize)

    def close(self):
        if self.fd is not None:
            if self.loop:
                self.loop.remove_reader(self.fd)
            try:
                os.close(self.fd)
            except Exception:
                pass
            self.fd = None
        
        if self.pid is not None:
            try:
                os.kill(self.pid, 9)
                os.waitpid(self.pid, 0)
            except Exception:
                pass
            self.pid = None

class TerminalService:
    def __init__(self):
        self.sessions: Dict[str, TerminalSession] = {}

    def create_session(self, session_id: str, cols: int = 80, rows: int = 24) -> TerminalSession:
        session = TerminalSession(cols, rows)
        self.sessions[session_id] = session
        return session

    def remove_session(self, session_id: str):
        if session_id in self.sessions:
            self.sessions[session_id].close()
            del self.sessions[session_id]

terminal_service = TerminalService()
