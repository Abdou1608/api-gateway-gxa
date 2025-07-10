#!/bin/bash
# setup-docker-soap-api.sh

# Export system global variables (Linux)
echo "🧬 Exporting system variables..."
echo 'SOAP_URL=http://10.0.8.140' | sudo tee /etc/profile.d/soap-url.sh > /dev/null
echo 'SOAP_PORT=8080' | sudo tee /etc/profile.d/soap-port.sh > /dev/null
sudo chmod +x /etc/profile.d/soap-url.sh /etc/profile.d/soap-port.sh

# Variables
CONTAINER_NAME=soap-rest-gateway
IMAGE_NAME=soap-api-image
PROJECT_DIR=/home/ec2-user/soap-rest-gateway
PORT=3000

# Step 1: Build Docker image
build_image() {
  echo "🔧 Building Docker image..."
  docker build -t $IMAGE_NAME $PROJECT_DIR
}

# Step 2: Stop and remove existing container
stop_container() {
  if docker ps -a --format '{{.Names}}' | grep -Eq "^$CONTAINER_NAME$"; then
    echo "🛑 Stopping and removing existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
  fi
}

# Step 3: Run container
run_container() {
  echo "🚀 Running Docker container on port $PORT..."
  docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:$PORT \
    --env-file .env \
    -v $(pwd):/app \
    -v $(pwd)/logs:/app/logs \
    $IMAGE_NAME
}

# Step 4: Sync updates
update_code_and_restart() {
  echo "📦 Syncing updated source files..."
  rsync -a --exclude node_modules/ ./ $PROJECT_DIR/
  build_image
  stop_container
  run_container
}

# systemd service for container
setup_systemd_service() {
  echo "🔐 Creating systemd service for container..."

  docker create --name $CONTAINER_NAME $IMAGE_NAME

  SERVICE_PATH=/etc/systemd/system/docker-$CONTAINER_NAME.service
  sudo tee $SERVICE_PATH > /dev/null <<EOF
[Unit]
Description=Soap REST Gateway Docker Container
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker start -a $CONTAINER_NAME
ExecStop=/usr/bin/docker stop -t 2 $CONTAINER_NAME

[Install]
WantedBy=multi-user.target
EOF

  sudo systemctl daemon-reload
  sudo systemctl enable docker-$CONTAINER_NAME

  echo "✅ Service created and enabled: docker-$CONTAINER_NAME"
}

# Step 5: Dev mode with logs
run_dev_mode() {
  echo "🧪 Running in development mode with nodemon and live logs..."
  docker compose -f docker-compose.dev.yml up --build
}

# Usage
case "$1" in
  build)
    build_image
    ;;
  run)
    run_container
    ;;
  restart)
    stop_container
    run_container
    ;;
  update)
    update_code_and_restart
    ;;
  stop)
    stop_container
    ;;
  dev)
    run_dev_mode
    ;;
 install-service)
    setup_systemd_service
    ;;
  *)
    echo "Usage: $0 {build|run|restart|stop|update|dev|setup_systemd_service}"
    ;;
esac
