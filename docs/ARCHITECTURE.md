# MarkOS-MarkPanel Architecture Specification

## 1. System Overview
MarkOS-MarkPanel uses a decoupled frontend-backend architecture with a single-node deployment model, orchestrated using Docker Compose.

### 1.1 Technology Stack
| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Frontend** | Next.js 14 (App Router) + TS | SSR, WebSocket real-time data, UI components (frosted glass) |
| **Backend** | FastAPI (Python 3.11) | REST API, system metrics (psutil), file system operations |
| **Database** | PostgreSQL 15 | Persistent storage for users, file metadata, shortcuts |
| **Cache** | Redis 7 | Metrics caching (30s TTL), session storage |
| **Proxy** | Nginx | HTTPS termination, static assets, WebSocket proxy |
| **Container** | Docker Compose v2 | Single-node deployment and service orchestration |

---

## 2. Frontend Architecture
- **Routing**: Next.js 14 App Router (`/dashboard`, `/drive`, `/home`, `/terminal`, `/settings`).
- **Styling**: Tailwind CSS with custom frosted glass design tokens (`backdrop-filter`, `glass-card`).
- **Components**: Based on `shadcn/ui`, with custom modules for each application feature.
- **State Management**: Zustand (lightweight, avoids Redux overhead).
- **Real-time Data**: WebSocket (native hook) with 2s polling frequency and automatic reconnection.

---

## 3. Backend Architecture
- **API Framework**: FastAPI with Pydantic for request/response validation.
- **Service Layer**: Decoupled modules for system monitoring, Docker SDK, and file management.
- **Real-time Stream**: WebSocket (`/ws/metrics`) for 2s metric pushes via async generator.
- **Terminal Integration**: WebSocket + PTY process (asyncssh) for terminal streaming to xterm.js.
- **File Management**: Multipart/chunked upload support, streaming downloads for large files.

---

## 4. Database Design
| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `users` | `id, username, password_hash, role` | Account management, RBAC support |
| `shortcuts` | `id, user_id, name, url, icon, category, sort_order` | HomePage app grid configuration |
| `file_shares` | `id, path, token, expires_at, max_downloads` | Temporary file sharing metadata |
| `settings` | `id, user_id, key, value (jsonb)` | Flexible user-specific preferences |
| `upload_sessions`| `id, filename, total_size, chunks_uploaded, status` | Chunked upload progress tracking |
| `audit_logs` | `id, user_id, action, target, ip, created_at` | Audit trail for critical actions |

---

## 5. Deployment Architecture
- **Network**: All services communicate within a private Docker bridge network (`markos-net`).
- **Isolation**: PostgreSQL and Redis are not exposed to the host machine.
- **Reverse Proxy**: Nginx exposes only 80/443, proxying to `markos-web` (3000) and `markos-api` (8000).
- **Persistence**: Managed through Docker Volumes for database files and the `STORAGE_ROOT` directory.

---

## 6. Monorepo Structure
```text
markos-markpanel/
├── apps/
│   ├── web/                   # Next.js 14 frontend
│   └── api/                   # FastAPI backend
├── packages/
│   └── shared/                # Common types/schemas
├── docker/
│   ├── nginx/                 # Nginx configuration
│   └── postgres/              # Database initialization
├── docs/                      # Documentation
├── scripts/                   # Install/update scripts
└── docker-compose.yml         # Main orchestration file
```
