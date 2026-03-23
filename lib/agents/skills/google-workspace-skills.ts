/**
 * 📧 Google Workspace Skills
 * 
 * Comprehensive skill definitions for Google Workspace integration.
 * Includes Gmail, Calendar, Drive, Docs, Sheets, Slides, Maps, and Photos.
 */

import { SkillDefinition } from '../skill-types';

/**
 * Gmail Integration Skill
 */
export const GMAIL_SKILL: SkillDefinition = {
  id: 'gmail',
  name: 'Gmail Integration',
  description: 'Send, receive, and manage emails through Gmail API with full attachment support',
  category: 'communication',
  capabilities: [
    'send_email',
    'read_emails',
    'search_emails',
    'manage_labels',
    'create_drafts',
    'attach_files',
    'delete_emails',
    'mark_as_read'
  ],
  permissions: ['read', 'write', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_API_KEY'],
    oauthScopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.compose'
    ],
    externalServices: ['Gmail API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Mail',
    color: 'text-red-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['email', 'communication', 'google', 'messaging', 'inbox'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/workspace/guides/create-credentials'
  }
};

/**
 * Calendar Management Skill
 */
export const CALENDAR_SKILL: SkillDefinition = {
  id: 'calendar',
  name: 'Calendar Management',
  description: 'Schedule, manage, and synchronize calendar events across timezones',
  category: 'productivity',
  capabilities: [
    'create_events',
    'update_events',
    'delete_events',
    'list_events',
    'check_availability',
    'send_invites',
    'manage_reminders',
    'find_meeting_times',
    'recurring_events'
  ],
  permissions: ['read', 'write', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_API_KEY'],
    oauthScopes: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ],
    externalServices: ['Google Calendar API']
  },
  dependencies: ['gmail'],
  conflicts: [],
  metadata: {
    icon: 'Calendar',
    color: 'text-blue-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['calendar', 'scheduling', 'productivity', 'google', 'events', 'meetings'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/workspace/calendar/api'
  }
};

/**
 * Google Drive Storage Skill
 */
export const DRIVE_SKILL: SkillDefinition = {
  id: 'drive',
  name: 'Google Drive',
  description: 'Cloud file storage, sharing, and management with advanced organization',
  category: 'productivity',
  capabilities: [
    'upload_files',
    'download_files',
    'share_files',
    'organize_folders',
    'search_files',
    'version_control',
    'permission_management',
    'file_preview'
  ],
  permissions: ['read', 'write', 'storage', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_API_KEY'],
    oauthScopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.readonly'
    ],
    externalServices: ['Google Drive API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'FolderOpen',
    color: 'text-yellow-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['storage', 'files', 'cloud', 'google', 'documents', 'sharing'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/workspace/drive/api'
  }
};

/**
 * Google Docs Skill
 */
export const DOCS_SKILL: SkillDefinition = {
  id: 'docs',
  name: 'Google Docs',
  description: 'Create, edit, and collaborate on documents with real-time editing',
  category: 'creative',
  capabilities: [
    'create_documents',
    'edit_documents',
    'format_text',
    'insert_images',
    'add_comments',
    'suggest_changes',
    'export_formats',
    'collaborative_editing'
  ],
  permissions: ['read', 'write', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_API_KEY'],
    oauthScopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.file'
    ],
    externalServices: ['Google Docs API', 'Google Drive API']
  },
  dependencies: ['drive'],
  conflicts: [],
  metadata: {
    icon: 'FileText',
    color: 'text-blue-600',
    difficulty: 'beginner',
    estimatedSetupTime: '7 minutes',
    tags: ['documents', 'writing', 'editing', 'google', 'text', 'collaboration'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/workspace/docs/api'
  }
};

/**
 * Google Sheets Skill
 */
