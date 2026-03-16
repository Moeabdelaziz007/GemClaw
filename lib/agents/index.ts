/**
 * 🎯 Skills Index - Central Export
 * 
 * Re-exports all skill definitions, components, and utilities
 * for easy importing throughout the application.
 */

// Type exports
export {
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

// Documentation exports
export {
  SkillDocumentation,
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
