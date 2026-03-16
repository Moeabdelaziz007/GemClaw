/**
 * 🧠 Self-Improvement & Meta-Cognitive Skills
 * 
 * Advanced capabilities for agent self-analysis, continuous learning, and performance optimization.
 * Enables agents to improve their own capabilities over time through reflection and adaptation.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Self-Analysis & Performance Optimization
 */
export const SELF_ANALYSIS_SKILL: SkillDefinition = {
  id: 'self_analysis',
  name: 'Self-Analysis Engine',
  description: 'Analyze own performance, identify weaknesses, and suggest improvements',
  category: 'analysis',
  capabilities: [
    'performance_monitoring',
    'error_pattern_detection',
    'efficiency_analysis',
    'bottleneck_identification',
    'improvement_recommendations',
    'progress_tracking',
    'metric_visualization'
  ],
  permissions: ['read', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['Analytics Engine']
  },
  dependencies: ['semantic_memory'],
  conflicts: [],
  metadata: {
    icon: 'TrendingUp',
    color: 'text-violet-500',
    difficulty: 'advanced',
    estimatedSetupTime: '15 minutes',
    tags: ['self-improvement', 'analytics', 'optimization', 'meta-cognition', 'performance'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/self-analysis'
  }
};

/**
 * Continuous Learning & Adaptation
 */
export const CONTINUOUS_LEARNING_SKILL: SkillDefinition = {
  id: 'continuous_learning',
  name: 'Continuous Learner',
  description: 'Automatically acquire new knowledge and adapt based on interactions',
  category: 'utility',
  capabilities: [
    'experience_learning',
    'pattern_extraction',
    'knowledge_integration',
    'skill_acquisition',
    'adaptation_strategies',
    'feedback_incorporation',
    'iterative_improvement'
  ],
  permissions: ['read', 'write', 'storage', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Vector Database', 'ML Runtime']
  },
  dependencies: ['semantic_memory', 'self_analysis'],
  conflicts: [],
  metadata: {
    icon: 'Brain',
    color: 'text-purple-400',
    difficulty: 'advanced',
    estimatedSetupTime: '20 minutes',
    tags: ['learning', 'adaptation', 'growth', 'ai-improvement', 'evolution'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/continuous-learning'
  }
};

/**
 * Performance Optimizer
 */
export const PERFORMANCE_OPTIMIZER_SKILL: SkillDefinition = {
  id: 'performance_optimizer',
  name: 'Performance Optimizer',
  description: 'Automatically optimize agent performance and resource utilization',
  category: 'utility',
  capabilities: [
    'resource_optimization',
    'caching_strategies',
    'query_optimization',
    'response_time_improvement',
    'memory_management',
    'load_balancing',
    'bottleneck_resolution'
  ],
  permissions: ['read', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['Performance Monitoring']
  },
  dependencies: ['self_analysis'],
  conflicts: [],
  metadata: {
    icon: 'Zap',
    color: 'text-yellow-500',
    difficulty: 'advanced',
    estimatedSetupTime: '18 minutes',
    tags: ['performance', 'optimization', 'speed', 'efficiency', 'resources'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/performance-optimizer'
  }
};

/**
 * Error Recovery & Resilience
 */
export const ERROR_RECOVERY_SKILL: SkillDefinition = {
  id: 'error_recovery',
  name: 'Error Recovery Specialist',
  description: 'Automatically detect, analyze, and recover from errors gracefully',
  category: 'utility',
  capabilities: [
    'error_detection',
    'root_cause_analysis',
    'automatic_recovery',
    'fallback_strategies',
    'resilience_building',
    'prevention_measures',
    'graceful_degradation'
  ],
  permissions: ['read', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 256,
    externalServices: []
  },
  dependencies: ['self_analysis'],
  conflicts: [],
  metadata: {
    icon: 'RotateCcw',
    color: 'text-green-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '12 minutes',
    tags: ['error-handling', 'recovery', 'resilience', 'debugging', 'stability'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/error-recovery'
  }
};

/**
 * Quality Assurance & Testing
 */
export const QUALITY_ASSURANCE_SKILL: SkillDefinition = {
  id: 'quality_assurance',
  name: 'Quality Assurance',
  description: 'Ensure output quality through automated testing and validation',
  category: 'utility',
  capabilities: [
    'output_validation',
    'quality_metrics',
    'automated_testing',
    'consistency_checking',
    'accuracy_verification',
    'regression_detection',
    'quality_reporting'
  ],
  permissions: ['read', 'execute'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['Testing Framework']
  },
  dependencies: ['self_analysis', 'code_quality'],
  conflicts: [],
  metadata: {
    icon: 'ShieldCheck',
    color: 'text-emerald-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '15 minutes',
    tags: ['quality', 'testing', 'validation', 'assurance', 'verification'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/quality-assurance'
  }
};

// Export all self-improvement skills as an array
export const SELF_IMPROVEMENT_SKILLS: SkillDefinition[] = [
  SELF_ANALYSIS_SKILL,
  CONTINUOUS_LEARNING_SKILL,
  PERFORMANCE_OPTIMIZER_SKILL,
  ERROR_RECOVERY_SKILL,
  QUALITY_ASSURANCE_SKILL
];
