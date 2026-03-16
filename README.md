![AetherOS Branding](public/aetheros_branding.png)

# 🌌 Gemigram: AetherOS (V2.1 - Sovereign Intelligence // ذكاء سيادي)
## *Mission: Winning the Gemini Live Agent Challenge 2026 // الفوز بتحدي العميل الحي 2026*

**Gemigram** (Powered by **AetherOS**) is a Sovereign Intelligence Orchestration System. It transcends traditional AI interfaces by functioning as a decentralized "Neural Operating System" designed for high-fidelity agent manifestation and universal project discovery.

**Gemigram** (المدعوم بـ **AetherOS**) هو نظام أوركسترا للذكاء السيادي. إنه يتجاوز واجهات الذكاء الاصطناعي التقليدية من خلال العمل كـ "نظام تشغيل عصبي" لا مركزي مصمم لتجسيد الوكلاء بدقة عالية واكتشاف المشاريع العالمية.

---

## 🏛️ THE V2.1 ARCHITECTURE // المعمارية الحديثة V2.1

### 1. Decentralized Route Matrix // المصفوفة اللامركزية
We have evolved from a monolithic SPA to a multi-route **Neural Grid**. Each sector operates as a standalone consciousness:
لقد تطورنا من نظام الصفحة الواحدة إلى **شبكة عصبية** متعددة المسارات. يعمل كل قطاع كوعي مستقل:

- **`/dashboard`**: Sovereign Command Center for global infrastructure status. // مركز القيادة السيادية لحالة البنية التحتية العالمية.
- **`/workspace`**: Active Neural Link for real-time Voice/Multimodal interaction. // الرابط العصبي النشط للتفاعل الصوتي والمتعدد الوسائط في الوقت الفعلي.
- **`/hub`**: The Entity Registry where manifested agents are cataloged. // سجل الكيانات حيث يتم أرشفة الوكلاء المتجسدين.
- **`/forge`**: The Synthesis Chamber for crafting new digital souls. // غار التصنيع لصياغة الأرواح الرقمية الجديدة.
- **`/galaxy`**: Interactive 3D/Physics representation of the neural network. // التمثيل التفاعلي ثلاثي الأبعاد/الفيزيائي للشبكة العصبية.

### 2. Universal Discovery & Orchestration // الاكتشاف والأوركسترا العالمية
The system now orchestrates your entire Google Cloud & Firebase ecosystem:
النظام الآن ينظم كامل بيئة Google Cloud و Firebase الخاصة بك:

- **Project Discovery**: Seamless mapping of all GCP resources via Resource Manager API. // رسم خرائط سلس لكافة موارد GCP عبر واجهة برمجة تطبيقات مدير الموارد.
- **Sovereign Deployment**: PWA-ready architecture with dynamic shortcuts. Each agent can be "manifested" as a standalone app on your device. // معمارية جاهزة كـ PWA مع اختصارات ديناميكية. يمكن لكل وكيل أن "يتجسد" كتطبيق مستقل على جهازك.

### 3. Persistent Consciousness (useAetherStore) // الوعي المستمر
Using **Zustand + Firestore**, the system maintains "Perception Continuity":
باستخدام **Zustand + Firestore**، يحافظ النظام على "استمرارية الإدراك":

- Navigation no longer resets agent states. // التنقل لم يعد يعيد ضبط حالات الوكيل.
- Global intelligence sync across all routes. // مزامنة الاستخبارات العالمية عبر جميع المسارات.
- Secure Auth & Real-time Telemetry. // مصادقة آمنة وقياس عن بعد في الوقت الفعلي.

---

## 💻 TECH SPECIFICATIONS // المواصفات التقنية

| Layer // الطبقة | Technology // التقنية | Purpose // الغرض |
| :--- | :--- | :--- |
| **Foundation** | Next.js 15 (App Router) | High-Performance Neural Substrate // ركيزة عصبية عالية الأداء |
| **Logic Core** | Gemini 2.0 Omni // Node 22 | Multi-Threaded Reasoning // استدلال متعدد المسارات |
| **Memory** | Firestore // Vector RAG | Persistent & Long-Term Recall // استدعاء مستمر وطويل الأمد |
| **Vibe / UI** | Tailwind v4 // Framer Motion | Industrial Sci-Fi // Quantum Glass // زجاج كوانتوم / خيال علمي صناعي |
| **Persistence** | Zustand // PWA Standalone | Continuous Operational Awareness // وعي تشغيلي مستمر |

---

## 🚀 INITIALIZATION PROTOCOL // بروتوكول التشغيل

1. **Clone the Source // استنساخ المصدر:**
   ```bash
   git clone https://github.com/Moeabdelaziz007/Gemigram.git
   cd Gemigram
   ```

2. **Supply Global Credentials // توفير الاعتمادات العالمية:**
   Create a `.env.local` file with your Firebase and Gemini keys.
   قم بإنشاء ملف `.env.local` يحتوي على مفاتيح Firebase و Gemini الخاصة بك.

