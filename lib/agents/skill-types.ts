/**
 * 🛠️ Comprehensive Skill Type System
 * 
 * Core type definitions for the Gemigram AetherOS skill architecture.
 * Provides strong typing for skill definitions, configurations, and runtime instances.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Skill categories for organization and filtering
 */
export type SkillCategory = 
  | 'productivity'
  | 'communication' 
  | 'analysis'
  | 'creative'
  | 'social'
  | 'data'
  | 'integration'
  | 'utility'
  | 'development'        // NEW: Development skills
  | 'engineering'        // NEW: Software engineering skills
  | 'meta_cognition'     // NEW: Self-improvement skills
  | 'mcp_integration';   // NEW: MCP & external integrations

/**
 * Permission types for security and access control
 */
export type Permission = 
  | 'read'
  | 'write'
  | 'execute'
  | 'network'
  | 'storage'
  | 'api_access'
  | 'autonomous_action'   // NEW: For proactive skills requiring user confirmation
  | 'system_modification' // NEW: For self-improvement capabilities
  | 'mcp_access';         // NEW: For MCP protocol-level access

/**
 * Difficulty levels for skill complexity rating
 */
export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Requirements for skill execution
 */
export interface SkillRequirements {
  /** API keys required for external services */
  apiKeys?: string[];
  /** OAuth scopes for authenticated APIs */
  oauthScopes?: string[];
  /** Environment variables needed */
  environmentVars?: string[];
  /** Minimum memory requirement in MB */
  minMemoryMB?: number;
  /** External services or APIs required */
  externalServices?: string[];
}

/**
 * Metadata for UI/UX display and skill information
 */
export interface SkillMetadata {
  /** Lucide icon name for visual representation */
  icon: string;
  /** Tailwind CSS color class */
  color: string;
  /** Skill difficulty level */
  difficulty: SkillDifficulty;
  /** Estimated time to configure the skill */
  estimatedSetupTime?: string;
  /** Tags for searchability and categorization */
  tags: string[];
  /** Semantic version of the skill */
  version: string;
  /** Skill author/creator */
  author?: string;
  /** URL to skill documentation */
  documentationUrl?: string;
}

/**
 * Comprehensive skill definition
 */
export interface SkillDefinition {
  /** Unique identifier for the skill */
  id: string;
  /** Human-readable skill name */
  name: string;
  /** Detailed description of skill capabilities */
  description: string;
  /** Category for organization */
  category: SkillCategory;
  /** Specific capabilities this skill provides */
  capabilities: string[];
  /** Permissions required by this skill */
  permissions: Permission[];
  /** Other skills this skill depends on */
  dependencies?: string[];
  /** Skills that conflict with this skill */
  conflicts?: string[];
  /** Requirements for skill execution */
  requirements: SkillRequirements;
  /** Metadata for display and management */
  metadata: SkillMetadata;
}

/**
 * Runtime skill instance configuration
 */
export interface SkillInstance {
  /** Whether the skill is currently enabled */
  enabled: boolean;
  /** Whether the skill has been properly configured */
  configured: boolean;
  /** Custom settings for this skill instance */
  settings?: Record<string, any>;
  /** Last time the skill was used */
  lastUsed?: Timestamp;
  /** Number of times the skill has been used */
  usageCount?: number;
  /** Configuration timestamp */
  configuredAt?: number;
}

/**
 * Skill configuration state - maps skill IDs to their state
 */
export interface SkillConfig {
  [skillId: string]: boolean | SkillInstance;
}

/**
 * Validation result for skill configurations
 */
export interface ValidationResult {
  /** Whether the configuration is valid */
  valid: boolean;
  /** List of validation errors */
  errors: string[];
  /** List of validation warnings */
  warnings?: string[];
}

/**
 * Skill bundle for pre-configured skill combinations
 */
export interface SkillBundle {
  /** Bundle identifier */
  id: string;
  /** Human-readable bundle name */
  name: string;
  /** Description of the bundle's purpose */
  description: string;
  /** Skills included in this bundle */
  skills: string[];
  /** Target use case or persona */
  targetPersona?: string;
}

/**
 * Event types for skill lifecycle hooks
 */
export type SkillEventType = 
  | 'enabled'
  | 'disabled'
  | 'configured'
  | 'executed'
  | 'error'
  | 'rate_limit';

/**
 * Skill event for monitoring and analytics
 */
export interface SkillEvent {
  /** Skill that triggered the event */
  skillId: string;
  /** Type of event */
  eventType: SkillEventType;
  /** Timestamp of the event */
  timestamp: number;
  /** Additional event data */
  data?: any;
}

/**
 * Callback type for skill event listeners
 */
export type SkillEventListener = (event: SkillEvent) => void;
