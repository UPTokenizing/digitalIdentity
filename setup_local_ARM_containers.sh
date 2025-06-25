#!/bin/bash

# Print spacing
echo " "
echo " "
echo "========== Installing containers (ARM architecture) =========="
echo " "
echo "MySQL container setup required"
echo " "
echo "========== MySQL Container Setup =========="
echo " "

# Prompt user for MySQL configuration values
read -p "Container name (DB_HOST): " MYSQL_CONTAINER_NAME
read -p "Root Password (MYSQL_ROOT_PASSWORD): " MYSQL_ROOT_PASSWORD
read -p "Database name Ex. digital_identity (MYSQL_DATABASE): " MYSQL_DATABASE
read -p "Username (MYSQL_USER): " MYSQL_USER
read -p "User Password (MYSQL_PASSWORD)  Do not use \" or "#": " MYSQL_PASSWORD

echo " "
echo "============ Creating .env ================"
echo " "
echo "Creating .env files in frontend applications"

# Prepare environment variable content to write into .env files
ENV_CONTENT="DB_HOST=$MYSQL_CONTAINER_NAME
DB_USER=$MYSQL_USER
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=$MYSQL_DATABASE
JWT_SECRET=dha7toiacrwoa98cr2pujc2j4u
"

# Define paths where .env files will be created
paths=(
  "./frontendUsersInteface/frontendUsersApp"
  "./frontendScholarCurriculum/frontendScholarCurriculumApp"
  "./frontendBirthCertificate/frontendBirthCertificateApp"
  "./frontendIdentityDigital/frontendDigitalApp"
)

# Loop through each path and write the .env file
for path in "${paths[@]}"; do
  if [ -d "$path" ]; then
    echo "Creating .env in $path"
    echo "$ENV_CONTENT" > "$path/.env"
  else
    echo "Directory $path does not exist. Skipping..."
  fi
done

echo " "
echo "========== Starting containers ============"
echo " "
echo "Starting containers with docker-compose..."

# Launch containers defined in docker-compose.yml
docker-compose -f docker-compose-ARM.yml up -d
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "..."
sleep 1
echo "Executing commands inside containers..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
sleep 12
echo "..."
echo " "
echo "Waiting for network to be available..."

# Detect the Docker network created by docker-compose
NETWORK_NAME=$(docker network ls --filter name=TokPhyAppNetwork --format "{{.Name}}" | head -n 1)
echo "Network found: $NETWORK_NAME"
echo " "

# Create a MySQL container on the same network
echo "Creating '$MYSQL_CONTAINER_NAME'..."
docker run -d \
  --name "$MYSQL_CONTAINER_NAME" \
  --network "$NETWORK_NAME" \
  -e MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD" \
  -e MYSQL_DATABASE="$MYSQL_DATABASE" \
  -e MYSQL_USER="$MYSQL_USER" \
  -e MYSQL_PASSWORD="$MYSQL_PASSWORD" \
  -p 3306:3306 \
  mysql:8

sleep 5
echo " "
echo "==========================================="
echo " "
echo "Setup complete, continue with deployment instructions"
echo " "
echo "=============== Done ======================"
