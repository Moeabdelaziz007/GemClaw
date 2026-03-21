# 🌌 Gemigram — Voice-First AI Agent Creation Platform
> **Built entirely on the Google & Gemini Ecosystem** | **تم البناء بالكامل على منظومة جوجل وجيمناي**
> Create, deploy, and interact with sovereign AI agents using nothing but your voice. | أنشئ وانشر وتفاعل مع الوكلاء الأذكياء باستخدام صوتك فقط.

[![Built with Gemini](https://img.shields.io/badge/Built%20with-Gemini%20Live%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)

## 🎯 Vision | الرؤية

**Eng:** Gemigram is an AI-first, voice-only agent creation platform inspired by Telegram bots and BotFather — but powered entirely by Google's Gemini ecosystem. Users create AI agents through natural voice conversation with "Aether Forge", our AI architect.

**Ar:** جيميجزام (Gemigram) هي منصة مدعومة بالذكاء الاصطناعي لإنشاء الوكلاء الأذكياء عبر الصوت فقط، مستوحاة من روبوتات تيليجرام (BotFather) ولكنها مبنية بالكامل أدوات ومنظومة جوجل جيمناي. يقوم المستخدمون بإنشاء وكلاء ذكاء اصطناعي من خلال محادثة صوتية طبيعية مع "Aether Forge"، المهندس الذكي الخاص بنا.

## 🏗️ Google Ecosystem Integration | التكامل مع منظومة جوجل

| Service | Usage | Free Tier | الاستخدام |
|---------|-------|-----------|-----------|
| **Gemini Live API** | Real-time voice conversation via WebSocket | ✅ Free with API key | المحادثة الصوتية في الوقت الفعلي |
| **Gemini 2.0 Flash** | Agent blueprint synthesis & intelligence | ✅ Free tier available | بناء المخططات والذكاء الاصطناعي |
| **Firebase Auth** | Google Sign-In, user management | ✅ Free (Spark plan) | تسجيل الدخول وإدارة المستخدمين |
| **Cloud Firestore** | Agent storage, user data, memories | ✅ Free (1GB storage) | تخزين الوكلاء، البيانات، والذكريات |
| **Firebase Storage** | File uploads, agent assets | ✅ Free (5GB) | رفع الملفات والأصول الرقمية |
| **Firebase Hosting** | Web app deployment | ✅ Free (10GB/month) | نشر التطبيق الخادم على الويب |
| **Cloudflare** | CDN, DNS, edge caching | ✅ Free plan | إدارة النطاقات والسرعة |

## ✨ Key Features | الميزات الأساسية

### 🎙️ Voice-First Agent Creation (Aether Forge) | إنشاء وكلاء بالصوت
- **Eng:** Create AI agents entirely through voice conversation. AI-powered blueprint synthesis via Gemini with an 11-step conversational onboarding flow. Automatically assigns persona, tools, and skills.
- **Ar:** قم بإنشاء وكلاء ذكاء اصطناعي بالكامل عبر المحادثة الصوتية. يتم بناء المخطط الذكي بفضل جيمناي عبر 11 خطوة حوارية لتعيين الشخصية والأدوات والمهارات تلقائياً بدون تدخل يدوي.

### 🧠 Gemini Live API Integration | دمج Gemini Live API
- **Eng:** Native audio streaming via WebSocket (PCM 24kHz), Real-time voice input/output, Tool calling during live conversation, and Automatic reconnection with context recovery.
- **Ar:** بث صوتي مباشر عبر WebSocket بجودة (PCM 24kHz)، إدخال وإخراج صوتي فوري، استدعاء الأدوات أثناء المحادثة الحية، وإعادة اتصال تلقائي مع استعادة السياق.

### 📱 Smart Agent Deployment (PWA) | النشر الذكي للوكلاء
- **Eng:** Add any created agent as a home screen shortcut with a Dynamic PWA manifest per agent and AI-generated agent avatars. Works on Android, iOS, and Desktop.
- **Ar:** أضف أي وكيل كاختصار على الشاشة الرئيسية بفضل متصفحات الويب التقدمية (PWA)، مع صور رمزية مُولدة بالذكاء الاصطناعي. متوافق مع أندرويد وiOS وسطح المكتب.

### 🌐 Neural Marketplace | المتجر العصبي
- **Eng:** Browse and install pre-built agent templates, category filtering and search, one-click agent installation.
- **Ar:** تصفح وقم بتثبيت قوالب جاهزة للوكلاء، تصفية الفئات والبحث، وتثبيت الوكيل في سجلك الخاص بنقرة واحدة.

### 🔧 Agent Skills & Tools | مهارات وأدوات الوكلاء
- **Eng:** Google Search, Maps, Weather, Crypto, Semantic Memory (long-term context), Google Workspace integration (Gmail, Calendar, Drive), and MCP Protocol support.
- **Ar:** بحث جوجل، الخرائط، الطقس، العملات الرقمية، الذاكرة الدلالية (سياق طويل الأمد)، وتكامل جوجل ورك سبيس (جيميل، التقويم، درايف)، ودعم بروتوكول MCP العالمي.

## 🚀 Quick Start | البدء السريع

### Prerequisites | المتطلبات الأساسية
- Node.js 18+
- Firebase project (free Spark plan) | مشروع فايربيس
- Gemini API key (free at https://aistudio.google.com) | مفتاح جيمناي

### 1. Clone & Install | النسخ والتثبيت
```bash
git clone https://github.com/Moeabdelaziz007/Gemigram.git
cd Gemigram
npm install
```

### 2. Configure Environment | إعداد بيئة العمل
```bash
cp .env.example .env.local
```
**Eng:** Fill in your Firebase and Gemini credentials (No billing required).  
**Ar:** قم بملء بيانات الاعتماد الخاصة بفايربيس وجيمناي (المستوى المجاني يكفي).

### 3. Launch Development | إطلاق التطبيق
```bash
npm run dev
```

## 📂 Architecture | البنية الهندسية

```
gemigram/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # Server API Routes (مسارات الخادم العصبية)
│   ├── dashboard/                # Agent overview & metrics (لوحة التحكم السريادية)
│   ├── forge/                    # Voice agent creation (مصنع توليد الوكلاء)
│   ├── workspace/                # Voice interaction canvas (مساحة التفاعل الكونية)
│   ├── hub/                      # Agent registry browser (سجل الوكلاء التابعين)
│   ├── marketplace/              # Public agent templates (المتجر العصبي)
│   ├── galaxy/                   # 3D agent visualization (تصور الوكلاء ثلاثي الأبعاد)
│   └── settings/                 # User preferences (تكوين تفضيلات النظام)
├── components/                   # React Components (مكونات الواجهة المادية)
├── hooks/                        # Core UI Hooks (أدوات الربط الأساسية)
├── lib/                          # Business Logic (المنطق البرمجي)
│   ├── store/                    # Zustand 6-Slice Neural Store (مخزن الحالة السداسي)
│   ├── memory/                   # Semantic memory engine (محرك الذاكرة الدلالية)
│   ├── neural/                   # Intent engine & command routing (محرك التوجيه والنوايا)
│   └── voice/                    # TTS synthesis & voice biometrics (توليد ومعالجة الصوت)
└── functions/                    # Firebase Cloud Functions (دوال السحابة المستقلة)
```

## 🎙️ Voice Architecture | هيكلية الصوت

**Eng:** Gemigram utilizes a Neural-Spine Voice Protocol (NSVP) that routes raw PCM audio (24kHz) from the user directly into a dedicated `AudioWorklet`. This bypasses traditional UI limits, streaming seamlessly to the `Gemini Live API` via WebSockets for sub-second, ultra-low latency intelligent interactions.

**Ar:** يستخدم جيميجزام بروتوكولًا صوتيًا عصبيًا (NSVP) يوجه الصوت الخام (PCM بمسار 24kHz) صعودًا من المستخدم إلى مسار معالجة يعمل في الخلفية (`AudioWorklet`). وبهذا نتجاوز قيود واجهة المستخدم التقليدية لنرسل البيانات بسلاسة إلى واجهة `Gemini Live` عبر WebSocket لاستجابات فائقة السرعة وأزمنة انتقال شبه معدومة.

## 🧠 State Management (6-Slice Neural Store) | إدارة الحالة العصبية

| Slice (الشريحة) | Purpose | الغرض |
|-----------------|---------|--------|
| **Auth** | User session, Firebase auth persistence | جلسات المستخدم والحفاظ على حالة المصادقة |
| **Agent** | Active agent registry, metadata, & CRUD | إدارة سجل الوكلاء النشطين وبياناتهم الوصفية |
| **Cognitive** | Transcript history, streaming buffer | تاريخ المحادثات وتدفق الذاكرة والمصطلحات |
| **Sensory** | Mic levels, volume management | إدارة الصوت، مستويات الميكروفون، والجلسة |
| **UI** | Theme engine, navigation stages | محرك المظهر، مراحل التنقل الواجهي |
| **Swarm** | Inter-agent communication protocols | بروتوكولات تواصل الوكلاء المتعدد (السرب) |

## 🗺️ Roadmap | خارطة الطريق

- [x] Gemini Live API WebSocket integration | النشر السلس لمعمارية Gemini Live
- [x] Voice-first agent creation (Aether Forge) | إنشاء وكلاء ذكاء اصطناعي بالصوت فقط
- [x] Firebase Auth & Firestore persistence | دمج قواعد بيانات فايربيس بشكل كامل
- [x] 6-Slice Zustand state architecture | هيكلة إدارة الحالة عبر شرائح Zustand
- [x] Neural Marketplace with agent templates | إطلاق المتجر العصبي والنماذج
- [x] PWA support with dynamic manifests | الدعم الشامل لتطبيقات PWA
- [x] Arabic NLU & Localization Phase 1 | معالجة اللغات الطبيعية والتوطين للغة العربية
- [ ] Multi-agent swarm orchestration | التنسيق المعياري لأسراب الوكلاء المتعددين
- [ ] Agent-to-agent communication protocol | نظام بروتوكول تواصل الذكاء الاصطناعي الفرعي
- [ ] Voice cloning with custom voice profiles | استنساخ الأصوات وبناء الملفات الصوتية المخصصة

## 🤝 Contributing | المساهمة
**Eng:** See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.  
**Ar:** راجع ملف المساهمة (CONTRIBUTING.md) لمزيد من التعليمات والشروط.

## 📄 License | الترخيص
MIT License — See [LICENSE](./LICENSE)

---

<div align="center">
  <strong>Built with ❤️ on the Google & Gemini Ecosystem</strong><br/>
  <strong>تم البناء بحب على منظومة أدوات جوجل وجيمناي</strong><br/>
  <sub>Gemigram — Where Voice Meets Intelligence | حيث يلتقي الصوت بالذكاء</sub>
</div>
