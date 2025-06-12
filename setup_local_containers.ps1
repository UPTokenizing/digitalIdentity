# -----------------------------------------------------------
# PowerShell Script for Setting Up Docker Containers
# Specifically designed for Windows PowerShell / CMD with PowerShell
# -----------------------------------------------------------

Write-Host ""  # Print blank line for readability
Write-Host ""
Write-Host "========== Installing containers =========="
Write-Host ""
Write-Host "MySQL container setup required"
Write-Host ""
Write-Host "========== MySQL Container Setup =========="
Write-Host ""

# Prompt the user to enter the MySQL container details
$MYSQL_CONTAINER_NAME = Read-Host "Container name (DB_HOST)"
$MYSQL_ROOT_PASSWORD = Read-Host "Root Password (MYSQL_ROOT_PASSWORD)"
$MYSQL_DATABASE = Read-Host "Database name Ex. digital_identity (MYSQL_DATABASE)"
$MYSQL_USER = Read-Host "Username (MYSQL_USER)"
$MYSQL_PASSWORD = Read-Host "User Password (MYSQL_PASSWORD)"

Write-Host ""
Write-Host "========= Extra details needed ============"
Write-Host ""

# Prompt the user to enter the JWT secret key
$JWT_SECRET = Read-Host "JWT_SECRET (session token JWT)"

Write-Host ""
Write-Host "============ Creating .env ================"
Write-Host ""
Write-Host "Creating .env files in frontend applications"

# Define environment variable content for .env files using a here-string
$ENV_CONTENT = @"
DB_HOST=$MYSQL_CONTAINER_NAME
DB_USER=$MYSQL_USER
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=$MYSQL_DATABASE
JWT_SECRET=$JWT_SECRET
"@

# List of frontend application paths where .env files will be created
$paths = @(
  ".\frontendUsersInteface\frontendUsersApp",
  ".\frontendScholarCurriculum\frontendScholarCurriculumApp",
  ".\frontendBirthCertificate\frontendBirthCertificateApp",
  ".\frontendIdentityDigital\frontendDigitalApp"
)

# Loop through each path and create the .env file with environment variables
foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "Creating .env in $path"
        $ENV_CONTENT | Out-File -Encoding utf8 "$path\.env"  # Write env content to file
    }
    else {
        Write-Host "Directory $path does not exist. Skipping..."  # Warn if folder missing
    }
}

Write-Host ""
Write-Host "========== Starting containers ============"
Write-Host ""

Write-Host "Starting containers with docker-compose..."
docker-compose up -d  # Launch all containers defined in docker-compose.yml detached

Write-Host ""
Write-Host "Waiting for network to be available..."

# Get the Docker network name that matches TokPhyAppNetwork  
$NETWORK_NAME = docker network ls --filter name=TokPhyAppNetwork --format "{{.Name}}" | Select-Object -First 1
Write-Host "Network found: $NETWORK_NAME"
Write-Host ""

Write-Host "Creating container '$MYSQL_CONTAINER_NAME'..."

# Run MySQL container connected to the found Docker network with specified environment variables
docker run -d `
  --name $MYSQL_CONTAINER_NAME `
  --network $NETWORK_NAME `
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD `
  -e MYSQL_DATABASE=$MYSQL_DATABASE `
  -e MYSQL_USER=$MYSQL_USER `
  -e MYSQL_PASSWORD=$MYSQL_PASSWORD `
  -p 3306:3306 `
  mysql:8

# Wait 3 seconds to ensure container startup
Start-Sleep -Seconds 3

# Stop the MySQL container after setup
docker stop $MYSQL_CONTAINER_NAME

Write-Host ""
Write-Host "==========================================="
Write-Host ""
Write-Host " Setup complete, continue with deployment instructions"
Write-Host ""
Write-Host "=============== Done ======================"
