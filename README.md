# 🌌 Gemigram — Voice-First AI Agent Creation Platform

> **Built entirely on the Google & Gemini Ecosystem**
> Create, deploy, and interact with sovereign AI agents using nothing but your voice.

[![Built with Gemini](https://img.shields.io/badge/Built%20with-Gemini%20Live%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)

## 🎯 Vision
Gemigram is an AI-first, voice-only agent creation platform inspired by Telegram bots and BotFather — but powered entirely by Google's Gemini ecosystem. Users create AI agents through natural voice conversation with "Aether Forge", our AI architect.

## 🏗️ Google Ecosystem Integration

| Service | Usage | Free Tier |
|---------|-------|-----------|
| **Gemini Live API** | Real-time voice conversation via WebSocket | ✅ Free with API key |
| **Gemini 2.0 Flash** | Agent blueprint synthesis & intelligence | ✅ Free tier available |
| **Firebase Auth** | Google Sign-In, user management | ✅ Free (Spark plan) |
| **Cloud Firestore** | Agent storage, user data, memories | ✅ Free (1GB storage) |
| **Firebase Storage** | File uploads, agent assets | ✅ Free (5GB) |
| **Firebase Hosting** | Web app deployment | ✅ Free (10GB/month) |
| **Cloudflare** | CDN, DNS, edge caching | ✅ Free plan |

## ✨ Key Features

### 🎙️ Voice-First Agent Creation (Aether Forge)
- Create AI agents entirely through voice conversation
- AI-powered blueprint synthesis via Gemini
- 11-step conversational onboarding flow
- Automatic persona, tools, and skills assignment

### 🧠 Gemini Live API Integration
- Native audio streaming via WebSocket
- Real-time voice input/output (PCM 24kHz)
- Tool calling during live conversation
- Automatic reconnection with exponential backoff
- Context recovery on session resume

### 📱 Smart Agent Deployment (PWA)
- Add any created agent as a home screen shortcut
- Dynamic PWA manifest per agent
- AI-generated agent avatars (DiceBear)
- Works on Android, iOS, and Desktop

### 🌐 Neural Marketplace
- Browse and install pre-built agent templates
- Category filtering and search
- One-click agent installation

### 🔧 Agent Skills & Tools
- Google Search, Maps, Weather, Crypto
- Semantic Memory (long-term context)
- Google Workspace integration (Gmail, Calendar, Drive)
- MCP Protocol support (20,000+ APIs)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project (free Spark plan)
- Gemini API key (free at https://aistudio.google.com)

### 1. Clone & Install
```bash
git clone https://github.com/Moeabdelaziz007/Gemigram.git
cd Gemigram
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Fill in your Firebase and Gemini credentials
```

Required variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

### 3. Launch Development
```bash
npm run dev
```

## 📂 Architecture

```
gemigram/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # Server API Routes
│   │   ├── agents/               # Agent CRUD
│   │   ├── forge/synthesize/     # Gemini-powered agent synthesis
│   │   └── manifest/[agentId]/   # Dynamic PWA manifests
│   ├── dashboard/                # Agent overview & metrics
│   ├── forge/                    # Voice agent creation (Aether Forge)
│   ├── workspace/                # Voice interaction canvas
│   ├── hub/                      # Agent registry browser
│   ├── marketplace/              # Public agent templates
│   ├── galaxy/                   # 3D agent visualization
│   └── settings/                 # User preferences
│
├── components/                   # React Components
│   ├── ConversationalAgentCreator.tsx  # 11-step voice onboarding
│   ├── workspace/PureVoiceCanvas.tsx   # Minimalist voice UI
│   ├── workspace/VoiceOrb.tsx          # Voice activity indicator
│   └── ui/AddToHomeScreen.tsx          # PWA install prompt
│
├── hooks/                        # Core UI Hooks
│   ├── useLiveAPI.ts             # Gemini Live API WebSocket
│   ├── useVoiceInteraction.ts    # Speech recognition logic
│   └── useAudioProcessor.ts     # Audio worklet management
│
├── lib/                          # Business Logic
│   ├── store/                    # Zustand 6-Slice Neural Store
│   │   └── slices/               # Sensory, Cognitive, Agent, UI, Auth, Swarm
│   ├── hooks/                    # Feature hooks (forge, speech, workspace)
│   ├── memory/                   # Semantic memory engine
│   ├── agents/                   # Agent registry & skills logic
│   ├── pwa/                      # PWA manifest & avatar generation
│   ├── neural/                   # Intent engine & command routing
│   └── voice/                    # TTS synthesis & voice biometrics
│
├── functions/                    # Firebase Cloud Functions
└── public/                       # Static assets & audio worklets (audio-processor.js)
```

## 🎙️ Voice Architecture

```
┌─────────────────────────────────────────────────┐
│                    USER VOICE                     │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│          AudioWorklet (neural-spine-processor)    │
│          PCM 24kHz → Float32 → Int16 → Base64    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│          Gemini Live API (WebSocket)              │
│          wss://generativelanguage.googleapis.com  │
│          Model: gemini-2.0-flash-exp-audio        │
└──────────┬───────────────────────┬───────────────┘
           │                       │
           ▼                       ▼
┌──────────────────┐   ┌──────────────────────────┐
│   Audio Response  │   │     Tool Calls           │
│   (Native Audio)  │   │  (navigate, create, etc) │
└────────┬─────────┘   └──────────┬───────────────┘
         │                        │
         ▼                        ▼
┌──────────────────┐   ┌──────────────────────────┐
│  AudioContext     │   │  Zustand Store Update    │
│  PCM → Speaker    │   │  UI State Propagation    │
└──────────────────┘   └──────────────────────────┘
```

## 🧠 State Management (6-Slice Neural Store)

| Slice | Purpose |
|-------|---------|
| **Auth** | User session, Firebase auth state persistence |
| **Agent** | Active agent registry, metadata, and CRUD operations |
| **Cognitive** | Transcript history, streaming buffer, and context usage |
| **Sensory** | Mic levels, volume management, and live session state |
| **UI** | Theme engine, navigation stages, and modal states |
| **Swarm** | Inter-agent communication protocols and swarm state |

## 🗺️ Roadmap

- [x] Gemini Live API WebSocket integration
- [x] Voice-first agent creation (Aether Forge)
- [x] Firebase Auth & Firestore persistence
- [x] 6-Slice Zustand state architecture
- [x] Neural Marketplace with agent templates
- [x] PWA support with dynamic manifests
- [ ] Multi-agent swarm orchestration
- [ ] Agent-to-agent communication protocol
- [ ] Voice cloning with custom voice profiles
- [ ] Arabic-first localization
- [ ] Gemini Nano on-device inference

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License
MIT License — See [LICENSE](./LICENSE)

---

<div align="center">
  <strong>Built with ❤️ on the Google & Gemini Ecosystem</strong>
  <br/>
  <sub>Gemigram — Where Voice Meets Intelligence</sub>
</div>
