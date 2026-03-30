#!/bin/bash

# MarkOS MarkPanel Interactive Installation Script
# Inspired by 3x-ui style installation - Hardened Version

set -e

# --- Configuration ---
ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

# --- Functions ---
echo_blue() { echo -e "\033[34m$1\033[0m"; }
echo_green() { echo -e "\033[32m$1\033[0m"; }
echo_yellow() { echo -e "\033[33m$1\033[0m"; }
echo_red() { echo -e "\033[31m$1\033[0m"; }

check_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        echo_red "Error: Docker is not installed. Please install Docker first."
        exit 1
    fi
    # Support both 'docker-compose' and 'docker compose'
    if command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE="docker-compose"
    elif docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE="docker compose"
    else
        echo_red "Error: Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

check_files() {
    echo_blue "Verifying essential project files..."
    local missing=0
    for file in "docker-compose.yml" "apps/api/Dockerfile" "apps/web/Dockerfile" "scripts/init_db.py" "docker/nginx/nginx.conf"; do
        if [ ! -f "$file" ]; then
            echo_red "Error: Missing critical file: $file"
            missing=1
        fi
    done
    if [ $missing -eq 1 ]; then
        echo_red "Installation aborted due to missing files."
        exit 1
    fi
}

generate_random_string() {
    local length=${1:-16}
    if command -v openssl >/dev/null 2>&1; then
        openssl rand -hex $((length/2))
    else
        LC_ALL=C tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w "$length" | head -n 1
    fi
}

# --- Main Script ---

echo_blue "================================================================"
echo_blue "     MarkOS MarkPanel - Enterprise NAS Management System        "
echo_blue "================================================================"
echo "Starting installation..."

check_docker
check_files

# Create .env if not exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Initializing environment configuration..."
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    SECRET=$(generate_random_string 32)
    # Universal sed replacement (macOS/Linux compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/replace_me_with_random_32_chars/$SECRET/g" "$ENV_FILE"
    else
        sed -i "s/replace_me_with_random_32_chars/$SECRET/g" "$ENV_FILE"
    fi
fi

echo_yellow "\n--- Custom Configuration ---"

# 1. Port
read -p "Enter Panel Port [default 80]: " PORT
PORT=${PORT:-80}

# 2. Admin Username
read -p "Enter Admin Username [default admin]: " ADMIN_USER
ADMIN_USER=${ADMIN_USER:-admin}

# 3. Admin Password (Security: No default admin123)
echo -n "Enter Admin Password [Leave blank to generate random]: "
read -s ADMIN_PASS
echo "" # New line after silent input

if [ -z "$ADMIN_PASS" ]; then
    ADMIN_PASS=$(generate_random_string 16)
    IS_RANDOM=true
else
    IS_RANDOM=false
fi

# 4. Storage Root
read -p "Enter Storage Path [default /data/storage]: " STORAGE_PATH
STORAGE_PATH=${STORAGE_PATH:-/data/storage}

# Prepare Storage Directory and Permissions
echo_blue "Preparing storage directory: $STORAGE_PATH"
mkdir -p "$STORAGE_PATH"
# Only run chown on Linux where UID 1000 is common for Docker
if [[ "$OSTYPE" != "darwin"* ]]; then
    sudo chown -R 1000:1000 "$STORAGE_PATH" || echo_yellow "Warning: Could not set storage permissions. Ensure the Docker user has access."
fi

# Update .env
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^PANEL_PORT=.*|PANEL_PORT=$PORT|g" "$ENV_FILE"
    sed -i '' "s|^ADMIN_USERNAME=.*|ADMIN_USERNAME=$ADMIN_USER|g" "$ENV_FILE"
    sed -i '' "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$ADMIN_PASS|g" "$ENV_FILE"
    sed -i '' "s|^STORAGE_ROOT=.*|STORAGE_ROOT=$STORAGE_PATH|g" "$ENV_FILE"
    # Also update NEXT_PUBLIC_API_URL if port is not 80
    if [ "$PORT" != "80" ]; then
        sed -i '' "s|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://localhost:$PORT/api|g" "$ENV_FILE"
    fi
else
    sed -i "s|^PANEL_PORT=.*|PANEL_PORT=$PORT|g" "$ENV_FILE"
    sed -i "s|^ADMIN_USERNAME=.*|ADMIN_USERNAME=$ADMIN_USER|g" "$ENV_FILE"
    sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$ADMIN_PASS|g" "$ENV_FILE"
    sed -i "s|^STORAGE_ROOT=.*|STORAGE_ROOT=$STORAGE_PATH|g" "$ENV_FILE"
    if [ "$PORT" != "80" ]; then
        sed -i "s|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://localhost:$PORT/api|g" "$ENV_FILE"
    fi
fi

echo_green "\nConfig updated successfully!"

# Build and Start
echo_blue "\n--- Deploying Containers ---"
$DOCKER_COMPOSE up -d --build

# Initialize Database inside the API container with retry logic
echo_blue "\n--- Initializing Database & Admin Account ---"
MAX_RETRIES=30
RETRY_COUNT=0
echo "Waiting for API service to become healthy..."

until [ "$(docker inspect -f '{{.State.Health.Status}}' markos-api 2>/dev/null)" == "healthy" ]; do
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo_red "Error: API service failed to become healthy within $((MAX_RETRIES * 2)) seconds."
        echo_yellow "Checking logs..."
        docker logs markos-api | tail -n 20
        exit 1
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

echo_green "\nAPI is healthy! Running init_db.py..."
# Security: Removed -it for non-interactive compatibility
docker exec markos-api python scripts/init_db.py

echo_green "\n================================================================"
echo_green "  MarkOS MarkPanel has been successfully installed!             "
echo_green "================================================================"
echo "Panel URL: http://localhost:$PORT"
echo "Admin: $ADMIN_USER"
if [ "$IS_RANDOM" = true ]; then
    echo "$ADMIN_PASS" > .admin_pass
    echo_yellow "Password: $ADMIN_PASS (SAVE THIS PASSWORD! It is also saved to .admin_pass)"
    read -p "Press enter to continue and delete .admin_pass..."
    rm .admin_pass
else
    echo "Password: [Your chosen password]"
fi
echo "----------------------------------------------------------------"
echo "Enjoy your enterprise-grade NAS management system."
echo "================================================================"
