Write-Host "`n`n========== Installing containers ==========`n"
Write-Host "MySQL container setup required`n"
Write-Host "========== MySQL Container Setup ==========`n"

# Prompt for inputs
$MYSQL_CONTAINER_NAME = Read-Host "Container name (DB_HOST)"
$MYSQL_ROOT_PASSWORD = Read-Host "Root Password (MYSQL_ROOT_PASSWORD)"
$MYSQL_DATABASE = Read-Host "Database name Ex. digital_identity (MYSQL_DATABASE)"
$MYSQL_USER = Read-Host "Username (MYSQL_USER)"
$MYSQL_PASSWORD = Read-Host "User Password (MYSQL_PASSWORD)  Do not use `"`" or `"#`""

Write-Host "`n============ Creating .env ================`n"
Write-Host "Creating .env files in frontend applications"

# Prepare .env content
$ENV_CONTENT = @"
DB_HOST=$MYSQL_CONTAINER_NAME
DB_USER=$MYSQL_USER
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=$MYSQL_DATABASE
JWT_SECRET=dha7toiacrwoa98cr2pujc2j4u
"@

# Paths where .env files will be written
$paths = @(
  ".\frontendUsersInteface\frontendUsersApp",
  ".\frontendScholarCurriculum\frontendScholarCurriculumApp",
  ".\frontendBirthCertificate\frontendBirthCertificateApp",
  ".\frontendIdentityDigital\frontendDigitalApp"
)

foreach ($path in $paths) {
  if (Test-Path $path) {
    Write-Host "Creating .env in $path"
    $ENV_CONTENT | Set-Content -Path "$path\.env" -Encoding UTF8
  } else {
    Write-Host "Directory $path does not exist. Skipping..."
  }
}

Write-Host "`n========== Starting containers ============`n"
Write-Host "Starting containers with docker-compose..."
docker-compose up -d

# Sleep sequence with visual dots
for ($i = 1; $i -le 10; $i++) {
  Start-Sleep -Seconds 1
  Write-Host "..."
}

Write-Host "Executing commands inside containers..."
for ($i = 1; $i -le 10; $i++) {
  Start-Sleep -Seconds 12
  Write-Host "..."
}

Write-Host "`nWaiting for network to be available..."

# Find Docker network
$NETWORK_NAME = docker network ls --filter name=TokPhyAppNetwork --format "{{.Name}}" | Select-Object -First 1
Write-Host "Network found: $NETWORK_NAME`n"

# Create MySQL container
Write-Host "Creating '$MYSQL_CONTAINER_NAME'..."
docker run -d `
  --name $MYSQL_CONTAINER_NAME `
  --network $NETWORK_NAME `
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD `
  -e MYSQL_DATABASE=$MYSQL_DATABASE `
  -e MYSQL_USER=$MYSQL_USER `
  -e MYSQL_PASSWORD=$MYSQL_PASSWORD `
  -p 3306:3306 `
  mysql:8

Start-Sleep -Seconds 5

Write-Host "`n===========================================`n"
Write-Host "Setup complete, continue with deployment instructions"
Write-Host "`n=============== Done ======================`n"
