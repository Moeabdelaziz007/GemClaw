/**
 * 🎯 Skills Index - Central Export
 * 
 * Re-exports all skill definitions, components, and utilities
 * for easy importing throughout the application.
 */

// Type exports
export type {
  SkillDefinition,
  SkillCategory,
  Permission,
  SkillDifficulty,
  SkillRequirements,
  SkillMetadata,
  SkillConfig,
  SkillInstance,
  ValidationResult,
  SkillBundle,
  SkillEventType,
  SkillEvent,
  SkillEventListener
} from './skill-types';

// Registry exports
export { skillRegistry, autoRegisterSkills } from './skill-registry';

// Skill libraries
export { GOOGLE_WORKSPACE_SKILLS } from './skills/google-workspace-skills';
export {
  GMAIL_SKILL,
  CALENDAR_SKILL,
  DRIVE_SKILL,
  DOCS_SKILL,
  SHEETS_SKILL,
  SLIDES_SKILL,
  MAPS_SKILL,
  PHOTOS_SKILL
} from './skills/google-workspace-skills';

export { ANALYSIS_DATA_SKILLS } from './skills/analysis-skills';
export {
  DATA_ANALYSIS_SKILL,
  WEB_SEARCH_SKILL,
  NEWS_AGGREGATION_SKILL,
  WEATHER_SKILL,
  CRYPTO_TRACKING_SKILL,
  CALCULATOR_SKILL,
  SEMANTIC_MEMORY_SKILL
} from './skills/analysis-skills';

export { CREATIVE_UTILITY_SKILLS } from './skills/creative-skills';
export {
  CONTENT_CREATION_SKILL,
  TRANSLATION_SKILL,
  VOICE_SYNTHESIS_SKILL,
  SOCIAL_MEDIA_SKILL,
  TASK_MANAGEMENT_SKILL,
  NOTE_TAKING_SKILL,
  CODE_ASSISTANT_SKILL,
  FILE_CONVERTER_SKILL
} from './skills/creative-skills';

// Self-improvement skills (NEW)
export { SELF_IMPROVEMENT_SKILLS } from './skills/self-improvement-skills';
export {
  SELF_ANALYSIS_SKILL,
  CONTINUOUS_LEARNING_SKILL,
  PERFORMANCE_OPTIMIZER_SKILL,
  ERROR_RECOVERY_SKILL,
  QUALITY_ASSURANCE_SKILL
} from './skills/self-improvement-skills';

// Proactive agent skills (NEW)
export { PROACTIVE_SKILLS } from './skills/proactive-skills';
export {
  PROACTIVE_TASKS_SKILL,
  INTELLIGENT_MONITORING_SKILL,
  EVENT_DRIVEN_ACTIONS_SKILL,
  PREDICTIVE_ENGAGEMENT_SKILL
} from './skills/proactive-skills';

// Brainstorming & creativity skills (NEW)
export { BRAINSTORMING_SKILLS } from './skills/brainstorming-skills';
export {
  BRAINSTORMING_SKILL,
  LATERAL_THINKING_SKILL,
  DESIGN_THINKING_SKILL,
  TRIZ_INNOVATION_SKILL,
  SCENARIO_PLANNING_SKILL
} from './skills/brainstorming-skills';

// Full-stack development skills (NEW)
export { DEVELOPMENT_SKILLS } from './skills/development-skills';
export {
  FRONTEND_DEV_SKILL,
  BACKEND_DEV_SKILL,
  DATABASE_ARCHITECT_SKILL,
  DEVOPS_SKILL,
  MOBILE_DEV_SKILL,
  API_DESIGNER_SKILL,
  CLOUD_INFRASTRUCTURE_SKILL
} from './skills/development-skills';

// Software engineering skills (NEW)
export { SOFTWARE_ENGINEERING_SKILLS } from './skills/software-engineering-skills';
export {
  SYSTEM_ARCHITECT_SKILL,
  CODE_QUALITY_SKILL,
  SECURITY_ENGINEERING_SKILL,
  TECHNICAL_WRITING_SKILL,
  AGILE_PM_SKILL
} from './skills/software-engineering-skills';

// Polyglot coding skills (NEW)
export { POLYGLOT_CODING_SKILLS } from './skills/polyglot-coding-skills';
export {
  PYTHON_EXPERT_SKILL,
  JAVASCRIPT_TYPESCRIPT_SKILL,
  RUST_PROGRAMMING_SKILL,
  GO_PROGRAMMING_SKILL,
  JAVA_ENTERPRISE_SKILL,
  CPP_PROGRAMMING_SKILL
} from './skills/polyglot-coding-skills';

// Advanced content creation skills (NEW)
export { ADVANCED_CONTENT_SKILLS } from './skills/content-creation-advanced-skills';
export {
  VIDEO_PRODUCTION_SKILL,
  PODCAST_PRODUCTION_SKILL,
  GRAPHIC_DESIGN_SKILL,
  COPYWRITING_SKILL,
  THREE_D_ANIMATION_SKILL,
  MUSIC_COMPOSITION_SKILL
} from './skills/content-creation-advanced-skills';

// Documentation exports
export type {
  SkillDocumentation,
} from './skill-documentation';
export {
  generateSkillDocumentation,
  generateAllSkillsDocumentation,
  exportDocumentationAsMarkdown
} from './skill-documentation';

// Legacy compatibility - re-export from old location
export {
  getRecommendedSkills,
  detectSkillsFromDescription,
  detectSkillsFromRole,
  generateSkillsConfirmation,
  validateSkillsConfig,
  getAllSkills,
  getSkillsByCategory
} from './skills-assignment';
