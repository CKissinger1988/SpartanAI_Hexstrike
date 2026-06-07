import os
import subprocess

def provision_arsenal():
    arsenal_root = os.path.expanduser("~/arsenal")
    os.makedirs(arsenal_root, exist_ok=True)
    
    tools = [
        "https://github.com/aandrew-me/tgpt.git",
        "https://github.com/BishopFox/sliver.git",
        "https://github.com/fortra/impacket.git",
        "https://github.com/EntySec/Ghost.git",
        "https://github.com/nilsteampassword/phpsploit.git",
        "https://github.com/gentilkiwi/mimikatz.git",
        "https://github.com/PowerShellMafia/PowerSploit.git",
        "https://github.com/Kuehne-Industries/PowerHub.git",
        "https://github.com/codingo/NoSQLMap.git",
        "https://github.com/Neohapsis/bbqsql.git",
        "https://github.com/kali-linux/kali-nethunter-project.git",
        "https://github.com/MobSF/Mobile-Security-Framework-MobSF.git",
        "https://github.com/CKissinger1988/hexstrike-ai.git",
        "https://github.com/CKissinger1988/N.O.V.A.git"
    ]

    print(f"[*] Provisioning Red Team Arsenal at {arsenal_root}...")

    for repo in tools:
        folder = repo.split("/")[-1].replace(".git", "")
        if folder == "N.O.V.A": folder = "N.O.V.A" # Maintain casing
        
        target_path = os.path.join(arsenal_root, folder)
        if not os.path.exists(target_path):
            print(f"[*] Cloning {folder}...")
            subprocess.run(["git", "clone", repo, target_path], check=False)
        else:
            print(f"[!] {folder} already exists. Skipping.")

    print("\n[+] Arsenal Provisioning Complete.")

if __name__ == "__main__":
    provision_arsenal()
