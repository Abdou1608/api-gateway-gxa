#!/bin/bash
# setup-docker-soap-api.sh
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# 0) Variables
# ──────────────────────────────────────────────────────────────────────────────
CONTAINER_NAME="api-gateway"          # <— NOM utilisé par DNS Docker
IMAGE_NAME="soap-api-image"
PROJECT_DIR="/home/ec2-user/soap-rest-gateway"
PORT="3000"
NETWORK_NAME="app-net"
NETWORK_DRIVER="bridge"
NETWORK_ALIAS="api-gateway"           # <— Alias DNS sur le réseau

# ──────────────────────────────────────────────────────────────────────────────
# 1) Export variables système via /etc/profile.d
# ──────────────────────────────────────────────────────────────────────────────
echo "🧬 Exporting system variables..."
sudo tee /etc/profile.d/soap-env.sh >/dev/null <<'EOF'
# Soap gateway defaults
export SOAP_URL="http://10.0.46.11"
export SOAP_PORT="8080"
EOF
sudo chmod +x /etc/profile.d/soap-env.sh

# ──────────────────────────────────────────────────────────────────────────────
# 2) Réseau Docker (driver: bridge) + alias DNS
# ──────────────────────────────────────────────────────────────────────────────
ensure_network() {
  if ! docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
    echo "🌐 Creating docker network '$NETWORK_NAME' (driver=$NETWORK_DRIVER)..."
    docker network create --driver "$NETWORK_DRIVER" "$NETWORK_NAME"
  else
    echo "🌐 Network '$NETWORK_NAME' already exists."
  fi
}

# ──────────────────────────────────────────────────────────────────────────────
# 3) Build image
# ──────────────────────────────────────────────────────────────────────────────
build_image() {
  echo "🔧 Building Docker image '$IMAGE_NAME' from '$PROJECT_DIR'..."
  docker build -t "$IMAGE_NAME" "$PROJECT_DIR"
}

# ──────────────────────────────────────────────────────────────────────────────
# 4) Stop & remove container s’il existe
# ──────────────────────────────────────────────────────────────────────────────
stop_container() {
  if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}$"; then
    echo "🛑 Stopping and removing existing container '$CONTAINER_NAME'..."
    docker stop "$CONTAINER_NAME" >/dev/null || true
    docker rm "$CONTAINER_NAME" >/dev/null || true
  fi
}

# ──────────────────────────────────────────────────────────────────────────────
# 5) Run container (réseau + alias DNS + port mapping 3000:3000)
# ──────────────────────────────────────────────────────────────────────────────
run_container() {
  echo "🚀 Running Docker container '$CONTAINER_NAME' on port $PORT..."
  ensure_network
  mkdir -p "$PROJECT_DIR/logs"

  # ATTENTION: s'il y a déjà un service sur 3000 de l'hôte, change $PORT
  docker run -d \
    --name "$CONTAINER_NAME" \
    --hostname "$CONTAINER_NAME" \
    --network "$NETWORK_NAME" \
    --network-alias "$NETWORK_ALIAS" \
    -p "$PORT:$PORT" \
    --env-file "$PROJECT_DIR/.env" \
    -v "$PROJECT_DIR:/app" \
    -v "$PROJECT_DIR/logs:/app/logs" \
    "$IMAGE_NAME"

  echo "✅ Up:"
  echo "   • Interne (autres conteneurs sur '$NETWORK_NAME'): http://${NETWORK_ALIAS}:${PORT}/"
  echo "   • Externe (Internet): http://<public-ip-ou-dns>:${PORT}/"
}

# ──────────────────────────────────────────────────────────────────────────────
# 6) Sync code + rebuild + restart
# ──────────────────────────────────────────────────────────────────────────────
update_code_and_restart() {
  echo "📦 Syncing updated source files to '$PROJECT_DIR'..."
  rsync -a --delete --exclude node_modules/ ./ "$PROJECT_DIR"/
  build_image
  stop_container
  run_container
}

# ──────────────────────────────────────────────────────────────────────────────
# 7) systemd service (lance avec réseau + alias + ports)
# ──────────────────────────────────────────────────────────────────────────────
setup_systemd_service() {
  echo "🔐 Creating systemd service for '$CONTAINER_NAME'..."

  SERVICE_PATH="/etc/systemd/system/docker-${CONTAINER_NAME}.service"
  sudo tee "$SERVICE_PATH" >/dev/null <<EOF
[Unit]
Description=Soap REST Gateway Docker Container ($CONTAINER_NAME)
Requires=docker.service
After=docker.service

[Service]
Restart=always
# S'assurer que le réseau existe avant de lancer
ExecStartPre=/usr/bin/docker network inspect $NETWORK_NAME >/dev/null 2>&1 || /usr/bin/docker network create --driver $NETWORK_DRIVER $NETWORK_NAME
# Stop & remove si déjà présent
ExecStartPre=/usr/bin/docker rm -f $CONTAINER_NAME >/dev/null 2>&1 || true
# Lancement avec réseau, alias, ports, env et volumes
ExecStart=/usr/bin/docker run \\
  --name $CONTAINER_NAME \\
  --hostname $CONTAINER_NAME \\
  --network $NETWORK_NAME \\
  --network-alias $NETWORK_ALIAS \\
  -p $PORT:$PORT \\
  --env-file $PROJECT_DIR/.env \\
  -v $PROJECT_DIR:/app \\
  -v $PROJECT_DIR/logs:/app/logs \\
  $IMAGE_NAME
ExecStop=/usr/bin/docker stop -t 2 $CONTAINER_NAME

[Install]
WantedBy=multi-user.target
EOF

  sudo systemctl daemon-reload
  sudo systemctl enable "docker-${CONTAINER_NAME}"
  echo "✅ Service created & enabled: docker-${CONTAINER_NAME}"
  echo "   Start with: sudo systemctl start docker-${CONTAINER_NAME}"
  echo "   Logs:       sudo journalctl -u docker-${CONTAINER_NAME} -f"
}

# ──────────────────────────────────────────────────────────────────────────────
# 8) Dev mode (compose)
# ──────────────────────────────────────────────────────────────────────────────
run_dev_mode() {
  echo "🧪 Running in development mode with docker compose (build + logs)..."
  docker compose -f docker-compose.dev.yml up --build
}

# ──────────────────────────────────────────────────────────────────────────────
# 9) Usage
# ──────────────────────────────────────────────────────────────────────────────
case "${1:-}" in
  build)           build_image ;;
  run)             run_container ;;
  restart)         stop_container; run_container ;;
  update)          update_code_and_restart ;;
  stop)            stop_container ;;
  dev)             run_dev_mode ;;
  install-service) setup_systemd_service ;;
  *)
    echo "Usage: $0 {build|run|restart|stop|update|dev|install-service}"
    exit 1
    ;;
esac
