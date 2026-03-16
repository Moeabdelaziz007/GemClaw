/**
 * 🔐 Secure API Credential Management
 * 
 * Provides encrypted storage, OAuth2 token management, API key rotation,
 * and secure credential access for API integrations.
 */

import { mcpConfigManager } from '../mcp';

/**
 * Encrypted credential entry
 */
interface EncryptedCredential {
  id: string;
  providerId: string;
  credentialType: 'api_key' | 'oauth_token' | 'refresh_token' | 'basic_auth';
  encryptedValue: string; // In production, this should be properly encrypted
  createdAt: number;
  expiresAt?: number;
  lastRotatedAt?: number;
  scopes?: string[];
  metadata?: Record<string, any>;
}

/**
 * Credential encryption result
 */
interface EncryptionResult {
  encrypted: string;
  iv: string; // Initialization vector
  authTag?: string; // Authentication tag for GCM mode
}

/**
 * Credential decryption result
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
  
  // In-memory credential cache (in production, persist securely)
  private credentials: Map<string, EncryptedCredential> = new Map();
  
  // Key rotation schedule (days)
  private defaultRotationPeriod: number = 90;
  
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
  storeAPIKey(
    providerId: string,
    apiKey: string,
    options?: {
      scopes?: string[];
      expiresAt?: number;
      metadata?: Record<string, any>;
    }
  ): string {
    const credentialId = this.generateCredentialId(providerId, 'api_key');
    
    const credential: EncryptedCredential = {
      id: credentialId,
      providerId,
      credentialType: 'api_key',
      encryptedValue: this.encrypt(apiKey), // Encrypt before storage
      createdAt: Date.now(),
      expiresAt: options?.expiresAt,
      scopes: options?.scopes,
      metadata: options?.metadata
    };
    
    this.credentials.set(credentialId, credential);
    
    // Also store in MCP config manager for cross-reference
    mcpConfigManager.storeAPIKey(providerId, apiKey, options?.scopes);
    
    console.log(`[Credentials] Stored API key for ${providerId}`);
    return credentialId;
  }
  
  /**
   * Store OAuth2 tokens
   */
  storeOAuthToken(
    providerId: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
    scopes?: string[]
  ): { accessTokenId: string; refreshTokenId?: string } {
    const now = Date.now();
    const expiresAt = expiresIn ? now + (expiresIn * 1000) : undefined;
    
    // Store access token
    const accessTokenId = this.generateCredentialId(providerId, 'oauth_token');
    const accessTokenCredential: EncryptedCredential = {
      id: accessTokenId,
      providerId,
      credentialType: 'oauth_token',
      encryptedValue: this.encrypt(accessToken),
      createdAt: now,
      expiresAt,
      scopes
    };
    this.credentials.set(accessTokenId, accessTokenCredential);
    
    // Store refresh token if provided
    let refreshTokenId: string | undefined;
    if (refreshToken) {
      refreshTokenId = this.generateCredentialId(providerId, 'refresh_token');
      const refreshTokenCredential: EncryptedCredential = {
        id: refreshTokenId,
        providerId,
        credentialType: 'refresh_token',
        encryptedValue: this.encrypt(refreshToken),
        createdAt: now
      };
      this.credentials.set(refreshTokenId, refreshTokenCredential);
    }
    
    // Also store in MCP config manager
    mcpConfigManager.storeOAuthToken(providerId, accessToken, refreshToken, expiresIn, scopes);
    
    console.log(`[Credentials] Stored OAuth tokens for ${providerId}`);
    return { accessTokenId, refreshTokenId };
  }
  
  /**
   * Retrieve and decrypt credential
   */
  getCredential(credentialId: string): DecryptionResult | null {
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
      const decrypted = this.decrypt(credential.encryptedValue);
      
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
   * Get credential value directly (convenience method)
   */
  getCredentialValue(credentialId: string): string | null {
    const result = this.getCredential(credentialId);
    return result?.valid ? result.decrypted : null;
  }
  
  /**
   * Delete credential
   */
  deleteCredential(credentialId: string): boolean {
    const deleted = this.credentials.delete(credentialId);
    
    if (deleted) {
      console.log(`[Credentials] Deleted credential ${credentialId}`);
    }
    
    return deleted;
  }
  
  /**
   * Rotate API key
   */
  rotateAPIKey(
    credentialId: string,
    newApiKey: string
  ): boolean {
    const credential = this.credentials.get(credentialId);
    
    if (!credential || credential.credentialType !== 'api_key') {
      console.error('[Credentials] Cannot rotate non-API-key credential');
      return false;
    }
    
    // Update with new key
    credential.encryptedValue = this.encrypt(newApiKey);
    credential.lastRotatedAt = Date.now();
    credential.createdAt = Date.now(); // Reset creation time
    
    this.credentials.set(credentialId, credential);
    
    console.log(`[Credentials] Rotated API key for ${credential.providerId}`);
    return true;
  }
  
  /**
   * List all credentials (masked for security)
   */
  listCredentials(): Array<{
    id: string;
    providerId: string;
    credentialType: string;
    createdAt: number;
    expiresAt?: number;
    lastRotatedAt?: number;
    isExpired: boolean;
    maskedValue: string;
  }> {
    return Array.from(this.credentials.values()).map(cred => ({
      id: cred.id,
      providerId: cred.providerId,
      credentialType: cred.credentialType,
      createdAt: cred.createdAt,
      expiresAt: cred.expiresAt,
      lastRotatedAt: cred.lastRotatedAt,
      isExpired: cred.expiresAt ? Date.now() > cred.expiresAt : false,
      maskedValue: this.maskCredential(cred.encryptedValue)
    }));
  }
  
  /**
   * Get expiring credentials (next 7 days)
   */
  getExpiringCredentials(daysThreshold: number = 7): EncryptedCredential[] {
    const threshold = Date.now() + (daysThreshold * 24 * 60 * 60 * 1000);
    
    return Array.from(this.credentials.values()).filter(
      cred => cred.expiresAt && cred.expiresAt <= threshold
    );
  }
  
  /**
   * Clear all credentials
   */
  clearAll(): void {
    this.credentials.clear();
    console.log('[Credentials] Cleared all credentials');
  }
  
  /**
   * Export credentials (encrypted backup)
   */
  exportCredentials(password: string): string {
    // In production, encrypt entire export with password
    const exportData = {
      version: '1.0',
      exportedAt: Date.now(),
      credentials: Array.from(this.credentials.entries()),
      // Note: encryptedValues remain encrypted in export
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  /**
   * Import credentials from backup
   */
  importCredentials(exportData: string, password: string): boolean {
    try {
      const parsed = JSON.parse(exportData);
      
      if (!parsed.credentials || !Array.isArray(parsed.credentials)) {
        throw new Error('Invalid export format');
      }
      
      parsed.credentials.forEach(([key, value]: [string, EncryptedCredential]) => {
        this.credentials.set(key, value);
      });
      
      console.log(`[Credentials] Imported ${this.credentials.size} credentials`);
      return true;
      
    } catch (error) {
      console.error('[Credentials] Failed to import credentials:', error);
      return false;
    }
  }
  
  /**
   * Set default rotation period
   */
  setRotationPeriod(days: number): void {
    this.defaultRotationPeriod = days;
    console.log(`[Credentials] Set rotation period to ${days} days`);
  }
  
  /**
   * Generate unique credential ID
   */
  private generateCredentialId(providerId: string, type: string): string {
    return `${providerId}-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Encrypt credential value
   * TODO: Implement proper encryption using Web Crypto API
   */
  private encrypt(value: string): string {
    // Placeholder - in production use AES-GCM encryption
    // For now, base64 encode (NOT SECURE, just obfuscation)
    try {
      return btoa(value);
    } catch {
      // Fallback for non-ASCII characters
      return Buffer.from(value).toString('base64');
    }
  }
  
  /**
   * Decrypt credential value
   * TODO: Implement proper decryption using Web Crypto API
   */
  private decrypt(encryptedValue: string): string {
    // Placeholder - in production use AES-GCM decryption
    try {
      return atob(encryptedValue);
    } catch {
      // Fallback for Node.js environment
      return Buffer.from(encryptedValue, 'base64').toString('utf-8');
    }
  }
  
  /**
   * Mask credential value for display
   */
  private maskCredential(value: string): string {
    if (value.length <= 8) {
      return '***';
    }
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
  }
  
  /**
   * Validate credential strength
   */
  validateCredentialStrength(apiKey: string): {
    valid: boolean;
    score: number;
    issues: string[];
  } {
    const issues: string[] = [];
    let score = 100;
    
    // Check length
    if (apiKey.length < 32) {
      issues.push('API key is too short (minimum 32 characters recommended)');
      score -= 30;
    }
    
    // Check entropy (simplified)
    const uniqueChars = new Set(apiKey).size;
    if (uniqueChars < apiKey.length * 0.5) {
      issues.push('API key has low entropy (too repetitive)');
      score -= 20;
    }
    
    // Check for common patterns
    if (/^[0-9]+$/.test(apiKey)) {
      issues.push('API key contains only numbers');
      score -= 20;
    }
    
    if (/^[a-z]+$/.test(apiKey)) {
      issues.push('API key contains only lowercase letters');
      score -= 20;
    }
    
    return {
      valid: score >= 60,
      score: Math.max(0, score),
      issues
    };
  }
  
  /**
   * Get credential statistics
   */
  getStatistics(): {
    totalCredentials: number;
    byType: Record<string, number>;
    expiringSoon: number;
    expired: number;
    needsRotation: number;
  } {
    const credentials = this.listCredentials();
    const byType: Record<string, number> = {};
    let expiringSoon = 0;
    let expired = 0;
    let needsRotation = 0;
    
    const rotationThreshold = Date.now() - (this.defaultRotationPeriod * 24 * 60 * 60 * 1000);
    
    credentials.forEach(cred => {
      // Count by type
      byType[cred.credentialType] = (byType[cred.credentialType] || 0) + 1;
      
      // Check expiration
      if (cred.isExpired) {
        expired++;
      } else if (cred.expiresAt && cred.expiresAt - Date.now() < 7 * 24 * 60 * 60 * 1000) {
        expiringSoon++;
      }
      
      // Check rotation needed
      if (cred.lastRotatedAt && cred.lastRotatedAt < rotationThreshold) {
        needsRotation++;
      }
    });
    
    return {
      totalCredentials: credentials.length,
      byType,
      expiringSoon,
      expired,
      needsRotation
    };
  }
}

// Export singleton instance
export const apiCredentialsManager = APICredentialsManager.getInstance();
