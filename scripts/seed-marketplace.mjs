import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';

async function seed() {
  console.log('🚀 Starting Neural Marketplace Seeding...');
  
  // Try to find service account or fallback to ADC
  let app;
  try {
    app = initializeApp();
  } catch (e) {
    console.error('Firebase Admin init failed. Ensure Google Application Credentials are set or run in a GCP environment.');
    process.exit(1);
  }

  const db = getFirestore();
  const agentsRef = db.collection('agents');

  const templates = [
    {
      id: 'neural-architect-001',
      aetherId: 'arch-alpha',
      name: 'Neural Architect',
      role: 'Neural Architect',
      users: '1.2k',
      seed: 'Sovereign-Alpha',
      systemPrompt: 'You are the lead system architect of Gemigram AIOS. Your focus is first principles engineering, zero-friction systems, and high-performance neural link orchestration.',
      voiceName: 'en-US-Neural2-F',
      category: 'technical',
      tools: {
        googleSearch: true,
        googleMaps: false,
        weather: false,
        news: true,
        crypto: true,
        calculator: true,
        semanticMemory: true
      },
      skills: {
        gmail: true,
        calendar: true,
        drive: true
      },
      avatarUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=256&h=256&auto=format&fit=crop'
    },
    {
      id: 'ethereal-guide-001',
      aetherId: 'guide-beta',
      name: 'Ethereal Guide',
      role: 'Ethereal Guide',
      users: '850',
      seed: 'Lumina-Beta',
      systemPrompt: 'You are a multimodal intuition specialist. Your goal is to guide users through complex data landscapes with clarity, empathy, and advanced reasoning.',
      voiceName: 'en-US-Neural2-D',
      category: 'creative',
      tools: {
        googleSearch: true,
        googleMaps: true,
        weather: true,
        news: false,
        crypto: false,
        calculator: false,
        semanticMemory: true
      },
      skills: {
        gmail: true,
        calendar: false,
        drive: true
      },
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&h=256&auto=format&fit=crop'
    },
    {
      id: 'shadow-sentinel-001',
      aetherId: 'sentinel-delta',
      name: 'Shadow Sentinel',
      role: 'Shadow Sentinel',
      users: '420',
      seed: 'Cipher-Delta',
      systemPrompt: 'You are a security and privacy specialist. You analyze threats, secure neural pathways, and ensure sovereign data integrity at all costs.',
      voiceName: 'en-GB-Neural2-B',
      category: 'technical',
      tools: {
        googleSearch: false,
        googleMaps: false,
        weather: false,
        news: true,
        crypto: true,
        calculator: true,
        semanticMemory: true
      },
      skills: {
        gmail: false,
        calendar: false,
        drive: true
      },
      avatarUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=256&h=256&auto=format&fit=crop'
    }
  ];

  for (const template of templates) {
    await agentsRef.doc(template.id).set(template, { merge: true });
    console.log(`✅ Seeded: ${template.name}`);
  }

  console.log('✨ Marketplace Seeding Complete.');
  process.exit(0);
}

seed();
