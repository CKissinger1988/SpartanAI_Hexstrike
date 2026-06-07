export interface BoazOperation {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'failed';
  target: string;
  lastSeen: string;
}

export interface PayloadConfig {
  os: 'windows' | 'linux' | 'macos';
  arch: 'x64' | 'x86';
  obfuscationLevel: number;
  format: 'exe' | 'dll' | 'elf' | 'macho' | 'sh' | 'ps1';
}

class BoazApi {
  private baseUrl: string = 'http://127.0.0.1:8000'; // Central Orchestrator API

  async getActiveOperations(): Promise<BoazOperation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/operations`);
      return await response.json();
    } catch {
      // Fallback for demo
      return [
        { id: 'OP-001', name: 'Initial Access - Alpha', status: 'active', target: '10.0.50.12', lastSeen: '2 mins ago' },
      ];
    }
  }

  async generatePayload(config: PayloadConfig): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      return await response.json();
    } catch {
      return { success: false, message: 'Orchestrator offline.' };
    }
  }
}

export const BoazApiService = new BoazApi();
