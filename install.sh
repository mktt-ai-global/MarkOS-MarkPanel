#!/bin/bash

# MarkOS MarkPanel Interactive Installation Script
# Inspired by 3x-ui style installation

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
    if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
        echo_red "Error: Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

generate_secret() {
    if command -v openssl >/dev/null 2>&1; then
        openssl rand -hex 32
    else
        LC_ALL=C tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 64 | head -n 1
    fi
}

# --- Main Script ---

echo_blue "================================================================"
echo_blue "     MarkOS MarkPanel - Enterprise NAS Management System        "
echo_blue "================================================================"
echo "Starting installation..."

check_docker

# Create .env if not exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Initializing environment configuration..."
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    SECRET=$(generate_secret)
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

# 3. Admin Password
read -p "Enter Admin Password [default admin123]: " ADMIN_PASS
ADMIN_PASS=${ADMIN_PASS:-admin123}

# 4. Storage Root
read -p "Enter Storage Path [default /data/storage]: " STORAGE_PATH
STORAGE_PATH=${STORAGE_PATH:-/data/storage}

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
docker-compose up -d --build

# Initialize Database inside the API container
echo_blue "\n--- Initializing Database & Admin Account ---"
# Wait a bit for the DB to be ready
sleep 5
docker exec -it markos-api python scripts/init_db.py

echo_green "\n================================================================"
echo_green "  MarkOS MarkPanel has been successfully installed!             "
echo_green "================================================================"
echo "Panel URL: http://localhost:$PORT"
echo "Admin: $ADMIN_USER"
echo "Password: $ADMIN_PASS"
echo "----------------------------------------------------------------"
echo "Enjoy your enterprise-grade NAS management system."
echo "================================================================"
