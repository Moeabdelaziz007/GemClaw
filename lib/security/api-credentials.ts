/**
 * 🔐 Secure API Credential Management
 * 
 * Provides encrypted storage, OAuth2 token management, API key rotation,
 * and secure credential access for API integrations using AES-GCM.
 */

// No external dependencies for raw security layer

/**
 * Encrypted credential entry
 */
interface EncryptedCredential {
  id: string;
  providerId: string;
  credentialType: 'api_key' | 'oauth_token' | 'refresh_token' | 'basic_auth';
  encryptedValue: string; // AES-GCM encrypted value (iv + ciphertext)
  createdAt: number;
  expiresAt?: number;
  lastRotatedAt?: number;
  scopes?: string[];
  metadata?: Record<string, any>;
}

/**
 * Decryption result
 */
interface DecryptionResult {
  decrypted: string;
  valid: boolean;
  expiresAt?: number;
}

/**
 * API Credentials Manager - Singleton
 */
class APICredentialsManager {
  private static instance: APICredentialsManager;
  
  // In-memory credential cache (peristent storage should be handled by a secure vault)
  private credentials: Map<string, EncryptedCredential> = new Map();
  
  // Key rotation schedule (days)
  private defaultRotationPeriod: number = 90;
  
  // Salt for PBKDF2 (should be unique per user in production)
  private readonly salt = new TextEncoder().encode('gemigram-sovereign-salt-v1');
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  static getInstance(): APICredentialsManager {
    if (!APICredentialsManager.instance) {
      APICredentialsManager.instance = new APICredentialsManager();
    }
    return APICredentialsManager.instance;
  }
  
