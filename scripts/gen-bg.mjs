import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("No API key found in environment variables.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function gen(prompt, file) {
  // console.log(`Generating ${file}...`);
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: prompt,
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
    });
    
    const parts = res.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync(path.join(process.cwd(), 'public', file), buffer);
        // console.log(`Saved ${file}`);
        return;
      }
    }
    // console.log(`Failed to find image data for ${file}`);
  } catch (err) {
    console.error(`Error generating ${file}:`, err);
  }
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  await gen("Abstract futuristic glassmorphism floating orbs in a dark void, neon cyan and purple glowing lights, highly detailed, cinematic lighting", "hero1.png");
  await gen("A glowing quantum core, ethereal digital neural network, dark background with glowing blue and magenta data streams, 3D render, masterpiece", "hero2.png");
  await gen("Abstract dark background with smooth flowing liquid glass, neon edge lighting, cybernetic aesthetic, minimal, elegant", "hero3.png");
}

main();
