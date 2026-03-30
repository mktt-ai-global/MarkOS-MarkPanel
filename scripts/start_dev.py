import os
import subprocess
import sys
import time
import signal
import socket

# Configuration
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API_PORT = 8000
WEB_PORT = 3000
SECRET_KEY = "markos_dev_secret_key_12345"
DATABASE_URL = "sqlite:///./test.db"
STORAGE_ROOT = os.path.join(PROJECT_ROOT, "storage")

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def start_backend():
    print(f"🚀 Starting Backend on port {API_PORT}...")
    if is_port_in_use(API_PORT):
        print(f"⚠️ Port {API_PORT} is already in use. Attempting to kill existing process...")
        subprocess.run(f"lsof -ti:{API_PORT} | xargs kill -9", shell=True)
        time.sleep(1)

    env = os.environ.copy()
    env["SECRET_KEY"] = SECRET_KEY
    env["DATABASE_URL"] = DATABASE_URL
    env["PYTHONPATH"] = PROJECT_ROOT
    env["STORAGE_ROOT"] = STORAGE_ROOT

    # Run DB Initialization
    subprocess.run([sys.executable, os.path.join(PROJECT_ROOT, "scripts/init_db.py")], env=env)

    # Start FastAPI
    log_file = open("backend.log", "w")
    proc = subprocess.Popen(
        [sys.executable, "apps/api/main.py"],
        env=env, cwd=PROJECT_ROOT,
        stdout=log_file,
        stderr=subprocess.STDOUT
    )
    return proc, log_file

def start_frontend():
    print(f"🎨 Starting Frontend on port {WEB_PORT}...")
    if is_port_in_use(WEB_PORT):
        print(f"⚠️ Port {WEB_PORT} is already in use. Attempting to kill existing process...")
        subprocess.run(f"lsof -ti:{WEB_PORT} | xargs kill -9", shell=True)
        time.sleep(1)

    # Ensure .env.local exists for Next.js
    env_local_path = os.path.join(PROJECT_ROOT, "apps/web/.env.local")
    with open(env_local_path, "w") as f:
        f.write(f"NEXT_PUBLIC_API_URL=http://localhost:{API_PORT}\n")

    # Start Next.js
    log_file = open("frontend.log", "w")
    proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=os.path.join(PROJECT_ROOT, "apps/web"),
        stdout=log_file,
        stderr=subprocess.STDOUT
    )
    return proc, log_file

def main():
    backend_proc = None
    frontend_proc = None
    b_log = None
    f_log = None

    try:
        backend_proc, b_log = start_backend()
        time.sleep(3)
        frontend_proc, f_log = start_frontend()
        
        print("\n✅ MarkOS is running!")
        print(f"🔗 http://localhost:{WEB_PORT}")
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None or frontend_proc.poll() is not None:
                break
    except KeyboardInterrupt:
        print("\n🛑 Stopping...")
    finally:
        if backend_proc: os.kill(backend_proc.pid, signal.SIGTERM)
        if frontend_proc: subprocess.run(f"lsof -ti:{WEB_PORT} | xargs kill -9", shell=True, stderr=subprocess.DEVNULL)
        if b_log: b_log.close()
        if f_log: f_log.close()

if __name__ == "__main__":
    main()
