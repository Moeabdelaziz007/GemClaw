import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const PROMPTS = [
  "Abstract futuristic glassmorphism floating orbs in a dark void, neon cyan and purple glowing lights, highly detailed, cinematic lighting",
  "A glowing quantum core, ethereal digital neural network, dark background with glowing blue and magenta data streams, 3D render, masterpiece",
  "Abstract dark background with smooth flowing liquid glass, neon edge lighting, cybernetic aesthetic, minimal, elegant"
];

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public');
  const images = ['hero1.png', 'hero2.png', 'hero3.png'];
  
  // Check if all images exist
  const allExist = images.every(img => fs.existsSync(path.join(publicDir, img)));
  
  if (allExist) {
    return NextResponse.json({ images: images.map(img => `/${img}`) });
  }

  // Generate missing images
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key found" }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey });

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const generatedUrls = [];

  for (let i = 0; i < PROMPTS.length; i++) {
    const file = images[i];
    const filePath = path.join(publicDir, file);
    
    if (!fs.existsSync(filePath)) {
      try {
        const res = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: PROMPTS[i],
          config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
        });
        
        const parts = res.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync(filePath, buffer);
            break;
          }
        }
      } catch (err) {
        console.error(`Error generating ${file}:`, err);
      }
    }
    
    if (fs.existsSync(filePath)) {
      generatedUrls.push(`/${file}`);
    }
  }

  return NextResponse.json({ images: generatedUrls });
}
