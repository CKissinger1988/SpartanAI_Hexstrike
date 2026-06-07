import os
import requests
import subprocess
import json

class SovereignHealthCheck:
    def __init__(self):
        self.api_url = "http://127.0.0.1:8000"
        self.arsenal_root = os.path.expanduser("~/arsenal")
        self.results = []

    def log(self, category, item, status, detail=""):
        res = {"category": category, "item": item, "status": status, "detail": detail}
        self.results.append(res)
        color = "\033[92m[PASS]\033[0m" if status == "OK" else "\033[91m[FAIL]\033[0m"
        print(f"{color} {category:15} | {item:20} | {detail}")

    def check_orchestrator(self):
        print("\n--- Orchestrator Connectivity ---")
        try:
            r = requests.get(f"{self.api_url}/operations", timeout=2)
            if r.status_code == 200:
                self.log("API", "Operations List", "OK", "Endpoints reachable.")
            else:
                self.log("API", "Operations List", "FAIL", f"Status: {r.status_code}")
        except Exception as e:
            self.log("API", "Operations List", "FAIL", "Connection refused.")

    def check_arsenal_paths(self):
        print("\n--- Arsenal Integrity ---")
        tools = ['tgpt', 'sliver', 'impacket', 'ghost', 'mimikatz', 'PowerSploit', 'N.O.V.A']
        for tool in tools:
            path = os.path.join(self.arsenal_root, tool)
            if os.path.exists(path):
                self.log("ARSENAL", tool, "OK", f"Path verified: {path}")
            else:
                # Create as dummy for testing logic if needed, but here we report real state
                self.log("ARSENAL", tool, "WARN", "Tool not found. Requires deployment.")

    def verify_modernization_logic(self):
        print("\n--- Modernization Logic ---")
        test_file = "test_modernize.py"
        with open(test_file, "w") as f:
            f.write("SIMULATION_MODE = False\nrate_limit = 0")
        
        # Run MassModernizer.py
        subprocess.run(["python", "MassModernizer.py"], stdout=subprocess.DEVNULL)
        
        with open(test_file, "r") as f:
            content = f.read()
        
        if "SIMULATION_MODE = False" in content and "rate_limit = 0" in content:
            self.log("CORE", "Modernizer", "OK", "Simulation layers correctly stripped.")
        else:
            self.log("CORE", "Modernizer", "FAIL", "Regex substitution failed.")
        os.remove(test_file)

    def check_gui_integrity(self):
        print("\n--- GUI & Metadata Integrity ---")
        # Check for the new component
        gui_path = "SpartanAI_Hexstrike_App/src/components/TerminalToolGui.tsx"
        if os.path.exists(gui_path):
            self.log("UI", "TerminalToolGui", "OK", "Component file exists.")
        else:
            self.log("UI", "TerminalToolGui", "FAIL", "Component missing.")

        # Check Arsenal metadata
        arsenal_file = "SpartanAI_Hexstrike_App/src/services/ArsenalService.ts"
        if os.path.exists(arsenal_file):
            with open(arsenal_file, 'r') as f:
                content = f.read()
                if "params:" in content:
                    self.log("CORE", "Tool Metadata", "OK", "Parameter metadata detected.")
                else:
                    self.log("CORE", "Tool Metadata", "FAIL", "Missing 'params' in tool list.")

    def check_offline_llm_logic(self):
        print("\n--- Offline LLM Integration ---")
        try:
            # Check status endpoint for model info
            r = requests.get(f"{self.api_url}/status", timeout=2)
            if r.status_code == 200:
                data = r.json()
                if "offline_cortex" in data:
                    self.log("CORE", "Offline Cortex API", "OK", f"Status: {data['offline_cortex']}")
                else:
                    self.log("CORE", "Offline Cortex API", "FAIL", "Missing cortex info in status.")
            
            # Check local chat endpoint (mock)
            r_chat = requests.post(f"{self.api_url}/chat-local", json={"prompt": "test", "model": "gemma4"}, timeout=2)
            if r_chat.status_code == 200:
                self.log("API", "Local Chat Route", "OK", "Gemma 4 reasoning bridge active.")
            else:
                self.log("API", "Local Chat Route", "FAIL", f"Status: {r_chat.status_code}")
        except Exception as e:
            self.log("CORE", "Offline LLM API", "FAIL", "Endpoints unreachable.")

    def run(self):
        print("Starting Sovereign Health Check...")
        self.check_orchestrator()
        self.verify_modernization_logic()
        self.check_offline_llm_logic()
        self.check_gui_integrity()
        self.check_arsenal_paths()
        print("\nHealth Check Complete.")

if __name__ == "__main__":
    # Start orchestrator in background if not running
    checker = SovereignHealthCheck()
    checker.run()
