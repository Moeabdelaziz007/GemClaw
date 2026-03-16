/**
 * 💡 Brainstorming & Creative Thinking Skills
 * 
 * Advanced capabilities for generating innovative ideas, creative problem-solving,
 * and out-of-the-box thinking through structured ideation techniques.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Creative Brainstorming Engine
 */
export const BRAINSTORMING_SKILL: SkillDefinition = {
  id: 'creative_brainstorming',
  name: 'Creative Brainstormer',
  description: 'Generate diverse ideas, solutions, and possibilities through structured ideation',
  category: 'creative',
  capabilities: [
    'divergent_thinking',
    'idea_generation',
    'concept_combination',
    'analogy_mapping',
    'mind_mapping',
    'scamper_technique',
    'six_thinking_hats',
    'reverse_thinking',
    'random_word_stimulation'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 256,
    externalServices: []
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Lightbulb',
    color: 'text-amber-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['brainstorming', 'creativity', 'ideation', 'innovation', 'ideas', 'divergent-thinking'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/creative-brainstorming'
  }
};

/**
 * Lateral Thinking & Pattern Breaking
 */
export const LATERAL_THINKING_SKILL: SkillDefinition = {
  id: 'lateral_thinking',
  name: 'Lateral Thinker',
  description: 'Solve problems through unconventional, out-of-the-box approaches',
  category: 'creative',
  capabilities: [
    'assumption_challenging',
    'perspective_shifting',
    'random_stimulation',
    'provocation_techniques',
    'concept_formation',
    'movement_thinking',
    'pattern_disruption',
    'reframing'
  ],
  permissions: ['read', 'execute'],
  requirements: {
    minMemoryMB: 192
  },
  dependencies: ['creative_brainstorming'],
  conflicts: [],
  metadata: {
    icon: 'Sparkles',
    color: 'text-pink-400',
    difficulty: 'advanced',
    estimatedSetupTime: '15 minutes',
    tags: ['lateral-thinking', 'unconventional', 'creativity', 'problem-solving', 'patterns'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/lateral-thinking'
  }
};

/**
 * Design Thinking Framework
 */
export const DESIGN_THINKING_SKILL: SkillDefinition = {
  id: 'design_thinking',
  name: 'Design Thinking',
  description: 'Human-centered problem-solving approach with empathy and iteration',
  category: 'creative',
  capabilities: [
    'empathy_mapping',
    'problem_framing',
    'ideation_facilitation',
    'prototyping',
    'user_testing',
    'iteration_cycles',
    'journey_mapping',
    'stakeholder_analysis'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 256
  },
  dependencies: ['creative_brainstorming'],
  conflicts: [],
  metadata: {
    icon: 'PenTool',
    color: 'text-indigo-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '12 minutes',
    tags: ['design', 'ux', 'human-centered', 'innovation', 'prototyping', 'empathy'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/design-thinking'
  }
};

/**
 * TRIZ Innovation Method
 */
export const TRIZ_INNOVATION_SKILL: SkillDefinition = {
  id: 'triz_innovation',
  name: 'TRIZ Innovator',
  description: 'Systematic innovation using Theory of Inventive Problem Solving',
  category: 'creative',
  capabilities: [
    'contradiction_analysis',
    'inventive_principles',
    'ideal_final_result',
    'resource_analysis',
    'evolution_patterns',
    'substance_field_analysis',
    'function_modeling'
  ],
  permissions: ['read', 'execute'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['TRIZ Database']
  },
  dependencies: ['creative_brainstorming'],
  conflicts: [],
  metadata: {
    icon: 'Wrench',
    color: 'text-slate-400',
    difficulty: 'advanced',
    estimatedSetupTime: '20 minutes',
    tags: ['triz', 'innovation', 'systematic', 'invention', 'engineering', 'methodology'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/triz-innovation'
  }
};

/**
 * Scenario Planning & Futures Thinking
 */
export const SCENARIO_PLANNING_SKILL: SkillDefinition = {
  id: 'scenario_planning',
  name: 'Scenario Planner',
  description: 'Explore multiple future scenarios and strategic possibilities',
  category: 'analysis',
  capabilities: [
    'scenario_generation',
    'trend_analysis',
    'uncertainty_mapping',
    'impact_assessment',
    'strategic_planning',
    'backcasting',
    'foresight_methods'
  ],
  permissions: ['read', 'write', 'execute'],
  requirements: {
    minMemoryMB: 384
  },
  dependencies: ['creative_brainstorming'],
  conflicts: [],
  metadata: {
    icon: 'Telescope',
    color: 'text-blue-600',
    difficulty: 'advanced',
    estimatedSetupTime: '18 minutes',
    tags: ['scenario', 'futures', 'planning', 'strategy', 'foresight', 'trends'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/scenario-planning'
  }
};

// Export all brainstorming and creativity skills as an array
export const BRAINSTORMING_SKILLS: SkillDefinition[] = [
  BRAINSTORMING_SKILL,
  LATERAL_THINKING_SKILL,
  DESIGN_THINKING_SKILL,
  TRIZ_INNOVATION_SKILL,
  SCENARIO_PLANNING_SKILL
];
