# Face Emotion Recognition - Startup Script
# Run this in PowerShell as Administrator

Write-Host "���� Starting Face Emotion Recognition Project" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if we're in the right directory
$projectRoot = "C:\Users\KALYAN\Projects\face-emotion"
Set-Location $projectRoot

Write-Host "`n���� Setting up Backend (FastAPI)..." -ForegroundColor Yellow
Set-Location "$projectRoot\backend"

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Gray
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Gray
& "$projectRoot\backend\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Gray
pip install -r requirements.txt

# Start backend in background
Write-Host "Starting FastAPI backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; & 'venv\Scripts\Activate.ps1'; python main.py" -WindowStyle Normal

Write-Host "`n���� Setting up Frontend (Next.js)..." -ForegroundColor Yellow
Set-Location "$projectRoot\frontend"

# Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Gray
    npm install
}

# Start frontend
Write-Host "Starting Next.js frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; npm run dev" -WindowStyle Normal

Write-Host "`n��� Both servers starting!" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "`nPress Ctrl+C in each window to stop the servers." -ForegroundColor Gray