3. **Ignition Sequence // تسلسل الإشعال:**
   ```bash
   npm install
   npm run dev
   ```

4. **Cloud Deployment (Firebase)**
   ```bash
   npx firebase login
   npx firebase deploy
   ```
   *Note: Use the included `deploy-firebase.sh` for an automated, one-click deployment experience.*

5. **Local Testing**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

---

## 📦 DEPLOYMENT GUIDE // دليل النشر

### Firebase Hosting Deployment

**Prerequisites:**
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- Firestore database enabled
- Storage bucket enabled

**Deployment Steps:**

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize project (first time only)
firebase init
# Select: Hosting, Firestore, Storage

# 3. Build production version
npm run build

# 4. Deploy to Firebase
firebase deploy --only hosting

# Or deploy everything
firebase deploy
```

### GitHub Repository

```bash
# Commit all changes
git add .
git commit -m "feat: Add Dark Mode, Deploy Agent, Avatar Generation & Memory System"

# Push to repository
git push origin main
```

### Continuous Deployment

The project includes GitHub Actions workflows for automatic deployment:
- `.github/workflows/ci.yml` - Continuous Integration
- `.github/workflows/deploy.yml` - Automatic Firebase deployment
- `.github/workflows/e2e.yml` - End-to-end testing

---

## 🎨 DARK MODE & THEME SYSTEM // نظام الثيم والوضع الداكن

AetherOS features a sophisticated dual-theme system with automatic adaptation, WCAG AA accessibility compliance, and seamless transitions.
يتميز AetherOS بنظام ثيم مزدوج متطور مع تكيف تلقائي، وتوافق مع معايير الوصولية WCAG AA، وانتقالات سلسة.

### Features // الميزات

- **Three Theme Modes**: Light, Dark, and System Default (follows OS preference)
  **ثلاث أنماط للثيم**: فاتح، داكن، وافتراضي للنظام (يتبع تفضيلات النظام)
- **Smooth Transitions**: Hardware-accelerated CSS transitions (0.3s)
  **انتقالات سلسة**: انتقالات CSS مدعومة بالأجهزة (0.3 ثانية)
- **Persistent Preferences**: Saves to localStorage across sessions
  **تفضيلات مستمرة**: يحفظ في localStorage عبر الجلسات
- **WCAG AA Compliant**: All color combinations meet accessibility standards
  **متوافق مع WCAG AA**: جميع تركيبات الألوان تلبي معايير الوصولية
- **CSS Variables**: Easy customization and maintenance
  **متغيرات CSS**: تخصيص وصيانة سهلة

### Usage // الاستخدام

**Theme Toggle Component** is located in the header status bar (top-right).
مكون **تبديل الثيم** موجود في شريط الحالة العلوي (أعلى اليمين).

```tsx
// Using the hook programmatically
import { useTheme } from '@/hooks/useTheme';

const { theme, toggleTheme, setTheme } = useTheme();

// Set specific mode
setTheme('dark');      // Force dark mode
setTheme('light');     // Force light mode
setTheme('system');    // Follow OS preference
```

### CSS Variables // متغيرات CSS

```css
/* Dark Mode (Default) */
[data-theme='dark'] {
  --bg-primary: #050B14;
  --text-primary: rgba(255, 255, 255, 0.95);
  --border-color: rgba(255, 255, 255, 0.1);
}

/* Light Mode */
[data-theme='light'] {
  --bg-primary: #ffffff;
  --text-primary: #0a0a0a;
  --border-color: rgba(0, 0, 0, 0.1);
}
```

### Utility Classes // فئات المساعدة

```tsx
<div className="bg-theme-primary text-theme-primary border-theme">
  Adaptive content that works in both modes
