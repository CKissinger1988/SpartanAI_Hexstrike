import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

// Dynamic import for native module
let Voice: any;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch (e) {
    console.warn('Voice module not found.');
  }
}

export type SpeechResultsEvent = { value?: string[] };
export type SpeechErrorEvent = { error?: any };

export type CommandIntent = 
  | { type: 'GENERATE_PAYLOAD', os: string }
  | { type: 'NAVIGATE', screen: string }
  | { type: 'SHOW_SESSIONS' }
  | { type: 'SHODAN_SEARCH', query: string }
  | { type: 'DEPLOY_TOOL', toolId: string }
  | { type: 'EXECUTE_TOOL', toolId: string, args?: string }
  | { type: 'EXPLOIT_DEVICE', target: string, tool: string }
  | { type: 'UNKNOWN' };

class VoiceOrchestrator {
  private isListening = false;

  constructor() {
    if (Voice) {
      Voice.onSpeechResults = this.onSpeechResults;
      Voice.onSpeechError = this.onSpeechError;
    }
  }

  async startListening() {
    if (Platform.OS === 'web') {
      await Speech.speak('Voice commands not supported on web prototype.');
      return;
    }
    try {
      await Voice.start('en-US');
      this.isListening = true;
      await Speech.speak('System listening.');
    } catch (e) {
      console.error(e);
    }
  }

  async stopListening() {
    if (!Voice) return;
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (e) {
      console.error(e);
    }
  }

  private onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      const text = e.value[0].toLowerCase();
      const intent = this.parseCommand(text);
      this.executeIntent(intent);
    }
  };

  private onSpeechError = (e: SpeechErrorEvent) => {
    console.error('Speech Error:', e.error);
    Speech.speak('Command not recognized.');
  };

  private parseCommand(text: string): CommandIntent {
    const isNova = text.includes('nova') || text.includes('novak'); // Wake word variations
    const cmdText = isNova ? text.split(/nova |novak /)[1] || text : text;

    // --- N.O.V.A. Sovereign Directives ---
    if (cmdText.includes('full send on')) {
      const target = cmdText.split('full send on')[1].trim();
      return { type: 'EXPLOIT_DEVICE', target, tool: 'SC-GOD-v2' };
    }

    if (cmdText.includes('bt scan') || cmdText.includes('bluetooth scan')) {
      return { type: 'EXECUTE_TOOL', toolId: 'nova-bt', args: 'scan' };
    }

    if (cmdText.includes('harvest')) {
      const type = cmdText.includes('crypto') ? 'crypto' : 'secrets';
      return { type: 'EXECUTE_TOOL', toolId: `nova-${type}`, args: 'harvest' };
    }

    if (cmdText.includes('omega trigger')) {
      return { type: 'NAVIGATE', screen: 'disguise' };
    }

    // --- Standard Directives ---
    if (cmdText.includes('go to') || cmdText.includes('navigate to')) {
      const screen = cmdText.includes('metasploit') ? 'metasploit' : 
                     cmdText.includes('shodan') ? 'shodan' : 
                     cmdText.includes('arsenal') ? 'arsenal' : 'dashboard';
      return { type: 'NAVIGATE', screen };
    }

    // Payload Generation
    if (text.includes('generate') && text.includes('payload')) {
      const os = text.includes('windows') ? 'windows' : text.includes('linux') ? 'linux' : 'macos';
      return { type: 'GENERATE_PAYLOAD', os };
    }

    // Tool Deployment
    if (text.includes('deploy') || text.includes('install')) {
      const tool = text.split(/deploy |install /)[1];
      return { type: 'DEPLOY_TOOL', toolId: tool };
    }

    // Tool Execution
    if (text.includes('run') || text.includes('execute')) {
      const parts = text.split(/run |execute /)[1].split(' with ');
      return { type: 'EXECUTE_TOOL', toolId: parts[0], args: parts[1] };
    }

    // Exploitation
    if (text.includes('exploit')) {
      const target = text.match(/target ([\d\.]+)/)?.[1] || 'unknown';
      const tool = text.includes('ghost') ? 'ghost' : text.includes('evil droid') ? 'evil-droid' : 'metasploit';
      return { type: 'EXPLOIT_DEVICE', target, tool };
    }

    // Shodan
    if (text.includes('search shodan for')) {
      const query = text.split('search shodan for')[1].trim();
      return { type: 'SHODAN_SEARCH', query };
    }

    if (text.includes('sessions')) return { type: 'SHOW_SESSIONS' };

    return { type: 'UNKNOWN' };
  }

  private async executeIntent(intent: CommandIntent) {
    switch (intent.type) {
      case 'GENERATE_PAYLOAD':
        await Speech.speak(`Generating ${intent.os} payload.`);
        break;
      case 'NAVIGATE':
        await Speech.speak(`Switching to ${intent.screen}.`);
        break;
      case 'DEPLOY_TOOL':
        await Speech.speak(`Deploying ${intent.toolId} to arsenal.`);
        break;
      case 'EXECUTE_TOOL':
        await Speech.speak(`Executing ${intent.toolId}.`);
        break;
      case 'EXPLOIT_DEVICE':
        await Speech.speak(`Launching exploitation of ${intent.target} using ${intent.tool}.`);
        break;
      case 'SHOW_SESSIONS':
        await Speech.speak('Retrieving active sessions.');
        break;
      case 'SHODAN_SEARCH':
        await Speech.speak(`Querying Shodan for ${intent.query}.`);
        break;
      case 'UNKNOWN':
        await Speech.speak('Command unknown.');
        break;
    }
  }
}

export const VoiceService = new VoiceOrchestrator();
