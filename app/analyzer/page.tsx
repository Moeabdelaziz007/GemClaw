'use client';

import { useState, useEffect } from 'react';
import { analyzeRepository } from '@/lib/tools/repo-analyzer';
import { Loader2, Github, Search, Code2, Cpu, Zap, Terminal, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "جاري الاتصال بمستودع GitHub...",
  "يتم سحب وفك ضغط الملفات البرمجية...",
  "تجميع وتحليل هيكلة Aether-Voice-OS...",
  "تفعيل نموذج Gemini 3.1 Pro (مستوى التفكير العميق)...",
  "البحث في توثيقات Google Ecosystem (Live API & Firebase)...",
  "صياغة التقرير المعماري النهائي..."
];

export default function AnalyzerPage() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/Moeabdelaziz007/Aether-Voice-OS');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<{ analysis?: string; fileCount?: number; error?: string } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 4000); // Change step every 4 seconds to simulate deep analysis
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setIsAnalyzing(true);
    setResult(null);
    setLoadingStep(0);

    try {
      const res = await analyzeRepository(repoUrl);
      if (res.success) {
        setResult({ analysis: res.analysis, fileCount: res.fileCount });
      } else {
        setResult({ error: res.error });
      }
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-50 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header - Editorial / Technical Vibe */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center md:text-right"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20 uppercase tracking-widest">
            <Cpu className="w-4 h-4" />
            <span>Aether OS Architecture Analyzer</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            مُحلل النواة <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">العميق</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto md:mx-0 text-lg md:text-xl leading-relaxed font-light">
            أداة هندسية متقدمة تستخدم <strong>Gemini 3.1 Pro</strong> مع مستوى تفكير عالٍ (High Thinking) وأدوات بحث حية لتحليل مستودعك، واكتشاف ثغرات الكمون، وتصميم بنية ClawHub الديناميكية.
          </p>
        </motion.div>

        {/* Input Form - Hardware / Specialist Tool Vibe */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleAnalyze} 
          className="relative group"
          dir="ltr"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-50"></div>
          <div className="relative flex flex-col md:flex-row gap-4 bg-[#111111] p-4 rounded-2xl border border-neutral-800 shadow-2xl">
            <div className="relative flex-1 flex items-center">
              <Github className="absolute left-4 w-5 h-5 text-neutral-500" />
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Initialize Scan</span>
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
              dir="rtl"
            >
              <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4 text-emerald-400 mb-6">
                  <Terminal className="w-6 h-6 animate-pulse" />
                  <span className="font-mono text-sm tracking-widest uppercase">System Processing</span>
                </div>
                <div className="space-y-4">
                  {LOADING_STEPS.map((step, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-4 transition-all duration-500 ${index === loadingStep ? 'text-white opacity-100' : index < loadingStep ? 'text-emerald-500 opacity-70' : 'text-neutral-700 opacity-30'}`}
                    >
                      {index < loadingStep ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      ) : index === loadingStep ? (
                        <Loader2 className="w-5 h-5 shrink-0 animate-spin text-emerald-400" />
                      ) : (
                        <div className="w-5 h-5 shrink-0 rounded-full border-2 border-neutral-800" />
                      )}
                      <span className="font-mono text-sm md:text-base">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              dir="rtl"
            >
              {result.error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 flex items-start gap-4">
                  <Zap className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">فشل التحليل</h3>
                    <p className="text-red-400/80 font-mono text-sm">{result.error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-[#111111] p-4 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <Code2 className="w-5 h-5" />
                      <span className="font-mono text-sm">تم تحليل {result.fileCount} ملف بنجاح</span>
                    </div>
                    <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                      Gemini 3.1 Pro • High Thinking
                    </div>
                  </div>
                  
                  <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 md:p-10 shadow-2xl">
                    <div className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-cyan-400 prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-neutral-800 prose-pre:shadow-inner prose-code:text-emerald-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result.analysis || ''}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

