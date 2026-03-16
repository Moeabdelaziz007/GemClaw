import { NextRequest, NextResponse } from 'next/server';
import { getAgentAvatar } from '@/lib/pwa/avatar-storage';
import { getMemory } from '@/lib/memory/memory-store';

/**
 * Dynamic PWA Manifest Route
 * 
 * Generates agent-specific PWA manifests on-demand
 * Route: /manifest/[agentId]
 * 
 * @example
 * GET /manifest/agent-123
 * Returns: Web App Manifest JSON for that specific agent
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
): Promise<NextResponse> {
  try {
    const { agentId } = await params;
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID required' },
        { status: 400 }
      );
    }

    // Get agent avatar URL
    const avatarUrl = await getAgentAvatar(agentId);
    
    // Generate manifest with agent-specific data
    const manifest = generateAgentManifest(agentId, avatarUrl);
    
    // Return as JSON with proper headers
    return new NextResponse(JSON.stringify(manifest), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[Manifest Route] Error generating manifest:', error);
    return NextResponse.json(
      { error: 'Failed to generate manifest' },
      { status: 500 }
    );
  }
}

/**
 * Generate agent-specific manifest
 */
function generateAgentManifest(agentId: string, avatarUrl: string): WebAppManifest {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  
  return {
    name: `Agent ${agentId} - AI Assistant`,
    short_name: `Agent ${agentId.substring(0, 8)}`,
    description: `AI Agent ${agentId}`,
    start_url: `${baseUrl}/?agent=${agentId}`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050B14',
    theme_color: '#10ff87',
    icons: generateManifestIcons(avatarUrl),
    categories: ['productivity', 'utilities'],
    shortcuts: [
      {
        name: 'Chat',
        url: `${baseUrl}/workspace?agent=${agentId}`,
        description: 'Start conversation',
      },
      {
        name: 'Settings',
        url: `${baseUrl}/hub/${agentId}`,
        description: 'Configure agent',
      },
    ],
  };
}

/**
 * Generate icon sizes for manifest
 */
function generateManifestIcons(baseUrl: string): ManifestIcon[] {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  return sizes.map(size => ({
    src: `${baseUrl}?size=${size}`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any maskable',
  }));
}

// TypeScript interfaces
interface WebAppManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  orientation: string;
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
  categories?: string[];
  shortcuts?: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}
