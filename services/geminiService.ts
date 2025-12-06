import { GoogleGenAI } from "@google/genai";
import { PlanetData } from "../types";

// Initialize Gemini
// Note: In a real production app, this should be handled securely on the backend.
// For this frontend-only demo, we use the env variable.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generatePlanetFunFact = async (planet: PlanetData): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure process.env.API_KEY.";
  }

  try {
    const prompt = `请用生动有趣的语言，为${planet.name}（${planet.enName}）生成一个鲜为人知的趣味冷知识。长度控制在50字以内。`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "暂时无法获取数据。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 暂时休息中，请稍后再试。";
  }
};

export const chatWithPlanet = async (planetName: string, userQuestion: string): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured.";
  }

  try {
    const systemInstruction = `你现在扮演太阳系中的${planetName}。请用第一人称（“我”）来回答用户的问题。
    你的性格要符合该星球的特点（例如：火星热情、土星优雅、木星威严、太阳温暖但威慑）。
    回答要科普且有趣，适合大众阅读。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuestion,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "我似乎没听清你说什么。";
  } catch (error) {
    console.error("Chat Error:", error);
    return "我的信号受到太阳风干扰，请稍后再试。";
  }
};
