# MarkOS MarkPanel 🌟

[![GitHub License](https://img.shields.io/github/license/mktt-ai-global/MarkOS-MarkPanel?style=flat-square&color=blue)](LICENSE)
[![Docker Image](https://img.shields.io/badge/docker-ready-blue?style=flat-square&logo=docker)](install.sh)
[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Built with FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

**MarkOS MarkPanel** is an enterprise-grade, ultra-modern NAS management dashboard. Inspired by the "Frosted Glass" (磨砂玻璃) aesthetic, it combines beauty with power, offering a centralized hub for your digital life.

![MarkOS Header](https://sc02.alicdn.com/kf/A8c7b4452bf1349a7b50c4f19007f02f0l.png)

## 🎨 Design Philosophy
MarkOS is built on the belief that NAS management should be as beautiful as it is functional. Our **Frosted Glass UI** provides:
- **Depth & Transparency**: Real-time backdrop filters for a premium feel.
- **Fluid Motion**: Smooth SVG transitions and WebSocket-powered updates.
- **Universal Design**: Fully responsive across Mobile, Tablet, and Desktop.

## ✨ Key Modules
- 📊 **NAS Monitor**: Real-time CPU, Memory, Disk, and Network telemetry via WebSockets.
- 📂 **CloudDrive**: High-performance file management with chunked uploads and streaming media support.
- 🏠 **Smart HomePage**: Customizable app shortcuts with automatic favicon scraping.
- 🐳 **Docker Hub**: One-click container lifecycle management (Start/Stop/Logs/Stats).
- ⌨️ **Web Terminal**: Full-featured SSH PTY terminal with GPU acceleration (xterm.js).
- 🔐 **Auth Guard**: Enterprise JWT-based security with multi-factor readiness.

## 🚀 One-Line Installation (Docker)
Get MarkOS up and running in seconds. Copy and paste:

```bash
curl -sSL https://raw.githubusercontent.com/mktt-ai-global/MarkOS-MarkPanel/main/install.sh | bash
```

*Don't want to pipe to bash? Check our [Manual Installation Guide](docs/DEPLOYMENT_GUIDE.md).*

## 🏗 Enterprise Architecture
Built with a scalable **Monorepo** structure:
- `/apps/web`: Next.js 14 (App Router, Tailwind CSS, Zustand, Framer Motion)
- `/apps/api`: FastAPI (Python 3.11, SQLAlchemy, Psutil, Docker SDK)
- `/docker`: Pre-configured Nginx, PostgreSQL, and Redis setups.
- `/packages`: Shared types and logic between frontend and backend.

## 🗺 Roadmap to 1.0
- [ ] 🔔 **Notification Center**: System alerts via Telegram/Discord/Slack.
- [ ] 🔄 **Auto-Backup**: Integrated backup scheduling to Rclone-compatible remotes.
- [ ] 🔒 **Reverse Proxy Manager**: Built-in Let's Encrypt / SSL management.
- [ ] 📱 **Mobile App**: Native iOS/Android experience via Capacitor.

## 🤝 Contributing
We love contributors! If you have a feature request or found a bug, please check out our [Contributing Guide](CONTRIBUTING.md).

## 📄 License
MarkOS MarkPanel is open-source software licensed under the [MIT License](LICENSE).

---
Built with ❤️ by the MarkOS Team. Join us in shaping the future of NAS.
