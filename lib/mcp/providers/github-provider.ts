/**
 * 🐙 GitHub MCP Provider
 * 
 * Provides integration with GitHub repositories through MCP protocol.
 * Supports repository access, file operations, pull requests, issues, and GitHub Actions.
 */

import { mcpClient, MCPProvider, MCPServer } from '../../mcp';
import { SkillDefinition } from '../../agents/skill-types';

/**
 * GitHub Provider Configuration
 */
const GITHUB_PROVIDER: MCPProvider = {
  id: 'github',
  name: 'GitHub',
  baseUrl: 'https://api.github.com',
  authType: 'oauth2',
  scopes: ['repo', 'read:user', 'user:email', 'workflow'],
  description: 'Access GitHub repositories, manage pull requests, issues, and automate workflows',
  documentationUrl: 'https://docs.github.com/en/rest',
  enabled: false
};

/**
 * GitHub OAuth Configuration
 */
const GITHUB_OAUTH_CONFIG = {
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
  redirectUri: typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/github/callback`
    : ''
};

/**
 * Initialize GitHub Provider
 */
export function initializeGitHubProvider(): void {
  try {
    mcpClient.registerProvider(GITHUB_PROVIDER);
    console.log('[GitHub MCP] Provider registered successfully');
  } catch (error) {
    console.error('[GitHub MCP] Failed to register provider:', error);
    throw error;
  }
}

/**
 * Get GitHub OAuth authorization URL
 */
export function getGitHubOAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH_CONFIG.clientId,
    redirect_uri: GITHUB_OAUTH_CONFIG.redirectUri,
    scope: GITHUB_PROVIDER.scopes?.join(' ') || '',
    response_type: 'code'
  });
  
  if (state) {
    params.append('state', state);
  }
  
  return `${GITHUB_OAUTH_CONFIG.authorizationUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string, state?: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}> {
  const response = await fetch(GITHUB_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: GITHUB_OAUTH_CONFIG.clientId,
      client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_OAUTH_CONFIG.redirectUri,
      state
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }
  
  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: undefined, // GitHub doesn't provide refresh tokens
    expiresIn: undefined // GitHub tokens don't expire
  };
}

/**
 * Create GitHub MCP Server configuration
 */
export function createGitHubServer(
  serverId: string,
  owner?: string,
  repo?: string
): MCPServer {
  return {
    id: serverId,
    providerId: 'github',
    name: owner && repo ? `${owner}/${repo}` : 'GitHub API',
    endpoint: `${GITHUB_PROVIDER.baseUrl}${owner && repo ? `/repos/${owner}/${repo}` : ''}`,
    version: '2022-11-28',
    capabilities: [
      'repository_access',
      'file_operations',
      'pull_requests',
      'issues',
      'actions',
      'search',
      'webhooks'
    ],
    status: 'inactive'
  };
}

/**
 * GitHub Repository Management Skill
 */
