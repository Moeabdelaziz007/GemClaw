import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../app/api/agents/route';
import { verifyIdToken, db } from '../lib/auth/serverAuth';

// Mock serverAuth
vi.mock('../lib/auth/serverAuth', () => ({
  verifyIdToken: vi.fn(),
  db: {
    collection: vi.fn(() => ({
      where: vi.fn(() => ({
        get: vi.fn(),
      })),
      add: vi.fn(),
    })),
  },
}));

describe('/api/agents API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if unauthorized', async () => {
      (verifyIdToken as any).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/agents');
      
      const res = await GET(req);
      const data = await res.json();
      
      expect(res.status).toBe(401);
      expect(data.error).toContain('Unauthorized');
    });

    it('should return list of agents for authenticated user', async () => {
      (verifyIdToken as any).mockResolvedValue({ uid: 'user-1' });
      const mockDocs = [
        { id: 'agent-1', data: () => ({ name: 'Agent 1', ownerId: 'user-1' }) },
        { id: 'agent-2', data: () => ({ name: 'Agent 2', ownerId: 'user-1' }) }
      ];
      
      const mockCollection = (db.collection as any)();
      const mockWhere = mockCollection.where();
      mockWhere.get.mockResolvedValue({ docs: mockDocs });
      
      const req = new NextRequest('http://localhost/api/agents', {
        headers: { Authorization: 'Bearer valid-token' }
      });
      
      const res = await GET(req);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].id).toBe('agent-1');
      expect(mockCollection.where).toHaveBeenCalledWith('ownerId', '==', 'user-1');
    });
  });

  describe('POST', () => {
    it('should return 401 if unauthorized', async () => {
      (verifyIdToken as any).mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/agents', { method: 'POST' });
      
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('should create an agent and enforce ownerId', async () => {
      (verifyIdToken as any).mockResolvedValue({ uid: 'user-1' });
      const mockCollection = (db.collection as any)();
      mockCollection.add.mockResolvedValue({ id: 'new-agent-id' });
      
      const req = new NextRequest('http://localhost/api/agents', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-token' },
        body: JSON.stringify({ name: 'Shield Agent', ownerId: 'attacker-id' })
      });
      
      const res = await POST(req);
      const data = await res.json();
      
      expect(res.status).toBe(201);
      expect(data.id).toBe('new-agent-id');
      
      // Verify ownerId enforcement (Injection attack prevention)
      const addedData = mockCollection.add.mock.calls[0][0];
      expect(addedData.ownerId).toBe('user-1');
      expect(addedData.name).toBe('Shield Agent');
      expect(addedData.createdAt).toBeDefined();
    });

    it('should return 500 if database fails', async () => {
      (verifyIdToken as any).mockResolvedValue({ uid: 'user-1' });
      const mockCollection = (db.collection as any)();
      mockCollection.add.mockRejectedValue(new Error('Firestore Error'));
      
      const req = new NextRequest('http://localhost/api/agents', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-token' },
        body: JSON.stringify({ name: 'Fail Agent' })
      });
      
      const res = await POST(req);
      expect(res.status).toBe(500);
    });
  });
});
