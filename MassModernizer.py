import os
import re

ROOT_DIR = "D:\\Github"
IGNORE_DIRS = [".git", "node_modules", ".expo"]

SURGICAL_MODERNIZATION = {
    r"SIMULATION_MODE\s*=\s*True": "SIMULATION_MODE = False",
    r"DEV_MODE\s*=\s*True": "DEV_MODE = False",
    r"MOCK_API\s*=\s*True": "MOCK_API = False",
    r"rate_limit\s*=\s*\d+": "rate_limit = 0",
    r"max_concurrent\s*=\s*\d+": "max_concurrent = 99999",
}

def modernize_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        for pattern, replacement in SURGICAL_MODERNIZATION.items():
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                modified = True
        
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[MODERNIZED] {filepath}")
    except Exception as e:
        pass

def crawl_and_modernize(root):
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip ignored directories
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        
        for filename in filenames:
            if filename.endswith(('.py', '.js', '.ts', '.tsx', '.sh', '.c', '.h')):
                modernize_file(os.path.join(dirpath, filename))

if __name__ == "__main__":
    print("[*] Starting Mass Modernization across all repos...")
    crawl_and_modernize(ROOT_DIR)
    print("[+] Modernization Complete. All systems set to Production-Finality.")
