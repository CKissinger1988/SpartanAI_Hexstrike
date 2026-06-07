export interface ShodanHost {
  ip_str: string;
  port: number;
  org: string;
  os: string | null;
  location: {
    city: string;
    country_name: string;
  };
  isp: string;
  data: string;
}

export interface ShodanSearchResult {
  total: number;
  matches: ShodanHost[];
}

class ShodanApi {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.shodan.io';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async search(query: string): Promise<ShodanSearchResult> {
    if (!this.apiKey) {
      // Return mock data if no API key is set for demo purposes
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            total: 2,
            matches: [
              {
                ip_str: '8.8.8.8',
                port: 53,
                org: 'Google',
                os: 'Linux',
                location: { city: 'Mountain View', country_name: 'United States' },
                isp: 'Google LLC',
                data: 'Recursion enabled: true'
              },
              {
                ip_str: '1.1.1.1',
                port: 443,
                org: 'Cloudflare',
                os: null,
                location: { city: 'San Francisco', country_name: 'United States' },
                isp: 'Cloudflare, Inc.',
                data: 'HTTP/1.1 200 OK\nServer: cloudflare'
              }
            ]
          });
        }, 800);
      });
    }

    const response = await fetch(`${this.baseUrl}/shodan/host/search?key=${this.apiKey}&query=${encodeURIComponent(query)}`);
    return await response.json();
  }

  async getHostInfo(ip: string): Promise<any> {
    if (!this.apiKey) return null;
    const response = await fetch(`${this.baseUrl}/shodan/host/${ip}?key=${this.apiKey}`);
    return await response.json();
  }
}

export const ShodanService = new ShodanApi();
