/**
 * 📊 Analysis & Data Skills
 * 
 * Comprehensive skill definitions for data analysis, web search, and information processing.
 * Includes advanced analytics, research capabilities, and data visualization.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Data Analysis Engine Skill
 */
export const DATA_ANALYSIS_SKILL: SkillDefinition = {
  id: 'data_analysis',
  name: 'Data Analysis Engine',
  description: 'Perform statistical analysis, data visualization, and predictive modeling',
  category: 'analysis',
  capabilities: [
    'statistical_analysis',
    'data_visualization',
    'trend_detection',
    'pattern_recognition',
    'predictive_modeling',
    'correlation_analysis',
    'regression_analysis',
    'hypothesis_testing'
  ],
  permissions: ['read', 'execute', 'storage'],
  requirements: {
    minMemoryMB: 512,
    externalServices: ['Python Runtime', 'Statistical Libraries']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'BarChart3',
    color: 'text-purple-500',
    difficulty: 'advanced',
    estimatedSetupTime: '15 minutes',
    tags: ['analytics', 'data', 'statistics', 'visualization', 'machine-learning', 'insights'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/data-analysis'
  }
};

/**
 * Intelligent Web Search Skill
 */
export const WEB_SEARCH_SKILL: SkillDefinition = {
  id: 'web_search',
  name: 'Intelligent Web Search',
  description: 'Search and aggregate information from across the web with semantic understanding',
  category: 'data',
  capabilities: [
    'keyword_search',
    'semantic_search',
    'news_aggregation',
    'academic_research',
    'fact_verification',
    'source_credibility',
    'multi_language_search',
    'image_search'
  ],
  permissions: ['read', 'network'],
  requirements: {
    apiKeys: ['SERPAPI_KEY'],
    oauthScopes: [],
    externalServices: ['Search API', 'News API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Search',
    color: 'text-cyan-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['search', 'research', 'information', 'web', 'google', 'discovery'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://serpapi.com/'
  }
};

/**
 * News Aggregation Skill
 */
export const NEWS_AGGREGATION_SKILL: SkillDefinition = {
  id: 'news_aggregation',
  name: 'News Aggregator',
  description: 'Real-time news collection from multiple sources with topic categorization',
  category: 'data',
  capabilities: [
    'breaking_news',
    'topic_tracking',
    'source_filtering',
    'sentiment_analysis',
    'trend_monitoring',
    'custom_feeds',
    'alert_notifications'
  ],
  permissions: ['read', 'network'],
  requirements: {
    apiKeys: ['NEWS_API_KEY'],
    oauthScopes: [],
    externalServices: ['News API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Newspaper',
    color: 'text-indigo-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['news', 'media', 'current-events', 'journalism', 'updates', 'headlines'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://newsapi.org/'
  }
};

/**
 * Weather Information Skill
 */
export const WEATHER_SKILL: SkillDefinition = {
  id: 'weather',
  name: 'Weather Intelligence',
  description: 'Real-time weather data, forecasts, and severe weather alerts',
  category: 'data',
  capabilities: [
    'current_weather',
    'weather_forecast',
    'severe_alerts',
    'historical_weather',
    'air_quality',
    'uv_index',
    'precipitation_tracking',
    'climate_data'
  ],
  permissions: ['read', 'network'],
  requirements: {
    apiKeys: ['OPENWEATHER_API_KEY'],
    oauthScopes: [],
    externalServices: ['OpenWeatherMap API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Cloud',
    color: 'text-blue-400',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['weather', 'forecast', 'climate', 'temperature', 'meteorology', 'alerts'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://openweathermap.org/api'
  }
};

/**
 * Cryptocurrency Tracking Skill
 */
export const CRYPTO_TRACKING_SKILL: SkillDefinition = {
  id: 'crypto_tracking',
  name: 'Crypto Tracker',
  description: 'Real-time cryptocurrency prices, market analysis, and portfolio tracking',
  category: 'data',
  capabilities: [
    'price_tracking',
    'market_analysis',
    'portfolio_management',
    'price_alerts',
    'trading_volume',
    'market_cap_data',
    'historical_prices',
    'whale_alerts'
  ],
  permissions: ['read', 'network'],
  requirements: {
    apiKeys: ['COINGECKO_API_KEY'],
    oauthScopes: [],
    externalServices: ['CoinGecko API', 'CoinMarketCap API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'TrendingUp',
    color: 'text-yellow-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '8 minutes',
    tags: ['cryptocurrency', 'bitcoin', 'trading', 'blockchain', 'finance', 'investment'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://www.coingecko.com/en/api'
  }
};

/**
 * Calculator & Math Skill
 */
export const CALCULATOR_SKILL: SkillDefinition = {
  id: 'calculator',
  name: 'Advanced Calculator',
  description: 'Mathematical computations from basic arithmetic to complex calculus',
  category: 'utility',
  capabilities: [
    'basic_arithmetic',
    'scientific_calculations',
    'graphing',
    'unit_conversion',
    'currency_conversion',
    'percentage_calculations',
    'algebra_solver',
    'calculus_operations'
  ],
  permissions: ['read', 'execute'],
  requirements: {
    minMemoryMB: 64,
    externalServices: []
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Calculator',
    color: 'text-gray-400',
    difficulty: 'beginner',
    estimatedSetupTime: '2 minutes',
    tags: ['calculator', 'math', 'computation', 'numbers', 'arithmetic', 'science'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/calculator'
  }
};

/**
 * Semantic Memory Skill
 */
export const SEMANTIC_MEMORY_SKILL: SkillDefinition = {
  id: 'semantic_memory',
  name: 'Semantic Memory',
  description: 'Intelligent memory storage and retrieval with semantic understanding',
  category: 'utility',
  capabilities: [
    'memory_storage',
    'semantic_search',
    'contextual_recall',
    'memory_association',
    'knowledge_graph',
    'spaced_repetition',
    'memory_consolidation'
  ],
  permissions: ['read', 'write', 'storage'],
  requirements: {
    minMemoryMB: 128,
    externalServices: ['Vector Database']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Brain',
    color: 'text-pink-400',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['memory', 'learning', 'knowledge', 'semantic', 'recall', 'intelligence'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/semantic-memory'
  }
};

// Export all analysis and data skills as an array
export const ANALYSIS_DATA_SKILLS: SkillDefinition[] = [
  DATA_ANALYSIS_SKILL,
  WEB_SEARCH_SKILL,
  NEWS_AGGREGATION_SKILL,
  WEATHER_SKILL,
  CRYPTO_TRACKING_SKILL,
  CALCULATOR_SKILL,
  SEMANTIC_MEMORY_SKILL
];
