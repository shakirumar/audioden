$sourceDir = "c:\Users\HP\OneDrive\Desktop\audio den"
$desktopDir = "c:\Users\HP\OneDrive\Desktop"

# 1. Ensure fresh production build exists
Set-Location $sourceDir

Write-Host "Building production bundle..."
npm run build

# 2. Package 1: Full Deployment Package (audioden_full_deployment.zip & audioden-node.zip)
# Contains: dist, src, public, server.js, package.json, package-lock.json, vite.config.js, index.html, README.md, .gitignore
Write-Host "Creating Full Project Deployment Package..."
$fullZipPath = Join-Path $sourceDir "audioden_full_deployment.zip"
$nodeZipPath = Join-Path $sourceDir "audioden-node.zip"
$desktopFullZip = Join-Path $desktopDir "audioden_full_deployment.zip"

if (Test-Path $fullZipPath) { Remove-Item $fullZipPath -Force }
if (Test-Path $nodeZipPath) { Remove-Item $nodeZipPath -Force }
if (Test-Path $desktopFullZip) { Remove-Item $desktopFullZip -Force }

$itemsToCompress = @(
    "dist",
    "src",
    "public",
    "server.js",
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "index.html",
    "README.md",
    ".gitignore",
    ".oxlintrc.json"
)

Compress-Archive -Path $itemsToCompress -DestinationPath $fullZipPath -CompressionLevel Optimal
Copy-Item $fullZipPath $nodeZipPath -Force
Copy-Item $fullZipPath $desktopFullZip -Force

# 3. Package 2: Hostinger public_html Direct Extract (audioden_hostinger_web.zip)
# Contains the exact contents of dist/ to extract directly inside public_html
Write-Host "Creating Hostinger public_html Package..."
$webZipPath = Join-Path $sourceDir "audioden_hostinger_web.zip"
$desktopWebZip = Join-Path $desktopDir "audioden_hostinger_web.zip"

if (Test-Path $webZipPath) { Remove-Item $webZipPath -Force }
if (Test-Path $desktopWebZip) { Remove-Item $desktopWebZip -Force }

Compress-Archive -Path "dist\*", "dist\.htaccess" -DestinationPath $webZipPath -CompressionLevel Optimal
Copy-Item $webZipPath $desktopWebZip -Force

Write-Host "Deployment zip files created successfully!"
Get-Item $desktopFullZip, $desktopWebZip | Select-Object Name, Length, LastWriteTime
