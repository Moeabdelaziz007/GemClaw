'use server';

import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import JSZip from 'jszip';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// Helper to check if a file is binary or should be ignored
function shouldIgnore(filename: string): boolean {
  const ignorePatterns = [
    'node_modules/', '.git/', 'dist/', 'build/', '.next/', 'coverage/',
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
    '.mp3', '.wav', '.ogg', '.mp4', '.webm',
    '.pdf', '.zip', '.tar', '.gz', '.ttf', '.woff', '.woff2', '.eot',
  ];
  return ignorePatterns.some(pattern => filename.includes(pattern));
}

export async function analyzeRepository(repoUrl: string) {
  try {
    // Parse GitHub URL (e.g., https://github.com/Moeabdelaziz007/Aether-Voice-OS)
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL');
    }
    const owner = match[1];
    const repo = match[2];

    // Fetch the repository zipball
    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/main`;
    const response = await fetch(zipUrl, {
      headers: {
        'User-Agent': 'Aether-Voice-OS-Analyzer',
      },
    });

    let buffer: ArrayBuffer;
    if (!response.ok) {
      // Try master branch if main fails
      const zipUrlMaster = `https://api.github.com/repos/${owner}/${repo}/zipball/master`;
      const responseMaster = await fetch(zipUrlMaster, {
        headers: { 'User-Agent': 'Aether-Voice-OS-Analyzer' },
      });
      if (!responseMaster.ok) {
        throw new Error(`Failed to fetch repository: ${responseMaster.statusText}`);
      }
      buffer = await responseMaster.arrayBuffer();
    } else {
      buffer = await response.arrayBuffer();
    }

    // Unzip in memory
    const zip = await JSZip.loadAsync(buffer);
    let combinedCode = '';
    let fileCount = 0;

    for (const [filename, file] of Object.entries(zip.files)) {
      if (file.dir || shouldIgnore(filename)) continue;

      // Extract the actual path (GitHub zipballs have a root folder like owner-repo-hash/)
      const actualPath = filename.split('/').slice(1).join('/');
      if (!actualPath) continue;

      try {
        const content = await file.async('string');
        combinedCode += `\n\n--- File: ${actualPath} ---\n\`\`\`\n${content}\n\`\`\`\n`;
        fileCount++;
      } catch (err) {
        console.warn(`Could not read file ${filename}`);
      }
    }

    if (fileCount === 0) {
      throw new Error('No readable code files found in the repository.');
    }

    // Send to Gemini with Advanced Tools and High Thinking Level
    const prompt = `
أنت مهندس معماري رئيسي للذكاء الاصطناعي والأمن السيبراني (Principal AI Architecture & Cybersecurity Engineer).
عقليتك تحليلية، هادئة، وتعتمد على المبادئ الأولى (First Principles).

الهدف: تحليل مستودع "Aether-Voice-OS" لبناء نظام تشغيل صوتي (Voice-First OS) متطور للفوز بتحدي Gemini Live Agent.
يجب أن يكون النظام "Zero-UI" (يعتمد على الصوت كلياً مع واجهة محيطية Ambient)، ويستخدم بيئة Google (Gemini Live API, Firebase, Google Workspace).

إليك الكود المصدري للمشروع بالكامل:
${combinedCode}

المطلوب منك تقديم تقرير هندسي عميق ومفصل باللغة العربية يغطي النقاط التالية:
1. تحليل الكمون (Latency Analysis): أين توجد عنق الزجاجة في مسار الصوت الحالي؟ وكيف نستبدله بـ Gemini Live API (Bidi WebSockets / PCM Audio) للوصول إلى زمن انتقال شبه معدوم؟
2. معمارية ClawHub (Dynamic Plugins): كيف نبني نظام إضافات ديناميكي باستخدام Firebase Firestore لتخزين OpenAPI Schemas واستدعائها عبر Function Calling بدون إعادة نشر الكود؟
3. الذاكرة المستمرة (Continuous Memory): كيف ندمج Firestore لتخزين سياق المستخدم وتفضيلاته وتمريرها كـ System Instructions لـ Gemini؟
4. تبسيط الواجهة (Zero-UI): ما هي المكونات (Components) الحالية التي يجب إزالتها أو تحويلها إلى متخيلات بصرية (Visualizers) بسيطة باستخدام framer-motion؟
5. خطة عمل تنفيذية (Action Plan): خطوات برمجية واضحة (1، 2، 3) للبدء في التعديل فوراً.

استخدم أداة البحث (Google Search) إذا احتجت للتأكد من أحدث توثيق لـ Gemini Multimodal Live API أو Firebase.
`;

    const genAIResponse = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير معماريات برمجيات الذكاء الاصطناعي. أجب باللغة العربية دائماً وباحترافية عالية. قدم أكواد وأمثلة دقيقة.",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }],
      }
    });

    return {
      success: true,
      analysis: genAIResponse.text,
      fileCount,
    };

  } catch (error: any) {
    console.error('Analysis error:', error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred during analysis.',
    };
  }
}
