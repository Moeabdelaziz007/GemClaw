import { GoogleGenerativeAI } from "@google/generative-ai";
import { Anthropic } from "@anthropic-ai/sdk";
import OpenAI from "openai";

export type NeuralProvider = "google" | "anthropic" | "deepseek" | "openai";

export interface NeuralMessage {
  role: "user" | "assistant" | "system";
  content: string;
  name?: string;
}

export interface NeuralOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  streaming?: boolean;
}

export interface NeuralResponse {
  id: string;
  text: string;
  model: string;
  provider: NeuralProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs?: number;
}

export class NeuralRouter {
  private googleAI?: GoogleGenerativeAI;
  private anthropic?: Anthropic;
  private deepseek?: OpenAI;

  constructor() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    if (geminiKey) {
      this.googleAI = new GoogleGenerativeAI(geminiKey);
    }
    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }
    if (deepseekKey) {
      this.deepseek = new OpenAI({
        apiKey: deepseekKey,
        baseURL: "https://api.deepseek.com",
      });
    }
  }

  async generate(
    provider: NeuralProvider,
    messages: NeuralMessage[],
    options: NeuralOptions = {}
  ): Promise<NeuralResponse> {
    const startTime = Date.now();

    switch (provider) {
      case "google":
        return this.generateGoogle(messages, options, startTime);
      case "anthropic":
        return this.generateAnthropic(messages, options, startTime);
      case "deepseek":
        return this.generateDeepSeek(messages, options, startTime);
      default:
        throw new Error(`Provider ${provider} not supported.`);
    }
  }

  private async generateGoogle(
    messages: NeuralMessage[],
    options: NeuralOptions,
    startTime: number
  ): Promise<NeuralResponse> {
    if (!this.googleAI) throw new Error("Google AI not configured inside Cloud Function.");
    
    const modelName = options.model || "gemini-2.0-flash-exp";
    const model = this.googleAI.getGenerativeModel({ model: modelName });
    
    const systemInstruction = messages.find(m => m.role === "system")?.content;
    const history = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    // For generateContent, we need to handle the history correctly
    // If the last message is from the user, it should be the prompt, and the rest is history.
    const lastMessage = history.pop();
    
    if (!lastMessage) throw new Error("No messages found in history.");

    const result = await model.generateContent({
      contents: history,
      systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
    });

    const response = await result.response;
    const text = response.text();

    return {
      id: `google-${Date.now()}`,
      text,
      model: modelName,
      provider: "google",
      latencyMs: Date.now() - startTime,
    };
  }

  private async generateAnthropic(
    messages: NeuralMessage[],
    options: NeuralOptions,
    startTime: number
  ): Promise<NeuralResponse> {
    if (!this.anthropic) throw new Error("Anthropic AI not configured.");

    const modelName = options.model || "claude-3-5-sonnet-20241022";
    const system = messages.find(m => m.role === "system")?.content;
    const anthropicMessages = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }));

    const msg = await this.anthropic.messages.create({
      model: modelName,
      max_tokens: options.maxTokens || 4096,
      system,
      messages: anthropicMessages,
      temperature: options.temperature,
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '';

    return {
      id: msg.id,
      text,
      model: modelName,
      provider: "anthropic",
      usage: {
        promptTokens: msg.usage.input_tokens,
        completionTokens: msg.usage.output_tokens,
        totalTokens: msg.usage.input_tokens + msg.usage.output_tokens,
      },
      latencyMs: Date.now() - startTime,
    };
  }

  private async generateDeepSeek(
    messages: NeuralMessage[],
    options: NeuralOptions,
    startTime: number
  ): Promise<NeuralResponse> {
    if (!this.deepseek) throw new Error("DeepSeek AI not configured.");

    const modelName = options.model || "deepseek-chat";
    const completion = await this.deepseek.chat.completions.create({
      model: modelName,
      messages: messages as any[],
      temperature: options.temperature,
      max_tokens: options.maxTokens,
    });

    return {
      id: completion.id,
      text: completion.choices[0].message.content || "",
      model: modelName,
      provider: "deepseek",
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
      latencyMs: Date.now() - startTime,
    };
  }
}