export const GITHUB_REPOSITORY_SKILL: SkillDefinition = {
  id: 'github_repository',
  name: 'GitHub Repository Manager',
  description: 'Manage GitHub repositories, perform file operations, and access repository data',
  category: 'integration',
  capabilities: [
    'repository_info',
    'file_read',
    'file_write',
    'file_delete',
    'directory_listing',
    'commit_history',
    'branch_management',
    'tags_management'
  ],
  permissions: ['read', 'write', 'network', 'mcp_access'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['GitHub API'],
    oauthScopes: ['repo']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Github',
    color: 'text-gray-800',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['github', 'repository', 'git', 'version-control', 'collaboration'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/github-repository'
  }
};

/**
 * GitHub Code Search Skill
 */
export const GITHUB_CODE_SEARCH_SKILL: SkillDefinition = {
  id: 'github_code_search',
  name: 'GitHub Code Search',
  description: 'Search code across GitHub repositories with advanced query capabilities',
  category: 'analysis',
  capabilities: [
    'code_search',
    'text_search',
    'symbol_search',
    'cross_reference',
    'usage_examples',
    'similar_code'
  ],
  permissions: ['read', 'network', 'mcp_access'],
  requirements: {
    minMemoryMB: 192,
    externalServices: ['GitHub API']
  },
  dependencies: ['github_repository'],
  conflicts: [],
  metadata: {
    icon: 'Search',
    color: 'text-blue-600',
    difficulty: 'intermediate',
    estimatedSetupTime: '5 minutes',
    tags: ['github', 'search', 'code-analysis', 'discovery'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/github-code-search'
  }
};

/**
 * GitHub Pull Request Review Skill
 */
export const GITHUB_PR_REVIEW_SKILL: SkillDefinition = {
  id: 'github_pr_review',
  name: 'GitHub PR Reviewer',
  description: 'Create, review, and manage GitHub pull requests with automated insights',
  category: 'productivity',
  capabilities: [
    'pr_creation',
    'pr_review',
    'code_diff_analysis',
    'comment_management',
    'approval_workflow',
    'merge_management',
    'conflict_detection'
  ],
  permissions: ['read', 'write', 'network', 'mcp_access'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['GitHub API'],
    oauthScopes: ['repo']
  },
  dependencies: ['github_repository'],
  conflicts: [],
  metadata: {
    icon: 'GitPullRequest',
    color: 'text-green-600',
    difficulty: 'advanced',
    estimatedSetupTime: '12 minutes',
    tags: ['github', 'pull-request', 'code-review', 'collaboration', 'git'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/github-pr-review'
  }
};

/**
 * GitHub Issue Manager Skill
 */
export const GITHUB_ISSUE_MANAGER_SKILL: SkillDefinition = {
  id: 'github_issue_manager',
  name: 'GitHub Issue Manager',
  description: 'Manage GitHub issues, labels, milestones, and project boards',
  category: 'productivity',
  capabilities: [
    'issue_creation',
    'issue_triage',
    'label_management',
    'milestone_tracking',
    'project_board',
    'issue_templates',
    'automation_rules'
  ],
  permissions: ['read', 'write', 'network', 'mcp_access'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['GitHub API'],
    oauthScopes: ['repo']
  },
  dependencies: ['github_repository'],
  conflicts: [],
  metadata: {
    icon: 'CircleAlert',
    color: 'text-purple-600',
    difficulty: 'intermediate',
    estimatedSetupTime: '8 minutes',
    tags: ['github', 'issues', 'project-management', 'tracking', 'labels'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/github-issue-manager'
  }
};

/**
 * GitHub Actions Automation Skill
 */
export const GITHUB_ACTIONS_SKILL: SkillDefinition = {
  id: 'github_actions',
  name: 'GitHub Actions Automator',
  description: 'Trigger, monitor, and manage GitHub Actions workflows',
  category: 'utility',
  capabilities: [
    'workflow_trigger',
    'run_monitoring',
    'artifact_download',
    'log_access',
    'workflow_dispatch',
    'scheduled_workflows'
  ],
  permissions: ['read', 'write', 'execute', 'network', 'mcp_access'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['GitHub API'],
    oauthScopes: ['repo', 'workflow']
  },
  dependencies: ['github_repository'],
  conflicts: [],
  metadata: {
    icon: 'Zap',
    color: 'text-orange-600',
    difficulty: 'advanced',
    estimatedSetupTime: '15 minutes',
    tags: ['github', 'actions', 'ci-cd', 'automation', 'workflows', 'devops'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/github-actions'
  }
};

// Export all GitHub skills as an array
export const GITHUB_SKILLS: SkillDefinition[] = [
  GITHUB_REPOSITORY_SKILL,
  GITHUB_CODE_SEARCH_SKILL,
  GITHUB_PR_REVIEW_SKILL,
  GITHUB_ISSUE_MANAGER_SKILL,
  GITHUB_ACTIONS_SKILL
];

/**
 * Auto-initialize when module is imported
 */
if (typeof window === 'undefined') {
  // Server-side initialization
  initializeGitHubProvider();
}
