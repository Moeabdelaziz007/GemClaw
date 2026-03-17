import { test, mock } from 'node:test';
import assert from 'node:assert';
import { exportAgentAsAth } from '../utils/athPackage.ts';

test('exportAgentAsAth exports agent correctly', async (t) => {
  const mockFile = mock.fn();
  const mockFolder = mock.fn(() => ({ file: mockFile }));
  const mockGenerateAsync = mock.fn(async () => 'fake-blob');
  const mockSaveAs = mock.fn();

  class MockJSZip {
    file = mockFile;
    folder = mockFolder;
    generateAsync = mockGenerateAsync;
  }

  const agent = {
    id: 'agent-123',
    name: 'test agent name',
    aetherId: '12345',
    systemPrompt: 'You are a testing agent.',
    role: 'tester',
    soul: 'pure',
    rules: ['be nice'],
    tools: { toolA: true }
  };

  await exportAgentAsAth(agent, { JSZip: MockJSZip, saveAs: mockSaveAs });

  assert.strictEqual(mockFile.mock.callCount(), 5);

  // manifest.json
  const manifestCall = mockFile.mock.calls[0];
  assert.strictEqual(manifestCall.arguments[0], 'manifest.json');
  const manifestData = JSON.parse(manifestCall.arguments[1]);
  assert.strictEqual(manifestData.name, 'test agent name');
  assert.strictEqual(manifestData.aetherId, '12345');

  // soul.json
  const soulCall = mockFile.mock.calls[1];
  assert.strictEqual(soulCall.arguments[0], 'soul.json');

  assert.strictEqual(mockGenerateAsync.mock.callCount(), 1);
  assert.strictEqual(mockSaveAs.mock.callCount(), 1);
  assert.strictEqual(mockSaveAs.mock.calls[0].arguments[0], 'fake-blob');
  assert.strictEqual(mockSaveAs.mock.calls[0].arguments[1], 'test_agent_name.ath');
});

test('exportAgentAsAth handles missing optional fields and tools fallback', async (t) => {
  const mockFile = mock.fn();
  const mockFolder = mock.fn(() => ({ file: mockFile }));
  const mockGenerateAsync = mock.fn(async () => 'fake-blob');
  const mockSaveAs = mock.fn();

  class MockJSZip {
    file = mockFile;
    folder = mockFolder;
    generateAsync = mockGenerateAsync;
  }

  const agent = {
    id: 'agent-456',
    name: 'fallback agent',
  };

  await exportAgentAsAth(agent, { JSZip: MockJSZip, saveAs: mockSaveAs });

  assert.strictEqual(mockFile.mock.callCount(), 5);
  assert.strictEqual(mockSaveAs.mock.calls[0].arguments[1], 'fallback_agent.ath');
});
