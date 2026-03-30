# Security Hotfix Report

## 1. API Authentication Hardening
The following routes and endpoints have been secured with mandatory authentication using `Depends(get_current_user)` or `Depends(get_current_user_ws)`:

### `apps/api/routes/docker.py`
- `GET /api/docker/containers`: Added `get_current_user` dependency.
- `POST /api/docker/{container_id}/action`: Added `get_current_user` dependency.
- `WS /ws/docker/logs/{container_id}`: Added `get_current_user_ws` dependency. Authenticates via `token` query parameter.

### `apps/api/routes/terminal.py`
- `WS /ws/terminal`: Added `get_current_user_ws` dependency. Authenticates via `token` query parameter.

### `apps/api/routes/settings.py`
- `GET /api/settings/config`: Verified authentication dependency is present.
- `PUT /api/settings/config`: Verified authentication dependency is present.

### `apps/api/routes/auth.py` (New Helper)
- Implemented `get_current_user_ws`: A specialized dependency for WebSocket endpoints that validates JWT from URL query parameters (`?token=...`) and closes the connection with `WS_1008_POLICY_VIOLATION` code if authentication fails.

## 2. Environment Variable Security
### `apps/api/core/config.py`
- **Removed hardcoded SECRET_KEY**: The default value "your-secret-key-for-jwt" has been removed to prevent insecure deployments.
- **Startup Integrity Check**: Added a check at the module level that raises a `ValueError` if `SECRET_KEY` is not provided in the environment variables. This prevents the API from starting in an insecure state.

## 3. Summary of Changes
- Modified `apps/api/core/config.py`
- Modified `apps/api/routes/auth.py`
- Modified `apps/api/routes/docker.py`
- Modified `apps/api/routes/terminal.py`
- Verified `apps/api/routes/settings.py`

The system now enforces authentication on critical Docker and Terminal interfaces, and ensures secure configuration at startup.
