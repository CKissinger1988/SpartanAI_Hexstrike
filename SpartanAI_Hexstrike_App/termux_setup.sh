#!/data/data/com.termux/files/usr/bin/bash
# Hexstrike Metasploit Automation Script for Termux
# This script automates the installation and startup of the MSF RPC server for the Hexstrike app.

echo "----------------------------------------------------"
echo "   HEXSTRIKE ENTERPRISE - METASPLOIT AUTOMATOR"
echo "----------------------------------------------------"

# 1. Update and Upgrade
echo "[*] Updating system packages..."
pkg update -y && pkg upgrade -y

# 2. Install core dependencies
echo "[*] Installing dependencies (wget, curl, git)..."
pkg install wget curl git -y

# 3. Install Metasploit Framework
if command -v msfconsole > /dev/null; then
    echo "[!] Metasploit is already installed."
else
    echo "[*] Installing Metasploit Framework... (This can take 10-20 minutes)"
    source <(curl -sL https://raw.githubusercontent.com/gushmazuko/metasploit_in_termux/master/metasploit.sh)
fi

# 4. Clone Arsenal Tools
echo "[*] Cloning Red Team Arsenal tools..."
mkdir -p $HOME/arsenal
TOOLS=(
    "https://github.com/aandrew-me/tgpt.git"
    "https://github.com/BishopFox/sliver.git"
    "https://github.com/fortra/impacket.git"
    "https://github.com/EntySec/Ghost.git"
    "https://github.com/nilsteampassword/phpsploit.git"
    "https://github.com/gentilkiwi/mimikatz.git"
    "https://github.com/PowerShellMafia/PowerSploit.git"
    "https://github.com/Kuehne-Industries/PowerHub.git"
    "https://github.com/codingo/NoSQLMap.git"
    "https://github.com/Neohapsis/bbqsql.git"
    "https://github.com/kali-linux/kali-nethunter-project.git"
    "https://github.com/MobSF/Mobile-Security-Framework-MobSF.git"
    "https://github.com/CKissinger1988/hexstrike-ai.git"
    "https://github.com/CKissinger1988/N.O.V.A.git"
)

for repo in "${TOOLS[@]}"; do
    folder=$(basename "$repo" .git)
    if [ ! -d "$HOME/arsenal/$folder" ]; then
        echo "[*] Cloning $folder..."
        git clone "$repo" "$HOME/arsenal/$folder"
    else
        echo "[!] $folder already exists. Skipping clone."
    fi
done

# 5. Create Startup Commands
echo "[*] Creating startup commands..."

# MSF RPC Command
cat <<EOF > $PREFIX/bin/hexstrike-msf-rpc
#!/data/data/com.termux/files/usr/bin/bash
echo "[*] Launching Metasploit RPC for Hexstrike Mobile..."
msfconsole -q -x "load msfrpc ServerHost=127.0.0.1 ServerPort=55553 User=msf Pass=msf"
EOF
chmod +x $PREFIX/bin/hexstrike-msf-rpc

# NOVA Wake Command
cat <<EOF > $PREFIX/bin/hexstrike-nova
#!/data/data/com.termux/files/usr/bin/bash
echo "[*] Initializing N.O.V.A. Sovereign Hub..."
cd $HOME/arsenal/N.O.V.A && ./scripts/universal_deploy.sh
EOF
chmod +x $PREFIX/bin/hexstrike-nova

echo "----------------------------------------------------"
echo "[+] AUTOMATION COMPLETE"
echo "----------------------------------------------------"
echo "[*] Commands available:"
echo "    hexstrike-msf-rpc  - Starts Metasploit RPC"
echo "    hexstrike-nova     - Starts N.O.V.A. Hub"
echo "----------------------------------------------------"
