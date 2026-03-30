# MarkOS MarkPanel 部署指南 (Architect's Manual)

本手册详细介绍了如何配置、部署和管理 MarkOS MarkPanel 系统。

## 📊 环境变量配置说明

`.env` 文件是系统运行的核心配置。

### 必填项 (Required)
- `DATABASE_URL`: PostgreSQL 数据库连接地址。
- `REDIS_URL`: Redis 连接地址，用于缓存和消息队列。
- `SECRET_KEY`: 用于 JWT 签名的随机字符串（生产环境必须修改）。
- `DOMAIN`: 系统的访问域名或 IP（用于 CORS 设置）。

### 存储设置 (Storage)
- `STORAGE_ROOT`: NAS 存储根目录在宿主机的绝对路径。
- `MAX_UPLOAD_SIZE_GB`: 限制单次文件上传的大小（以 GB 为单位）。

### 模块配置 (Module Configuration)
- `MULTI_USER_MODE`: 是否开启多用户支持。
- `ENABLE_TERMINAL`: 是否启用 Web 终端功能。
- `TERMINAL_MAX_SESSIONS`: 允许的最大终端连接数。

### 第三方服务 (External Services)
- `WEATHER_API_KEY`: OpenWeatherMap 或类似服务的 API Key（可选）。
- `WEATHER_CITY`: 天气预报的目标城市。

---

## 🏗 手动进行数据库迁移 (Alembic)

MarkOS 使用 [Alembic](https://alembic.sqlalchemy.org/) 管理数据库模型演进。虽然后端应用在启动时会自动创建基础表，但为了支持复杂的迁移，建议通过以下步骤手动管理。

### 环境准备
1. 确保已安装 Python 3.10+。
2. 安装依赖：`pip install -r apps/api/requirements.txt`。

### 迁移步骤
1. **生成初始版本**：
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   ```
2. **应用迁移**：
   ```bash
   alembic upgrade head
   ```
3. **回滚操作**：
   ```bash
   alembic downgrade -1
   ```

**注意**：在 Docker 环境中，可通过以下命令远程执行迁移：
```bash
docker exec -it markos-api alembic upgrade head
```

---

## ⚡ 部署故障排除

### 1. 权限问题
如果无法上传文件或 Docker 终端不可用，请检查：
- `STORAGE_ROOT` 在宿主机上是否可写。
- `/var/run/docker.sock` 是否正确映射。

### 2. 数据库连接失败
确保 `markos-db` 容器已完全启动并监听 5432 端口。可以在 `.env` 中调高 `LOG_LEVEL=DEBUG` 观察后端连接详情。

### 3. Nginx 配置
若要开启 HTTPS，请将 SSL 证书放置在 `./docker/nginx/certs` 目录下，并修改 `./docker/nginx/nginx.conf` 以匹配证书名称。

---
首席架构师: Architect
最后更新: 2026-03-30
