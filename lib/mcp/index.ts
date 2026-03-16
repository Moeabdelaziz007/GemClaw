/**
 * 🔗 MCP Module Exports
 * 
 * Central export point for all MCP-related functionality
 */

// Type exports
export type {
  MCPProvider,
  MCPServer,
  MCPResource,
  MCPTool,
  MCPPrompt,
  MCPConnectionProfile
} from '../agents/skill-types';

// MCP Client
export { mcpClient } from './mcp-client';
export type { MCPClient } from './mcp-client';

// MCP Config Manager
export { mcpConfigManager } from './mcp-config';
export type { MCPConfigManager } from './mcp-config';
