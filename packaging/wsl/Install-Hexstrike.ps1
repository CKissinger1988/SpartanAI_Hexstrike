# Hexstrike-N.O.V.A. WSL Sovereign Installer
# Version: 1.0.0-OMEGA

param (
    [string]$DistroName = "Hexstrike-Sovereign",
    [string]$InstallPath = "$HOME\Hexstrike"
)

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "   HEXSTRIKE ENTERPRISE - WSL SOVEREIGN INSTALLER" -ForegroundColor Cyan
Write-Host "----------------------------------------------------" -ForegroundColor Cyan

# 1. Check WSL Status
Write-Host "[*] Verifying WSL Subsystem..."
$wslCheck = wsl --list --quiet
if ($null -eq $wslCheck) {
    Write-Error "WSL is not enabled. Please run 'wsl --install' and restart."
    exit 1
}

# 2. Create Install Directory
Write-Host "[*] Creating deployment root at $InstallPath..."
New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null

# 3. Import Base Distro (Simulation of Offline Bundle)
# In a real offline installer, we would import a pre-configured .tar file
Write-Host "[*] Provisioning Sovereign Distro ($DistroName)..."
wsl --install -d Ubuntu --no-launch

# 4. Sync Files
Write-Host "[*] Synchronizing Arsenal and Intelligence Modules..."
Copy-Item -Path ".\*" -Destination $InstallPath -Recurse -Exclude "packaging",".git"

# 5. Bootstrap WSL Node
Write-Host "[*] Bootstrapping Sovereign Node..."
wsl -d Ubuntu -u root -- bash -c "
    apt update && apt install -y python3 python3-pip git;
    mkdir -p /usr/share/hexstrike;
    cp -r /mnt/d/Github/SpartanAI_Hexstrike/* /usr/share/hexstrike/;
    cd /usr/share/hexstrike && python3 -m pip install fastapi uvicorn requests pydantic;
"

# 6. Create Launch Shortcut
$ShortcutPath = "$HOME\Desktop\Hexstrike-NOVA.lnk"
$Shell = New-Object -ComObject WScript.Shell
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "wsl.exe"
$Shortcut.Arguments = "-d Ubuntu -u root -- python3 /usr/share/hexstrike/HexstrikeCentralAPI.py"
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Save()

Write-Host "[+] INSTALLATION COMPLETE." -ForegroundColor Green
Write-Host "[*] Launch the platform via the 'Hexstrike-NOVA' shortcut on your Desktop."
Write-Host "----------------------------------------------------"
