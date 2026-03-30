# MarkOS MarkPanel 🌟

<p align="center">
  <b>English</b> | <a href="#中文"><b>中文</b></a>
</p>

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

## 🤝 Contributing
We love contributors! If you have a feature request or found a bug, please check out our [Contributing Guide](CONTRIBUTING.md).

## 📄 License
MarkOS MarkPanel is open-source software licensed under the [MIT License](LICENSE).

---

<h2 id="中文">🇨🇳 中文说明</h2>

**MarkOS MarkPanel** 是一款企业级、超现代的 NAS 管理面板。受“磨砂玻璃”（Frosted Glass）美学启发，它将美观与功能完美结合，为您的数字生活提供集中式的管理中心。

## 🎨 设计理念
MarkOS 坚信 NAS 管理应当兼具美感与实用性。我们的**磨砂玻璃 UI** 提供：
- **深度与透明度**：实时背景滤镜，打造高端质感。
- **流畅动画**：平滑的 SVG 转换和基于 WebSocket 的实时更新。
- **通用设计**：适配移动端、平板和桌面端。

## ✨ 核心模块
- 📊 **NAS 监控**：基于 WebSockets 的 CPU、内存、磁盘和网络实时监控。
- 📂 **CloudDrive**：高性能文件管理，支持分片上传和媒体流播放。
- 🏠 **智能主页**：可自定义的应用快捷方式，支持自动抓取图标。
- 🐳 **Docker 枢纽**：一键式容器生命周期管理（启动/停止/日志/统计）。
- ⌨️ **网页终端**：全功能 SSH PTY 终端，支持 GPU 加速 (xterm.js)。
- 🔐 **安全卫士**：基于 JWT 的企业级安全架构。

## 🚀 一键安装 (Docker)
只需数秒即可运行 MarkOS，复制并粘贴以下命令：

```bash
curl -sSL https://raw.githubusercontent.com/mktt-ai-global/MarkOS-MarkPanel/main/install.sh | bash
```

*不想直接运行脚本？请查看我们的 [手动安装指南](docs/DEPLOYMENT_GUIDE.md)。*

## 🏗 企业级架构
采用可扩展的 **Monorepo** 结构：
- `/apps/web`: Next.js 14 (App Router, Tailwind CSS, Zustand, Framer Motion)
- `/apps/api`: FastAPI (Python 3.11, SQLAlchemy, Psutil, Docker SDK)
- `/docker`: 预配置的 Nginx, PostgreSQL 和 Redis。
- `/packages`: 前后端共享的类型定义与逻辑。

## 🤝 参与贡献
欢迎贡献者！如果您有功能建议或发现 Bug，请查看我们的 [贡献指南](CONTRIBUTING.md)。

## 📄 许可证
MarkOS MarkPanel 是基于 [MIT 许可证](LICENSE) 的开源软件。

---
Built with ❤️ by the MarkOS Team. Join us in shaping the future of NAS.
