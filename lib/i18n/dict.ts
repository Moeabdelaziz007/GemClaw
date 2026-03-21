// 🧬 GemigramOS Sovereign Dictionary
// Version: 1.0 (2026-03-21)

export type Locale = 'en' | 'ar';

export const translations = {
  en: {
    common: {
      loading: "Initializing Neural Link...",
      error: "System Dysfunction Detected",
      save: "Seal Changes",
      cancel: "Abort",
      delete: "Purge",
      deploy: "Materialize",
      connected: "Neural Link Active",
      disconnected: "Neural Link Severed",
    },
    dashboard: {
      title: "Sovereign Command Center",
      subtitle: "Neural Orchestration Hub",
      activeAgents: "Active Entities",
      memoryUsage: "Cognitive Load",
      latency: "Neural Lag",
      tokenBudget: "Energy Credits",
    },
    forge: {
      title: "Neural Synthesis Chamber",
      description: "Materialize a new specialized Sovereign Intelligence.",
      step1: "Ignition",
      step11: "Deployment",
    },
    settings: {
      title: "System Parameters",
      security: "Shield Hardening",
      apiKeys: "Neural Credentials",
      identity: "Sovereign Identity",
    }
  },
  ar: {
    common: {
      loading: "جاري تهيئة الارتباط العصبي...",
      error: "تم اكتشاف خلل في النظام",
      save: "تثبيت التغييرات",
      cancel: "إجهاض",
      delete: "تطهير",
      deploy: "تجسيد",
      connected: "الارتباط العصبي نشط",
      disconnected: "الارتباط العصبي مقطوع",
    },
    dashboard: {
      title: "مركز القيادة السيادي",
      subtitle: "محور التنسيق العصبي",
      activeAgents: "الكيانات النشطة",
      memoryUsage: "الحمل المعرفي",
      latency: "التأخر العصبي",
      tokenBudget: "رصيد الطاقة",
    },
    forge: {
      title: "غرفة التخليق العصبي",
      description: "تجسيد ذكاء سيادي متخصص جديد.",
      step1: "الإشعال",
      step11: "النشر",
    },
    settings: {
      title: "بارامترات النظام",
      security: "تحصين الدرع",
      apiKeys: "أوراق الاعتماد العصبية",
      identity: "الهوية السيادية",
    }
  }
};

export type TranslationKey = typeof translations.en;
