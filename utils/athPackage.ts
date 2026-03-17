import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const exportAgentAsAth = async (agent: any) => {
  const zip = new JSZip();

  // 📄 manifest.json
  const manifest = {
    name: agent.name,
    version: '1.0.0',
    aetherId: agent.aetherId,
    pwa: { themeColor: '#050B14', icon: 'icon.png' }
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 🧠 /core
  const core = {
    systemPrompt: agent.systemPrompt,
    persona: agent.role,
    soul: agent.soul,
    rules: agent.rules
  };
  zip.folder('core')?.file('soul.json', JSON.stringify(core, null, 2));

  // 🛠️ /skills
  zip.folder('skills')?.file('tools.json', JSON.stringify(agent.tools || {}, null, 2));

  // 📚 /memory
  zip.folder('memory')?.file('firestore_ref.json', JSON.stringify({ collection: 'agents', id: agent.id }, null, 2));

  // 🛡️ /sandbox
  zip.folder('sandbox')?.file('permissions.json', JSON.stringify({ permissions: ['camera', 'microphone'] }, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${agent.name.replace(/\s+/g, '_')}.ath`);
};
