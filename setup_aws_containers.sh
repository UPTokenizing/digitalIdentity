#!/bin/bash

# Print blank lines for spacing
echo " "
echo " "

# Display header for clarity
echo "========== Installing containers =========="

# Display a message to the user indicating what input is required
echo "Information to connect to the Database is required"
echo "Use the information noted from the database creation"
sleep 1

# Show a visual separator and example
echo "==========================================="
echo "Example:"
echo " "
echo " "
sleep 0.5
echo "DB_HOST=<DB endpoint. EX: tokphy-mysql.xxxxxxxxxx.us-east-2.rds.amazonaws.com>"
sleep 0.5
echo "DB_USER=root"
sleep 0.5
echo "DB_PASSWORD=\"root_pw123\" "
sleep 0.5
echo "DB_NAME=digital_identity"
echo " "
echo " "
echo "==========================================="
sleep 1

# Prompt user to input environment variables for connecting to the database
read -p "Enter DB_HOST : " DB_HOST
read -p "Enter DB_USER (Username): " DB_USER
read -p "Enter DB_PASSWORD (Username password) Do not use \" or "#": " DB_PASSWORD
read -p "Enter DB_NAME (Database name): " DB_NAME

# Create a formatted string that will be saved to the .env files
ENV_CONTENT="DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
JWT_SECRET=dha7toiacrwoa98cr2pujc2j4u
"

# List of paths where .env files should be created
paths=(
  "./frontendUsersInteface/frontendUsersApp"
  "./frontendScholarCurriculum/frontendScholarCurriculumApp"
  "./frontendBirthCertificate/frontendBirthCertificateApp"
  "./frontendIdentityDigital/frontendDigitalApp"
)

echo "==========================================="

# Loop over each path and create a .env file with the provided values
for path in "${paths[@]}"; do
  if [ -d "$path" ]; then
    echo "Creating .env in $path"
    echo "$ENV_CONTENT" > "$path/.env"
  else
    echo "Directory $path does not exist. Skipping..."
  fi
done

# Start Docker containers
echo "========== Starting containers ============"
echo "Starting containers with docker-compose..."
# Launch containers defined in docker-compose.yml
docker-compose up -d
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

echo "==========================================="
echo "Setup complete, continue with deployment instructions"
echo "=============== Done ======================"