  /**
   * Store API key securely
   */
  async storeAPIKey(
    providerId: string,
    apiKey: string,
    options?: {
      scopes?: string[];
      expiresAt?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<string> {
    const credentialId = this.generateCredentialId(providerId, 'api_key');
    const encrypted = await this.encrypt(apiKey);
    
    const credential: EncryptedCredential = {
      id: credentialId,
      providerId,
      credentialType: 'api_key',
      encryptedValue: encrypted,
      createdAt: Date.now(),
      expiresAt: options?.expiresAt,
      scopes: options?.scopes,
      metadata: options?.metadata
    };
    
    this.credentials.set(credentialId, credential);
    
    // Credential storage is private to this manager
    
    // console.log(`[Credentials] Stored encrypted API key for ${providerId}`);
    return credentialId;
  }
  
  /**
   * Store OAuth2 tokens
   */
  async storeOAuthToken(
    providerId: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
    scopes?: string[]
  ): Promise<{ accessTokenId: string; refreshTokenId?: string }> {
    const now = Date.now();
    const expiresAt = expiresIn ? now + (expiresIn * 1000) : undefined;
    
    // Store access token
    const accessTokenId = this.generateCredentialId(providerId, 'oauth_token');
    const accessTokenEncrypted = await this.encrypt(accessToken);
    const accessTokenCredential: EncryptedCredential = {
      id: accessTokenId,
      providerId,
      credentialType: 'oauth_token',
      encryptedValue: accessTokenEncrypted,
      createdAt: now,
      expiresAt,
      scopes
    };
    this.credentials.set(accessTokenId, accessTokenCredential);
    
    // Store refresh token if provided
    let refreshTokenId: string | undefined;
    if (refreshToken) {
      refreshTokenId = this.generateCredentialId(providerId, 'refresh_token');
      const refreshTokenEncrypted = await this.encrypt(refreshToken);
      const refreshTokenCredential: EncryptedCredential = {
        id: refreshTokenId,
        providerId,
        credentialType: 'refresh_token',
        encryptedValue: refreshTokenEncrypted,
        createdAt: now
      };
      this.credentials.set(refreshTokenId, refreshTokenCredential);
    }
    
    // Credential storage is private to this manager
    
    // console.log(`[Credentials] Stored encrypted OAuth tokens for ${providerId}`);
    return { accessTokenId, refreshTokenId };
  }
  
  /**
   * Find credential by provider and type
   */
  findCredential(providerId: string, type: string): EncryptedCredential | undefined {
    return Array.from(this.credentials.values()).find(
      cred => cred.providerId === providerId && cred.credentialType === type
    );
  }

  /**
   * Retrieve and decrypt credential by provider and type
   */
  async getCredentialByProvider(providerId: string, type: string): Promise<DecryptionResult | null> {
    const credential = this.findCredential(providerId, type);
    if (!credential) return null;
    return this.getCredential(credential.id);
  }

  /**
   * Delete credential by provider and type
   */
  deleteByProvider(providerId: string, type: string): boolean {
    const credential = this.findCredential(providerId, type);
    if (credential) {
      return this.deleteCredential(credential.id);
    }
    return false;
  }
  
  /**
   * Retrieve and decrypt credential
   */
  async getCredential(credentialId: string): Promise<DecryptionResult | null> {
    const credential = this.credentials.get(credentialId);
    
    if (!credential) {
      console.warn(`[Credentials] Credential ${credentialId} not found`);
      return null;
    }
    
    // Check expiration
    if (credential.expiresAt && Date.now() > credential.expiresAt) {
      console.warn(`[Credentials] Credential ${credentialId} has expired`);
      return {
        decrypted: '',
        valid: false,
        expiresAt: credential.expiresAt
      };
    }
    
    try {
      const decrypted = await this.decrypt(credential.encryptedValue);
      
      return {
        decrypted,
        valid: true,
        expiresAt: credential.expiresAt
      };
    } catch (error) {
      console.error('[Credentials] Failed to decrypt credential:', error);
      return {
        decrypted: '',
        valid: false
      };
    }
  }
  
  /**
   * Get credential value directly
   */
  async getCredentialValue(credentialId: string): Promise<string | null> {
    const result = await this.getCredential(credentialId);
    return result?.valid ? result.decrypted : null;
  }
  
  /**
   * Delete credential
   */
  deleteCredential(credentialId: string): boolean {
    const deleted = this.credentials.delete(credentialId);
    if (deleted) {
      // console.log(`[Credentials] Deleted credential ${credentialId}`);
    }
    return deleted;
  }
  
  /**
   * Rotate API key
   */
  async rotateAPIKey(
    credentialId: string,
    newApiKey: string
  ): Promise<boolean> {
    const credential = this.credentials.get(credentialId);
    
    if (!credential || credential.credentialType !== 'api_key') {
      console.error('[Credentials] Cannot rotate non-API-key credential');
      return false;
    }
    
    // Update with new key
    credential.encryptedValue = await this.encrypt(newApiKey);
    credential.lastRotatedAt = Date.now();
    credential.createdAt = Date.now();
    
    this.credentials.set(credentialId, credential);
    
    // console.log(`[Credentials] Rotated API key for ${credential.providerId}`);
    return true;
  }
  
  /**
   * List all credentials (masked)
   */
  listCredentials(): Array<any> {
    return Array.from(this.credentials.values()).map(cred => ({
      id: cred.id,
      providerId: cred.providerId,
      credentialType: cred.credentialType,
      createdAt: cred.createdAt,
      expiresAt: cred.expiresAt,
      lastRotatedAt: cred.lastRotatedAt,
      isExpired: cred.expiresAt ? Date.now() > cred.expiresAt : false,
      maskedValue: '****' + (cred.id.slice(-4))
    }));
  }

  /**
   * Get credential statistics
   */
  getStatistics() {
    const creds = Array.from(this.credentials.values());
    const now = Date.now();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;

    return {
      totalCredentials: creds.length,
      expiringSoon: creds.filter(c => c.expiresAt && (c.expiresAt - now) < weekInMs && (c.expiresAt - now) > 0).length,
      expired: creds.filter(c => c.expiresAt && now > c.expiresAt).length,
      needsRotation: creds.filter(c => {
        const lastRotated = c.lastRotatedAt || c.createdAt;
        return (now - lastRotated) > (this.defaultRotationPeriod * 24 * 60 * 60 * 1000);
      }).length
    };
  }
  
  /**
   * Clear all credentials
   */
  clearAll(): void {
    this.credentials.clear();
    // console.log('[Credentials] Cleared all credentials');
  }
  
  /**
   * Export credentials (encrypted backup)
   */
  exportCredentials(): string {
    const exportData = {
      version: '2.0',
      exportedAt: Date.now(),
      credentials: Array.from(this.credentials.entries()),
    };
    return JSON.stringify(exportData, null, 2);
  }
  
  /**
   * Import credentials from backup
   */
  importCredentials(exportData: string): boolean {
    try {
      const parsed = JSON.parse(exportData);
      if (!parsed.credentials || !Array.isArray(parsed.credentials)) {
        throw new Error('Invalid export format');
      }
      parsed.credentials.forEach(([key, value]: [string, EncryptedCredential]) => {
        this.credentials.set(key, value);
      });
      // console.log(`[Credentials] Imported ${this.credentials.size} credentials`);
      return true;
    } catch (error) {
      console.error('[Credentials] Failed to import credentials:', error);
      return false;
    }
  }
  
  /**
   * Generate unique credential ID
   */
  private generateCredentialId(providerId: string, type: string): string {
    return `${providerId}-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Encrypt credential value using AES-GCM
   */
  private async encrypt(value: string): Promise<string> {
    const secret = process.env.AETHER_SYSTEM_SECRET || 'fallback-sovereign-secret-2026';
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    
    const key = await this.deriveKey(secret);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  /**
   * Decrypt credential value using AES-GCM
   */
  private async decrypt(encryptedBase64: string): Promise<string> {
    const secret = process.env.AETHER_SYSTEM_SECRET || 'fallback-sovereign-secret-2026';
    const combined = new Uint8Array(
      atob(encryptedBase64).split('').map(c => c.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    const key = await this.deriveKey(secret);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  }

  /**
   * Derive a crypto key from a secret string
   */
  private async deriveKey(secret: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    
    const baseKey = await crypto.subtle.importKey(
      'raw',
      secretData,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
}

// Export singleton instance
export const apiCredentialsManager = APICredentialsManager.getInstance();
