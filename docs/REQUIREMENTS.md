# MarkOS-MarkPanel Requirements Specification

## 1. Project Overview
MarkOS-MarkPanel is an integrated VPS/NAS control console for individual developers and technical users. It combines server monitoring, cloud storage management, and a personalized home page into a single, lightweight, and beautiful web application.

### 1.1 Core Modules
- **NAS Monitor**: Lightweight, agent-less server dashboard.
- **CloudDrive**: VPS cloud disk file management with support for large file streaming.
- **HomePage**: Personalized navigation page with real-time service status.

### 1.2 Target Users
- Individual developers needing a unified entry for self-hosted projects.
- Digital nomads/creators using VPS as cloud storage.
- NAS enthusiasts looking for a modern UI alternative.
- Small IT teams needing lightweight server management.

---

## 2. Functional Requirements

### 2.1 NAS Monitor (Server Monitoring)
- **Dashboard**: Real-time stats for CPU (with history), Memory, Disk I/O, and Network throughput (2s update frequency).
- **Disk Management**: Partition listing, usage alerts (>80% orange, >90% red), and I/O rates.
- **Process Management**: PID, name, CPU/Memory usage, status, and control actions (SIGTERM/SIGKILL).
- **Docker Management**: Container list, status, resource usage, and lifecycle operations (start/stop/restart/delete).
- **Web Terminal**: xterm.js-based terminal connected to the host's PTY.

### 2.2 CloudDrive (File Management)
- **Browsing**: Grid/List views, breadcrumb navigation, MIME-based icons, and sorting/filtering.
- **Operations**: Upload, download, rename, move, copy path, delete, and sharing.
- **Uploads**: Drag-and-drop support, chunked uploads (10MB chunks), resumable uploads, and concurrency management (3 tasks).
- **Preview**: Image, PDF, and HTML5 video/audio playback.
- **Sharing**: Token-based temporary links with expiration and download limits.

### 2.3 HomePage (Navigation)
- **Status Chips**: Weather, Uptime, Docker container count, and firewall status.
- **Search Bar**: Multiple search engine support (Google, Bing, DuckDuckGo).
- **App Shortcuts**: Grouped apps with icons, real-time Docker status badges, and drag-and-drop sorting.
- **Management**: CRUD for shortcuts, category management, and JSON import/export.

---

## 3. Non-Functional Requirements

### 3.1 UI/UX Standards
- **Style**: Apple-style frosted glass (frosted glass) effect.
- **Layout**: Top navigation, context-aware sidebar, and responsive grid content area.
- **Performance**: FCP < 1.5s, dashboard latency < 200ms, Lighthouse score > 90.

### 3.2 Security
- **Authentication**: JWT-based (15m access, 7d refresh) with HttpOnly cookies.
- **File Security**: Path traversal protection, restricted storage root, and MIME type whitelisting.
- **API Security**: Rate limiting, CORS restrictions, and SQL injection protection (SQLAlchemy ORM).
- **Network**: Nginx-based HTTPS enforcement, internal-only DB/Redis.