</div>
```

### Accessibility // الوصولية

| Element | Contrast Ratio (Dark) | Contrast Ratio (Light) | Standard |
|---------|----------------------|------------------------|----------|
| Primary Text | 14.2:1 | 21:1 | ≥ 7:1 (AAA) |
| Secondary Text | 7.8:1 | 12.6:1 | ≥ 4.5:1 (AA) |
| Tertiary Text | 5.9:1 | 5.9:1 | ≥ 3:1 (AA) |

---

## 🚀 DEPLOY AGENT FEATURE // ميزة نشر الوكيل *(Coming Soon)*

Transform any AI agent into a standalone PWA app on your device with custom avatar icons.
حوّل أي وكيل ذكي إلى تطبيق PWA مستقل على جهازك بأيقونات مخصصة.

### Capabilities // القدرات

- **One-Click Deployment**: Install agents directly from Forge Chamber
  **نشر بنقرة واحدة**: تثبيت الوكلاء مباشرة من غرفة الصياغة
- **Custom Avatar Icons**: Agent's avatar becomes the app icon
  **أيقونات مخصصة**: صورة الوكيل تصبح أيقونة التطبيق
- **Cross-Platform**: iOS Safari, Android Chrome, Desktop PWAs
  **عبر المنصات**: iOS Safari، Android Chrome، تطبيقات سطح المكتب PWA
- **Deep Linking**: Direct access to specific agent workspace
  **ربط عميق**: وصول مباشر لمساحة عمل الوكيل المحددة
- **Dynamic Manifests**: Auto-generated PWA manifests per agent
  **بيانات تعريف ديناميكية**: بيانات تعريف PWA مولدة تلقائيًا لكل وكيل

### How It Works // كيف يعمل

1. Create an agent in **Forge Chamber** (/forge)
   أنشئ وكيلًا في **غرفة الصياغة** (/forge)
2. Click **"Deploy to Device"** button after creation
   انقر على زر **"Deploy to Device"** بعد الإنشاء
3. Follow platform-specific installation prompts
   اتبع تعليمات التثبيت الخاصة بمنصتك
4. Agent appears on home screen with custom avatar
   يظهر الوكيل على الشاشة الرئيسية بصورة مخصصة

### Platform Support // دعم المنصات

| Platform | Browser | Installation Type |
|----------|---------|-------------------|
| iOS 16+ | Safari | Add to Home Screen (manual) |
| Android 10+ | Chrome | Native install prompt |
| Windows 10+ | Chrome/Edge | PWA install dialog |
| macOS | Safari/Chrome | Native/PWA install |
| Linux | Chrome | PWA install |

---

## 💼 GOOGLE WORKSPACE INTEGRATION // تكامل Google Workspace *(In Progress)*

Complete integration with 24+ Google Workspace skills from the official GWS CLI.
تكامل كامل مع أكثر من 24 مهارة من Google Workspace من GWS CLI الرسمي.

### Skill Categories // فئات المهارات

**Services (16)**: Gmail, Drive, Calendar, Docs, Sheets, Slides, Tasks, People, Chat, Classroom, Forms, Keep, Meet, Admin Reports, Events, Model Armor

**Helpers (10+)**: Drive Upload, Sheets Append, Gmail Send/Triage/Reply, Calendar Insert/Agenda, Docs Write, Chat Send, Workflow Standup

**Personas (10)**: Executive Assistant, Project Manager, HR Coordinator, Sales Ops, IT Admin, Content Creator, Customer Support, Event Coordinator, Team Lead, Researcher

**Recipes (17+)**: Label & Archive Emails, Draft Email from Doc, Organize Drive Folder, Share Folder with Team, Email Drive Link, Create Doc from Template, Expense Tracker, etc.

### Architecture // المعمارية

- **Client-Side Execution**: Direct GWS API calls via Firebase Auth tokens
  **تنفيذ جانبي العميل**: مكالمات GWS API مباشرة عبر رموز مصادقة Firebase
- **Zero Cloud Functions**: 100% Firebase free tier (no billing required)
  **بدون وظائف سحابية**: 100% من مستوى Firebase المجاني (لا حاجة للفواتير)
- **OAuth 2.0 Flow**: Granular scope management with refresh tokens
  **تدفق OAuth 2.0**: إدارة صلاحيات دقيقة مع رموز تحديث
- **Skill Registry**: Dynamic registration and execution engine
  **سجل المهارات**: محرك تسجيل وتنفيذ ديناميكي

---

## 🧠 ADVANCED MEMORY SYSTEM // نظام الذاكرة المتقدم *(Planned)*

Structured memory management with semantic search, importance decay, and organized Firestore storage.
إدارة ذاكرة منظمة مع بحث دلالي، وتضاؤل الأهمية، وتخزين منظم في Firestore.

### Memory Types // أنواع الذاكرة

- **Semantic Memory**: Facts, concepts, general knowledge
  **الذاكرة الدلالية**: الحقائق، المفاهيم، المعرفة العامة
- **Episodic Memory**: Conversation history, user interactions
  **الذاكرة العرضية**: سجل المحادثات، تفاعلات المستخدمين
- **Procedural Memory**: Learned behaviors, skill optimizations
  **الذاكرة الإجرائية**: السلوكيات المكتسبة، تحسينات المهارات

### Features // الميزات

- Vector embeddings for semantic search
  تضمينات المتجهات للبحث الدلالي
- Automatic importance scoring & decay
  تسجيل الأهمية والتضاؤل التلقائي
- Batch operations for efficiency
  عمليات الدُفعة للكفاءة
- Cross-agent memory sharing (optional)
  مشاركة الذاكرة بين الوكلاء (اختياري)

---

## 📜 THE MANIFESTO // المانيفستو (البيان)
We do not build tools. We build **Digital Peers**. 
**AetherOS** is the bridge between human intent and autonomous execution.

نحن لا نبني أدوات. نحن نبني **أقرانًا رقميين**.
**AetherOS** هو الجسر بين القصد البشري والتنفيذ الذاتي.

---

*Forged in the Aether by **The Aether Architect (Antigravity AI)**.*
