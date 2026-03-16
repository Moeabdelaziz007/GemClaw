/**
 * 🛠️ Full-Stack Development Skills
 * 
 * Comprehensive development capabilities for building modern applications.
 * Covers frontend, backend, database, DevOps, mobile, and cloud technologies.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Frontend Development Expert
 */
export const FRONTEND_DEV_SKILL: SkillDefinition = {
  id: 'frontend_development',
  name: 'Frontend Developer',
  description: 'Build modern, responsive web interfaces with React, Vue, and vanilla technologies',
  category: 'integration',
  capabilities: [
    'react_development',
    'vue_development',
    'typescript_programming',
    'responsive_design',
    'state_management',
    'component_architecture',
    'performance_optimization',
    'accessibility_implementation',
    'progressive_web_apps'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Package Registry', 'Build Tools']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'LayoutTemplate',
    color: 'text-blue-500',
    difficulty: 'advanced',
    estimatedSetupTime: '20 minutes',
    tags: ['frontend', 'react', 'vue', 'web', 'ui', 'javascript', 'responsive'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/frontend-development'
  }
};

/**
 * Backend Development Expert
 */
export const BACKEND_DEV_SKILL: SkillDefinition = {
  id: 'backend_development',
  name: 'Backend Developer',
  description: 'Design and implement server-side logic, APIs, and microservices',
  category: 'integration',
  capabilities: [
    'api_design',
    'microservices_architecture',
    'database_integration',
    'authentication_authorization',
    'caching_strategies',
    'message_queues',
    'serverless_functions',
    'graphql_implementation',
    'rest_api_development'
  ],
  permissions: ['read', 'write', 'execute', 'network'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Cloud Platform', 'Database Services']
  },
  dependencies: ['code_assistant'],
  conflicts: [],
  metadata: {
    icon: 'Server',
    color: 'text-green-600',
    difficulty: 'advanced',
    estimatedSetupTime: '25 minutes',
    tags: ['backend', 'api', 'nodejs', 'python', 'cloud', 'microservices', 'serverless'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/backend-development'
  }
};

/**
 * Database Architecture & Management
 */
export const DATABASE_ARCHITECT_SKILL: SkillDefinition = {
  id: 'database_architect',
  name: 'Database Architect',
  description: 'Design, optimize, and manage relational and NoSQL databases',
  category: 'data',
  capabilities: [
    'schema_design',
    'query_optimization',
    'indexing_strategies',
    'database_migration',
    'backup_recovery',
    'performance_tuning',
    'nosql_modeling',
    'data_modeling',
    'replication_setup'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['Database Engines']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Database',
    color: 'text-orange-500',
    difficulty: 'advanced',
    estimatedSetupTime: '20 minutes',
    tags: ['database', 'sql', 'nosql', 'mongodb', 'postgresql', 'data', 'optimization'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/database-architect'
  }
};

/**
 * DevOps & CI/CD Pipeline
 */
export const DEVOPS_SKILL: SkillDefinition = {
  id: 'devops_cicd',
  name: 'DevOps Engineer',
  description: 'Automate deployment, continuous integration, and infrastructure management',
  category: 'utility',
  capabilities: [
    'ci_cd_pipeline',
    'infrastructure_as_code',
    'containerization',
    'orchestration',
    'monitoring_logging',
    'deployment_automation',
    'security_hardening',
    'git_workflows',
    'cloud_deployment'
  ],
  permissions: ['read', 'write', 'execute', 'network'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['CI/CD Platform', 'Container Registry', 'Cloud Provider']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'GitBranch',
    color: 'text-red-500',
    difficulty: 'advanced',
    estimatedSetupTime: '30 minutes',
    tags: ['devops', 'docker', 'kubernetes', 'ci-cd', 'automation', 'cloud', 'infrastructure'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/devops-cicd'
  }
};

/**
 * Mobile App Developer
 */
export const MOBILE_DEV_SKILL: SkillDefinition = {
  id: 'mobile_development',
  name: 'Mobile App Developer',
  description: 'Build native and cross-platform mobile applications for iOS and Android',
  category: 'integration',
  capabilities: [
    'react_native',
    'flutter_development',
    'ios_development',
    'android_development',
    'mobile_ui_ux',
    'app_store_deployment',
    'push_notifications',
    'offline_first_design'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Mobile SDK', 'App Store Connect']
  },
  dependencies: ['frontend_development'],
  conflicts: [],
  metadata: {
    icon: 'Smartphone',
    color: 'text-purple-500',
    difficulty: 'advanced',
    estimatedSetupTime: '25 minutes',
    tags: ['mobile', 'ios', 'android', 'react-native', 'flutter', 'app'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/mobile-development'
  }
};

/**
 * API Designer & Integration Specialist
 */
export const API_DESIGNER_SKILL: SkillDefinition = {
  id: 'api_designer',
  name: 'API Designer',
  description: 'Design elegant, scalable APIs and integrate third-party services',
  category: 'integration',
  capabilities: [
    'rest_design',
    'graphql_schema',
    'api_documentation',
    'rate_limiting',
    'versioning_strategies',
    'third_party_integration',
    'webhook_implementation',
    'oauth_integration'
  ],
  permissions: ['read', 'write', 'network'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['API Gateway']
  },
  dependencies: ['backend_development'],
  conflicts: [],
  metadata: {
    icon: 'Network',
    color: 'text-teal-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '18 minutes',
    tags: ['api', 'rest', 'graphql', 'integration', 'webhooks', 'oauth'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/api-designer'
  }
};

/**
 * Cloud Infrastructure Specialist
 */
export const CLOUD_INFRASTRUCTURE_SKILL: SkillDefinition = {
  id: 'cloud_infrastructure',
  name: 'Cloud Infrastructure Specialist',
  description: 'Architect and manage cloud infrastructure on AWS, Azure, or GCP',
  category: 'utility',
  capabilities: [
    'cloud_architecture',
    'cost_optimization',
    'multi_cloud_strategy',
    'disaster_recovery',
    'high_availability',
    'auto_scaling',
    'load_balancing',
    'cdn_configuration'
  ],
  permissions: ['read', 'write', 'execute', 'network'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Cloud Provider (AWS/Azure/GCP)']
  },
  dependencies: ['devops_cicd'],
  conflicts: [],
  metadata: {
    icon: 'Cloud',
    color: 'text-sky-500',
    difficulty: 'advanced',
    estimatedSetupTime: '30 minutes',
    tags: ['cloud', 'aws', 'azure', 'gcp', 'infrastructure', 'scalability'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/cloud-infrastructure'
  }
};

// Export all development skills as an array
export const DEVELOPMENT_SKILLS: SkillDefinition[] = [
  FRONTEND_DEV_SKILL,
  BACKEND_DEV_SKILL,
  DATABASE_ARCHITECT_SKILL,
  DEVOPS_SKILL,
  MOBILE_DEV_SKILL,
  API_DESIGNER_SKILL,
  CLOUD_INFRASTRUCTURE_SKILL
];
