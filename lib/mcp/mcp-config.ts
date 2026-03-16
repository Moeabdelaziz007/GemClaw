/**
 * ⚙️ MCP Configuration Manager
 * 
 * Manages MCP provider configurations, server discovery, credential storage,
 * connection profiles, and rate limiting settings.
 */

import { 
  MCPProvider, 
  MCPServer,
  MCPConnectionProfile 
} from '../agents/skill-types';

/**
 * Credential entry for secure storage
 */
interface CredentialEntry {
  providerId: string;
  credentialType: 'api_key' | 'oauth_token' | 'refresh_token';
  value: string; // Should be encrypted in production
  expiresAt?: number;
  scopes?: string[];
}

/**
 * Server discovery result from marketplace
 */
interface DiscoveredServer {
  id: string;
  name: string;
  providerId: string;
  endpoint: string;
  version: string;
  description: string;
  capabilities: string[];
  category: string;
  rating?: number;
  installCount?: number;
}

/**
 * MCP Configuration Manager
 */
class MCPConfigManager {
  private static instance: MCPConfigManager;
  
  // Credential storage (in production, this should be encrypted)
  private credentials: Map<string, CredentialEntry> = new Map();
  
  // Discovered servers from marketplace
  private discoveredServers: DiscoveredServer[] = [];
  
