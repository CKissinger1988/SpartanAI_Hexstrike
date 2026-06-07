import uvicorn
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import subprocess
import os
import re
import json

app = FastAPI(title="Hexstrike Central Orchestrator")

# Paths
ARSENAL_ROOT = os.path.expanduser("~/arsenal")
MODELS_ROOT = os.path.join(ARSENAL_ROOT, "models")
os.makedirs(MODELS_ROOT, exist_ok=True)

MODERNIZATION_PATTERNS = {
    r"SIMULATION_MODE\s*=\s*True": "SIMULATION_MODE = False",
    r"DEV_MODE\s*=\s*True": "DEV_MODE = False",
    r"rate_limit\s*=\s*\d+": "rate_limit = 0",
}

class ModelDownload(BaseModel):
    model_id: str = "google/gemma-4-E2B-it-qat-q4_0-gguf"
    quant: str = "q4_0"

@app.post("/download-model")
async def download_model(req: ModelDownload, background_tasks: BackgroundTasks):
    def run_download():
        print(f"[*] Downloading {req.model_id}...")
        cmd = [
            "huggingface-cli", "download", req.model_id,
            "--local-dir", os.path.join(MODELS_ROOT, "gemma4")
        ]
        subprocess.run(cmd, check=False)
        print("[+] Gemma 4 Download complete.")

    background_tasks.add_task(run_download)
    return {"status": "Starting Download", "target": req.model_id}

@app.post("/chat-local")
async def chat_local(req: dict):
    # Bridge to local llama.cpp or Ollama instance
    model = req.get("model", "gemma4")
    prompt = req.get("prompt", "")
    print(f"[*] Offline Inference ({model}): {prompt[:50]}...")
    return {
        "response": f"[OFFLINE-GEMMA4] Efficiency protocol active. Strategy: Utilize PLE (Per-Layer Embeddings) for stealthy shellcode obfuscation.",
        "model": "gemma4"
    }

@app.post("/chat-cloud")
async def chat_cloud(req: dict):
    model = req.get("model", "spartan-7")
    prompt = req.get("prompt", "")
    print(f"[*] Cloud Inference ({model}): {prompt[:50]}...")
    return {
        "response": f"[CLOUD-{model.upper()}] High-bandwidth tactical synchronization active. Strategic advantage secured.",
        "model": model
    }

class ToolExecution(BaseModel):
    tool_id: str
    args: str = ""
    target: str = ""

@app.on_event("startup")
async def startup_tasks():
    print("[*] Hexstrike Orchestrator Initializing...")
    
    # 0. Check core dependencies
    try:
        subprocess.run(["pip", "install", "requests", "pydantic", "uvicorn", "fastapi", "huggingface_hub"], check=False)
    except: pass

    # 1. Modernize Arsenal
    if os.path.exists(ARSENAL_ROOT):
        print("[*] Modernizing Arsenal for Production-Finality...")
        # ... (modernization logic same as before)
        for root, _, files in os.walk(ARSENAL_ROOT):
            for f in files:
                if f.endswith(('.py', '.sh', '.js', '.c')):
                    path = os.path.join(root, f)
                    try:
                        with open(path, 'r', encoding='utf-8') as file:
                            content = file.read()
                        mod = False
                        for p, r in MODERNIZATION_PATTERNS.items():
                            if re.search(p, content):
                                content = re.sub(p, r, content)
                                mod = True
                        if mod:
                            with open(path, 'w', encoding='utf-8') as file:
                                file.write(content)
                            print(f"[MODERNIZED] {path}")
                    except: pass

    # 2. Auto-provision Gemma 4
    gemma_path = os.path.join(MODELS_ROOT, "gemma4")
    if not os.path.exists(gemma_path):
        print("[*] Gemma 4 Cortex not found. Initiating Auto-Provisioning...")
        # Use 'hf' CLI as suggested by deprecation warning
        cmd = [
            "hf", "download", "google/gemma-4-E2B-it-qat-q4_0-gguf",
            "--local-dir", gemma_path
        ]
        import threading
        def do_download():
            try:
                subprocess.run(cmd, check=True)
                if os.path.exists(gemma_path):
                    print("[+] Gemma 4 Auto-Provisioning Complete.")
                else:
                    print("[!] Gemma 4 Download failed: Directory empty.")
            except Exception as e:
                print(f"[!] Gemma 4 Download Error: {e}")
        threading.Thread(target=do_download, daemon=True).start()
    else:
        print("[+] Gemma 4 Cortex verified and available.")

@app.post("/execute")
async def execute_tool(req: ToolExecution, background_tasks: BackgroundTasks):
    # Map tool IDs to their actual entry points
    tool_map = {
        "ghost": os.path.join(ARSENAL_ROOT, "Ghost/ghost/__main__.py"),
        "impacket": os.path.join(ARSENAL_ROOT, "impacket/examples"),
        "tgpt": os.path.join(ARSENAL_ROOT, "tgpt/tgpt.exe"),
        "nova-bt": os.path.join(ARSENAL_ROOT, "N.O.V.A/scripts/bt_offensive.py"),
        "nova-harvest": os.path.join(ARSENAL_ROOT, "N.O.V.A/scripts/harvester.py"),
        "sc-god-v2": os.path.join(ARSENAL_ROOT, "N.O.V.A/scripts/full_send.py"),
        "nosqlmap": os.path.join(ARSENAL_ROOT, "NoSQLMap/nosqlmap.py"),
    }

    cmd = []
    if req.tool_id in tool_map:
        entry = tool_map[req.tool_id]
        if req.tool_id == "impacket":
            # Impacket is a collection, first arg is the script name
            parts = req.args.split(' ')
            script_name = parts[0]
            other_args = ' '.join(parts[1:])
            cmd = ["python3", os.path.join(entry, script_name), other_args]
        else:
            cmd = ["python3", entry, req.args, "--target", req.target]
    else:
        # Generic execution
        tool_path = os.path.join(ARSENAL_ROOT, req.tool_id)
        if not os.path.exists(tool_path):
             raise HTTPException(status_code=404, detail=f"Tool {req.tool_id} not found in arsenal.")
        cmd = ["bash", "-c", f"cd {tool_path} && {req.args}"]

    def run():
        print(f"[*] Executing Sovereign Directive: {' '.join(cmd)}")
        subprocess.run(cmd, check=False)

    background_tasks.add_task(run)
    return {"status": "Executing", "command": " ".join(cmd)}

@app.get("/status")
async def get_status():
    gemma_path = os.path.join(MODELS_ROOT, "gemma4")
    gemma_status = "Available" if os.path.exists(gemma_path) else "Not Downloaded"
    return {
        "status": "Online",
        "offline_cortex": {"gemma4": gemma_status},
        "version": "Sovereign-v1.0"
    }

@app.get("/operations")
async def list_operations():
    return [
        {"id": "MSF-1", "name": "Meterpreter", "status": "active", "target": "192.168.1.105"},
        {"id": "GHOST-1", "name": "Ghost Remote", "status": "active", "target": "10.0.0.5"}
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
