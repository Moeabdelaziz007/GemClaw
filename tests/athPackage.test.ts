import { test, mock } from 'node:test';
import assert from 'node:assert';

const mockFile = mock.fn();
const mockFolder = mock.fn(() => ({ file: mockFile }));
const mockGenerateAsync = mock.fn(async () => 'fake-blob');
const mockSaveAs = mock.fn();

import Module from 'node:module';
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
  if (id === 'jszip') {
    return class MockJSZip {
      file = mockFile;
      folder = mockFolder;
      generateAsync = mockGenerateAsync;
    };
  }
  if (id === 'file-saver') {
    return { saveAs: mockSaveAs };
  }
  return originalRequire.apply(this, arguments as any);
};

const { exportAgentAsAth } = require('../utils/athPackage');

test('exportAgentAsAth exports agent correctly', async (t) => {
  mockFile.mock.resetCalls();
  mockFolder.mock.resetCalls();
  mockGenerateAsync.mock.resetCalls();
  mockSaveAs.mock.resetCalls();

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

  await exportAgentAsAth(agent);

  assert.strictEqual(mockFile.mock.callCount(), 5);

  // manifest.json
  const manifestCall = mockFile.mock.calls[0];
  assert.strictEqual(manifestCall.arguments[0], 'manifest.json');
  const manifestData = JSON.parse(manifestCall.arguments[1]);
  assert.strictEqual(manifestData.name, 'test agent name');
  assert.strictEqual(manifestData.aetherId, '12345');
  assert.deepStrictEqual(manifestData.pwa, { themeColor: '#050B14', icon: 'icon.png' });

  // soul.json
  const soulCall = mockFile.mock.calls[1];
  assert.strictEqual(soulCall.arguments[0], 'soul.json');
  const coreData = JSON.parse(soulCall.arguments[1]);
  assert.strictEqual(coreData.systemPrompt, 'You are a testing agent.');
  assert.strictEqual(coreData.persona, 'tester');
  assert.strictEqual(coreData.soul, 'pure');
  assert.deepStrictEqual(coreData.rules, ['be nice']);

  // tools.json
  const toolsCall = mockFile.mock.calls[2];
  assert.strictEqual(toolsCall.arguments[0], 'tools.json');
  const toolsData = JSON.parse(toolsCall.arguments[1]);
  assert.deepStrictEqual(toolsData, { toolA: true });

  // memory/firestore_ref.json
  const memoryCall = mockFile.mock.calls[3];
  assert.strictEqual(memoryCall.arguments[0], 'firestore_ref.json');
  const memoryData = JSON.parse(memoryCall.arguments[1]);
  assert.deepStrictEqual(memoryData, { collection: 'agents', id: 'agent-123' });

  // sandbox/permissions.json
  const permissionsCall = mockFile.mock.calls[4];
  assert.strictEqual(permissionsCall.arguments[0], 'permissions.json');
  const permissionsData = JSON.parse(permissionsCall.arguments[1]);
  assert.deepStrictEqual(permissionsData, { permissions: ['camera', 'microphone'] });

  assert.strictEqual(mockGenerateAsync.mock.callCount(), 1);
  assert.deepStrictEqual(mockGenerateAsync.mock.calls[0].arguments[0], { type: 'blob' });

  assert.strictEqual(mockSaveAs.mock.callCount(), 1);
  assert.strictEqual(mockSaveAs.mock.calls[0].arguments[0], 'fake-blob');
  assert.strictEqual(mockSaveAs.mock.calls[0].arguments[1], 'test_agent_name.ath');
});

test('exportAgentAsAth handles missing optional fields and tools fallback', async (t) => {
  mockFile.mock.resetCalls();
  mockFolder.mock.resetCalls();
  mockGenerateAsync.mock.resetCalls();
  mockSaveAs.mock.resetCalls();

  t.after(() => {
    Module.prototype.require = originalRequire; // Restore require hook
  });

  const agent = {
    id: 'agent-456',
    name: 'fallback agent',
  };

  await exportAgentAsAth(agent);

  assert.strictEqual(mockFile.mock.callCount(), 5);

  const soulCall = mockFile.mock.calls[1];
  const coreData = JSON.parse(soulCall.arguments[1]);
  assert.strictEqual(coreData.systemPrompt, undefined);

  const toolsCall = mockFile.mock.calls[2];
  const toolsData = JSON.parse(toolsCall.arguments[1]);
  assert.deepStrictEqual(toolsData, {}); // empty tools fallback

  assert.strictEqual(mockSaveAs.mock.calls[0].arguments[1], 'fallback_agent.ath');
});
