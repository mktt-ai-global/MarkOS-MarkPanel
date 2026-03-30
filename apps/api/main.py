from fastapi import FastAPI
from apps.api.database import engine, Base
import apps.api.models # Ensure all models are registered
from apps.api.routes import auth, user, settings, system, files, shortcuts, docker, terminal
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MarkPanel API", version="0.1.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(user.router)
app.include_router(settings.router)
app.include_router(system.router)
app.include_router(files.router)
app.include_router(shortcuts.router)
app.include_router(docker.router)
app.include_router(terminal.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
