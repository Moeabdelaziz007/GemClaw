export const BRAND = {
  product: {
    name: 'Gemclaw',
    platformName: 'Gemclaw AIOS',
    tagline: 'Sovereign Intelligence Orchestration System',
    systemVersion: 'OS_Sovereign.v3.0',
  },
  subProducts: {
    forge: 'Gemclaw Forge',
    galaxy: 'Gemclaw Galaxy',
    hub: 'Neural Hub',
    workspace: 'Neural Workspace',
    marketplace: 'Gemclaw Market',
  },
  naming: {
    aether: {
      role: 'architectural_framework',
      note: 'Aether is the underlying neural spine. Gemclaw is the Sovereign Interface.',
    },
  },
  labels: {
    views: {
      home: 'Sovereign Core',
      workspace: 'Neural Workspace',
      hub: 'Neural Hub',
      settings: 'Config Matrix',
      forge: 'Gemclaw Forge',
      galaxy: 'Gemclaw Galaxy',
      about: 'About Gemclaw',
      marketplace: 'Gemclaw Market',
    },
    nav: {
      home: 'SOVEREIGN_CORE',
      galaxy: 'GEMIGRAM_GALAXY',
      hub: 'NEURAL_HUB',
      forge: 'GEMIGRAM_FORGE',
      workspace: 'WORKSPACE',
      marketplace: 'GEMIGRAM_MARKET',
      settings: 'CONFIG',
      about: 'ABOUT',
    },
  },
  assets: {
    primaryLogo: {
      path: '/assets/branding/logo.png',
      usage: 'Primary wordmark/logo for app shell and brand surfaces.',
    },
    icon: {
      path: '/assets/branding/logo.png',
      usage: 'Compact Sovereign icon for avatars and constrained UI.',
    },
    forgeMark: {
      path: '/assets/branding/logo.png', // Unified for now
      usage: 'Gemclaw Forge mark.',
    },
    avatar: {
      default: '/avatars/default.png',
      usage: 'Default placeholder for neural entities.',
    },
  },
} as const;

export type BrandType = typeof BRAND;