export const SHEETS_SKILL: SkillDefinition = {
  id: 'sheets',
  name: 'Google Sheets',
  description: 'Spreadsheet creation, data analysis, and automated calculations',
  category: 'data',
  capabilities: [
    'create_spreadsheets',
    'data_entry',
    'formulas',
    'pivot_tables',
    'charts_graphs',
    'data_validation',
    'conditional_formatting',
    'import_export'
  ],
  permissions: ['read', 'write', 'execute', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_API_KEY'],
    oauthScopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ],
    externalServices: ['Google Sheets API', 'Google Drive API']
  },
  dependencies: ['drive'],
  conflicts: [],
  metadata: {
    icon: 'Table',
    color: 'text-green-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['spreadsheet', 'data', 'analysis', 'google', 'excel', 'calculations'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/workspace/sheets/api'
  }
};

/**
 * Google Slides Skill
 */
export const SLIDES_SKILL: SkillDefinition = {
  id: 'slides',
  name: 'Google Slides',
  description: 'Create stunning presentations with animations and transitions',
  category: 'creative',
  capabilities: [
    'create_presentations',
    'design_slides',
    'add_animations',
    'insert_media',
    'apply_themes',
    'speaker_notes',
    'present_mode',
    'export_pdf'
  ],
  permissions: ['read', 'write', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_API_KEY'],
    oauthScopes: [
      'https://www.googleapis.com/auth/presentations',
      'https://www.googleapis.com/auth/drive.file'
    ],
    externalServices: ['Google Slides API', 'Google Drive API']
  },
  dependencies: ['drive'],
  conflicts: [],
  metadata: {
    icon: 'Presentation',
    color: 'text-orange-500',
    difficulty: 'intermediate',
    estimatedSetupTime: '10 minutes',
    tags: ['presentation', 'slides', 'visual', 'google', 'pitch', 'display'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/workspace/slides/api'
  }
};

/**
 * Google Maps Skill
 */
export const MAPS_SKILL: SkillDefinition = {
  id: 'maps',
  name: 'Google Maps',
  description: 'Location services, directions, and place discovery with real-time traffic',
  category: 'productivity',
  capabilities: [
    'get_directions',
    'find_places',
    'calculate_distance',
    'traffic_info',
    'geocoding',
    'street_view',
    'nearby_search',
    'route_optimization'
  ],
  permissions: ['read', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_MAPS_API_KEY'],
    oauthScopes: [],
    externalServices: ['Google Maps Platform']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'MapPin',
    color: 'text-green-600',
    difficulty: 'beginner',
    estimatedSetupTime: '8 minutes',
    tags: ['location', 'map', 'navigation', 'google', 'places', 'directions'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/maps/documentation'
  }
};

/**
 * Google Photos Skill
 */
export const PHOTOS_SKILL: SkillDefinition = {
  id: 'photos',
  name: 'Google Photos',
  description: 'Photo management, album creation, and image sharing with AI organization',
  category: 'creative',
  capabilities: [
    'upload_photos',
    'create_albums',
    'search_photos',
    'share_photos',
    'edit_photos',
    'auto_enhance',
    'facial_recognition',
    'location_tagging'
  ],
  permissions: ['read', 'write', 'storage', 'network', 'api_access'],
  requirements: {
    apiKeys: ['GOOGLE_API_KEY'],
    oauthScopes: [
      'https://www.googleapis.com/auth/photoslibrary',
      'https://www.googleapis.com/auth/photoslibrary.readonly'
    ],
    externalServices: ['Google Photos Library API']
  },
  dependencies: ['drive'],
  conflicts: [],
  metadata: {
    icon: 'Image',
    color: 'text-pink-500',
    difficulty: 'beginner',
    estimatedSetupTime: '5 minutes',
    tags: ['photos', 'images', 'gallery', 'google', 'memories', 'visual'],
    version: '1.0.0',
    author: 'Gemclaw',
    documentationUrl: 'https://developers.google.com/photos/library'
  }
};

// Export all Google Workspace skills as an array
export const GOOGLE_WORKSPACE_SKILLS: SkillDefinition[] = [
  GMAIL_SKILL,
  CALENDAR_SKILL,
  DRIVE_SKILL,
  DOCS_SKILL,
  SHEETS_SKILL,
  SLIDES_SKILL,
  MAPS_SKILL,
  PHOTOS_SKILL
];
