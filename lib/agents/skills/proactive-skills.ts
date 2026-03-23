/**
 * ⚡ Proactive & Autonomous Operation Skills
 * 
 * Advanced capabilities enabling agents to initiate actions without explicit prompts.
 * Includes context-aware automation, intelligent monitoring, and predictive engagement.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Proactive Task Initiation
 */
export const PROACTIVE_TASKS_SKILL: SkillDefinition = {
  id: 'proactive_tasks',
  name: 'Proactive Task Manager',
  description: 'Initiate actions and tasks without explicit user prompts based on context',
  category: 'productivity',
  capabilities: [
    'context_awareness',
    'anticipatory_actions',
    'automatic_scheduling',
    'reminder_generation',
    'task_prioritization',
    'deadline_monitoring',
    'opportunity_detection',
    'autonomous_execution'
  ],
  permissions: ['read', 'write', 'execute', 'network', 'autonomous_action'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['Task Queue', 'Scheduler']
  },
  dependencies: ['task_management', 'calendar'],
  conflicts: [],
  metadata: {
    icon: 'Zap',
    color: 'text-yellow-400',
    difficulty: 'advanced',
    estimatedSetupTime: '18 minutes',
    tags: ['proactive', 'autonomous', 'initiative', 'automation', 'self-directed'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/proactive-tasks'
  }
};

/**
 * Intelligent Monitoring & Alerts
 */
export const INTELLIGENT_MONITORING_SKILL: SkillDefinition = {
  id: 'intelligent_monitoring',
  name: 'Intelligent Monitor',
  description: 'Continuously monitor systems and alert on important changes or anomalies',
  category: 'data',
  capabilities: [
    'system_monitoring',
    'anomaly_detection',
    'threshold_alerts',
    'trend_monitoring',
    'status_reporting',
    'escalation_management',
    'health_checking',
    'performance_tracking'
  ],
  permissions: ['read', 'network'],
  requirements: {
    apiKeys: ['MONITORING_SERVICE_KEY'],
    oauthScopes: [],
    externalServices: ['Monitoring Platform']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Activity',
    color: 'text-cyan-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '12 minutes',
    tags: ['monitoring', 'alerts', 'surveillance', 'detection', 'observability'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/intelligent-monitoring'
  }
};

/**
 * Event-Driven Actions
 */
export const EVENT_DRIVEN_ACTIONS_SKILL: SkillDefinition = {
  id: 'event_driven_actions',
  name: 'Event-Driven Automator',
  description: 'Automatically trigger actions based on predefined events and conditions',
  category: 'utility',
  capabilities: [
    'event_detection',
    'condition_evaluation',
    'action_triggering',
    'workflow_automation',
    'rule_engine',
    'event_filtering',
    'cascade_actions'
  ],
  permissions: ['read', 'execute', 'network'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['Event Bus']
  },
  dependencies: ['proactive_tasks'],
  conflicts: [],
  metadata: {
    icon: 'Radio',
    color: 'text-orange-500',
    difficulty: 'advanced',
    estimatedSetupTime: '15 minutes',
    tags: ['events', 'automation', 'triggers', 'workflows', 'reactive'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/event-driven-actions'
  }
};

/**
 * Predictive Engagement
 */
export const PREDICTIVE_ENGAGEMENT_SKILL: SkillDefinition = {
  id: 'predictive_engagement',
  name: 'Predictive Engager',
  description: 'Anticipate user needs and engage proactively with helpful suggestions',
  category: 'communication',
  capabilities: [
    'behavior_prediction',
    'need_anticipation',
    'suggestion_generation',
    'timing_optimization',
    'personalization',
    'engagement_scoring',
    'intervention_strategies'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 384,
    externalServices: ['ML Prediction Engine']
  },
  dependencies: ['self_analysis', 'proactive_tasks'],
  conflicts: [],
  metadata: {
    icon: 'Sparkles',
    color: 'text-pink-400',
    difficulty: 'advanced',
    estimatedSetupTime: '20 minutes',
    tags: ['predictive', 'engagement', 'anticipation', 'personalization', 'ai-assistance'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/predictive-engagement'
  }
};

// Export all proactive skills as an array
export const PROACTIVE_SKILLS: SkillDefinition[] = [
  PROACTIVE_TASKS_SKILL,
  INTELLIGENT_MONITORING_SKILL,
  EVENT_DRIVEN_ACTIONS_SKILL,
  PREDICTIVE_ENGAGEMENT_SKILL
];
