/**
 * 🎨 Advanced Content Creation Skills
 * 
 * Professional multimedia content creation capabilities including video,
 * audio, graphic design, and strategic copywriting.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Video Production & Editing
 */
export const VIDEO_PRODUCTION_SKILL: SkillDefinition = {
  id: 'video_production',
  name: 'Video Producer',
  description: 'Create, edit, and produce professional video content',
  category: 'creative',
  capabilities: [
    'video_editing',
    'motion_graphics',
    'color_grading',
    'audio_sync',
    'transitions_effects',
    'script_to_video',
    'youtube_optimization',
    'subtitling'
  ],
  permissions: ['read', 'write', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 1024, // Video processing is memory-intensive
    externalServices: ['Video Processing API', 'Stock Footage Library']
  },
  dependencies: ['content_creation'],
  conflicts: [],
  metadata: {
    icon: 'Video',
    color: 'text-red-500',
    difficulty: 'advanced',
    estimatedSetupTime: '25 minutes',
    tags: ['video', 'editing', 'production', 'multimedia', 'youtube', 'motion-graphics'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/video-production'
  }
};

/**
 * Podcast & Audio Production
 */
export const PODCAST_PRODUCTION_SKILL: SkillDefinition = {
  id: 'podcast_production',
  name: 'Podcast Producer',
  description: 'Record, edit, and produce professional podcast episodes',
  category: 'creative',
  capabilities: [
    'audio_recording',
    'audio_editing',
    'noise_reduction',
    'mixing_mastering',
    'intro_outro_creation',
    'distribution_setup',
    'rss_management',
    'sound_design'
  ],
  permissions: ['read', 'write', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Audio Processing API', 'Hosting Platform']
  },
  dependencies: ['voice_synthesis'],
  conflicts: [],
  metadata: {
    icon: 'Mic',
    color: 'text-purple-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '18 minutes',
    tags: ['podcast', 'audio', 'recording', 'broadcasting', 'media', 'radio'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/podcast-production'
  }
};

/**
 * Graphic Design & Illustration
 */
export const GRAPHIC_DESIGN_SKILL: SkillDefinition = {
  id: 'graphic_design',
  name: 'Graphic Designer',
  description: 'Create stunning visuals, logos, branding, and illustrations',
  category: 'creative',
  capabilities: [
    'logo_design',
    'brand_identity',
    'vector_illustration',
    'typography',
    'layout_design',
    'infographic_creation',
    'social_media_graphics',
    'print_design'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Image Generation API', 'Vector Tools']
  },
  dependencies: ['content_creation'],
  conflicts: [],
  metadata: {
    icon: 'Palette',
    color: 'text-pink-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '15 minutes',
    tags: ['design', 'graphics', 'illustration', 'branding', 'visual', 'logo'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/graphic-design'
  }
};

/**
 * Copywriting & Content Strategy
 */
export const COPYWRITING_SKILL: SkillDefinition = {
  id: 'copywriting_strategy',
  name: 'Copywriter & Strategist',
  description: 'Craft compelling copy and develop content strategies',
  category: 'creative',
  capabilities: [
    'persuasive_writing',
    'seo_copywriting',
    'email_campaigns',
    'landing_pages',
    'ad_copy',
    'brand_voice',
    'content_calendar',
    'conversion_optimization'
  ],
  permissions: ['read', 'write'],
  requirements: {
    minMemoryMB: 192
  },
  dependencies: ['content_creation'],
  conflicts: [],
  metadata: {
    icon: 'Feather',
    color: 'text-teal-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '12 minutes',
    tags: ['copywriting', 'marketing', 'strategy', 'seo', 'content', 'advertising'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/copywriting-strategy'
  }
};

/**
 * 3D Modeling & Animation
 */
export const THREE_D_ANIMATION_SKILL: SkillDefinition = {
  id: 'three_d_animation',
  name: '3D Artist',
  description: 'Create 3D models, animations, and rendered visuals',
  category: 'creative',
  capabilities: [
    '3d_modeling',
    'texturing',
    'rigging',
    'animation',
    'rendering',
    'lighting',
    'product_visualization',
    'architectural_rendering'
  ],
  permissions: ['read', 'write', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 2048, // 3D rendering requires significant memory
    externalServices: ['3D Rendering Engine']
  },
  dependencies: ['content_creation'],
  conflicts: [],
  metadata: {
    icon: 'Box',
    color: 'text-indigo-500',
    difficulty: 'advanced',
    estimatedSetupTime: '35 minutes',
    tags: ['3d', 'modeling', 'animation', 'rendering', 'blender', 'visualization'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/3d-animation'
  }
};

/**
 * Music Composition & Production
 */
export const MUSIC_COMPOSITION_SKILL: SkillDefinition = {
  id: 'music_composition',
  name: 'Music Composer',
  description: 'Compose original music and produce audio tracks',
  category: 'creative',
  capabilities: [
    'music_theory',
    'melody_creation',
    'harmony_arrangement',
    'midi_programming',
    'audio_production',
    'mixing',
    'mastering',
    'genre_adaptation'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['DAW', 'Sound Libraries']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Music',
    color: 'text-rose-500',
    difficulty: 'advanced',
    estimatedSetupTime: '25 minutes',
    tags: ['music', 'composition', 'production', 'audio', 'midi', 'mixing'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://gemigram.ai/docs/skills/music-composition'
  }
};

// Export all advanced content creation skills as an array
export const ADVANCED_CONTENT_SKILLS: SkillDefinition[] = [
  VIDEO_PRODUCTION_SKILL,
  PODCAST_PRODUCTION_SKILL,
  GRAPHIC_DESIGN_SKILL,
  COPYWRITING_SKILL,
  THREE_D_ANIMATION_SKILL,
  MUSIC_COMPOSITION_SKILL
];