  // Marketplace cache timestamp
  private lastMarketplaceFetch: number = 0;
  private marketplaceCacheDuration: number = 3600000; // 1 hour
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}
  
  /**
   * Get the singleton instance
   */
  static getInstance(): MCPConfigManager {
    if (!MCPConfigManager.instance) {
      MCPConfigManager.instance = new MCPConfigManager();
    }
    return MCPConfigManager.instance;
  }
  
  /**
   * Store API key credential
   */
  storeAPIKey(
    providerId: string,
    apiKey: string,
    scopes?: string[]
  ): void {
    const credential: CredentialEntry = {
      providerId,
      credentialType: 'api_key',
      value: apiKey, // TODO: Encrypt in production
      scopes
    };
    
    this.credentials.set(`${providerId}:api_key`, credential);
    console.log(`[MCP Config] Stored API key for provider: ${providerId}`);
  }
  
  /**
   * Store OAuth token
   */
  storeOAuthToken(
    providerId: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
    scopes?: string[]
  ): void {
    const now = Date.now();
    
    // Store access token
    const accessTokenCredential: CredentialEntry = {
      providerId,
      credentialType: 'oauth_token',
      value: accessToken,
      expiresAt: expiresIn ? now + (expiresIn * 1000) : undefined,
      scopes
    };
    
    this.credentials.set(`${providerId}:access_token`, accessTokenCredential);
    
    // Store refresh token if provided
    if (refreshToken) {
      const refreshTokenCredential: CredentialEntry = {
        providerId,
        credentialType: 'refresh_token',
        value: refreshToken
      };
      
      this.credentials.set(`${providerId}:refresh_token`, refreshTokenCredential);
    }
    
    console.log(`[MCP Config] Stored OAuth tokens for provider: ${providerId}`);
  }
  
  /**
   * Get credential by provider ID and type
   */
  getCredential(
    providerId: string,
    credentialType: 'api_key' | 'oauth_token' | 'refresh_token'
  ): CredentialEntry | undefined {
    return this.credentials.get(`${providerId}:${credentialType}`);
  }
  
  /**
   * Check if credential is expired
   */
  isCredentialExpired(providerId: string, credentialType: string): boolean {
    const credential = this.credentials.get(`${providerId}:${credentialType}`);
    
    if (!credential || !credential.expiresAt) {
      return false;
    }
    
    return Date.now() > credential.expiresAt;
  }
  
  /**
   * Remove credential
   */
  removeCredential(providerId: string, credentialType: string): void {
    this.credentials.delete(`${providerId}:${credentialType}`);
    console.log(`[MCP Config] Removed credential for ${providerId}:${credentialType}`);
  }
  
  /**
   * Clear all credentials
   */
  clearCredentials(): void {
    this.credentials.clear();
    console.log('[MCP Config] Cleared all credentials');
  }
  
  /**
   * Get all stored credentials (for UI display - masked)
   */
  getStoredCredentials(): Array<{
    providerId: string;
    credentialType: string;
    hasValue: boolean;
    expiresAt?: number;
    isExpired: boolean;
  }> {
    return Array.from(this.credentials.values()).map(cred => ({
      providerId: cred.providerId,
      credentialType: cred.credentialType,
      hasValue: !!cred.value,
      expiresAt: cred.expiresAt,
      isExpired: cred.expiresAt ? Date.now() > cred.expiresAt : false
    }));
  }
  
  /**
   * Cache discovered servers from marketplace
   */
  cacheDiscoveredServers(servers: DiscoveredServer[]): void {
    this.discoveredServers = servers;
    this.lastMarketplaceFetch = Date.now();
    console.log(`[MCP Config] Cached ${servers.length} discovered servers`);
  }
  
  /**
   * Get cached discovered servers
   */
  getDiscoveredServers(): DiscoveredServer[] {
    // Check if cache is stale
    const now = Date.now();
    if (now - this.lastMarketplaceFetch > this.marketplaceCacheDuration) {
      console.log('[MCP Config] Marketplace cache is stale, refresh recommended');
    }
    
    return [...this.discoveredServers];
  }
  
  /**
   * Search discovered servers
   */
  searchServers(query: string): DiscoveredServer[] {
    const lowerQuery = query.toLowerCase();
    
    return this.discoveredServers.filter(server => 
      server.name.toLowerCase().includes(lowerQuery) ||
      server.description.toLowerCase().includes(lowerQuery) ||
      server.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery))
    );
  }
  
  /**
   * Filter servers by category
   */
  filterServersByCategory(category: string): DiscoveredServer[] {
    return this.discoveredServers.filter(server => 
      server.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  /**
   * Get server by ID
   */
  getServerById(serverId: string): DiscoveredServer | undefined {
    return this.discoveredServers.find(server => server.id === serverId);
  }
  
  /**
   * Create connection profile from discovered server
   */
  createProfileFromServer(
    profileName: string,
    server: DiscoveredServer
  ): MCPConnectionProfile {
    const mcpServer: MCPServer = {
      id: server.id,
      providerId: server.providerId,
      name: server.name,
      endpoint: server.endpoint,
      version: server.version,
      capabilities: server.capabilities,
      status: 'inactive'
    };
    
    const profile: MCPConnectionProfile = {
      id: `profile-${Date.now()}`,
      name: profileName,
      servers: [server.id],
      active: false
    };
    
    console.log(`[MCP Config] Created profile "${profileName}" with server ${server.name}`);
    return profile;
  }
  
  /**
   * Set marketplace cache duration
   */
  setMarketplaceCacheDuration(durationMs: number): void {
    this.marketplaceCacheDuration = durationMs;
    console.log(`[MCP Config] Set marketplace cache duration to ${durationMs}ms`);
  }
  
  /**
   * Check if marketplace cache needs refresh
   */
  needsMarketplaceRefresh(): boolean {
    const now = Date.now();
    return now - this.lastMarketplaceFetch > this.marketplaceCacheDuration;
  }
  
  /**
   * Export configuration for backup
   */
  exportConfiguration(): string {
    const config = {
      credentials: Array.from(this.credentials.entries()),
      discoveredServers: this.discoveredServers,
      lastMarketplaceFetch: this.lastMarketplaceFetch,
      exportedAt: Date.now()
    };
    
    return JSON.stringify(config, null, 2);
  }
  
  /**
   * Import configuration from backup
   */
  importConfiguration(jsonString: string): void {
    try {
      const config = JSON.parse(jsonString);
      
      if (config.credentials) {
        config.credentials.forEach(([key, value]: [string, CredentialEntry]) => {
          this.credentials.set(key, value);
        });
      }
      
      if (config.discoveredServers) {
        this.discoveredServers = config.discoveredServers;
      }
      
      if (config.lastMarketplaceFetch) {
        this.lastMarketplaceFetch = config.lastMarketplaceFetch;
      }
      
      console.log('[MCP Config] Successfully imported configuration');
      
    } catch (error) {
      console.error('[MCP Config] Failed to import configuration:', error);
      throw new Error('Invalid configuration format');
    }
  }
  
  /**
   * Validate provider configuration
   */
  validateProviderConfiguration(provider: MCPProvider): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!provider.id || provider.id.trim() === '') {
      errors.push('Provider ID is required');
    }
    
    if (!provider.name || provider.name.trim() === '') {
      errors.push('Provider name is required');
    }
    
    if (!provider.baseUrl || provider.baseUrl.trim() === '') {
      errors.push('Provider base URL is required');
    } else {
      try {
        new URL(provider.baseUrl);
      } catch {
        errors.push('Provider base URL must be a valid URL');
      }
    }
    
    if (provider.authType === 'oauth2' && !provider.scopes?.length) {
      errors.push('OAuth2 providers should specify required scopes');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate server configuration
   */
  validateServerConfiguration(server: MCPServer): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!server.id || server.id.trim() === '') {
      errors.push('Server ID is required');
    }
    
    if (!server.providerId || server.providerId.trim() === '') {
      errors.push('Provider ID is required');
    }
    
    if (!server.name || server.name.trim() === '') {
      errors.push('Server name is required');
    }
    
    if (!server.endpoint || server.endpoint.trim() === '') {
      errors.push('Server endpoint URL is required');
    } else {
      try {
        new URL(server.endpoint);
      } catch {
        errors.push('Server endpoint must be a valid URL');
      }
    }
    
    if (!server.version || server.version.trim() === '') {
      errors.push('Server version is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get configuration statistics
   */
  getStatistics(): {
    totalCredentials: number;
    expiredCredentials: number;
    totalDiscoveredServers: number;
    categoriesCount: number;
    cacheAge: number;
  } {
    const credentials = this.getStoredCredentials();
    const expiredCount = credentials.filter(c => c.isExpired).length;
    
    const categories = new Set(
      this.discoveredServers.map(s => s.category)
    );
    
    return {
      totalCredentials: credentials.length,
      expiredCredentials: expiredCount,
      totalDiscoveredServers: this.discoveredServers.length,
      categoriesCount: categories.size,
      cacheAge: Date.now() - this.lastMarketplaceFetch
    };
  }
}

// Export singleton instance
export const mcpConfigManager = MCPConfigManager.getInstance();
