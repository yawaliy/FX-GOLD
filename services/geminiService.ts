import { GoogleGenAI } from "@google/genai";

// Ideally, this is set in the environment variables. 
// For this demo, we assume process.env.API_KEY is available.
const API_KEY = process.env.API_KEY || '';

let genAI: GoogleGenAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenAI({ apiKey: API_KEY });
}

export const getMarketAdvice = async (
  query: string, 
  context: string
): Promise<string> => {
  if (!genAI) {
    return "AI Service is not configured (Missing API Key).";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are FX AI, a senior financial analyst for FX Gold & Jewelry. 
    You are an expert in gold trading, forex (especially NGN/USD), and luxury investment.
    Keep your answers concise, professional, yet warm and approachable.
    Use formatting like bullet points for clarity. 
    Current Market Context provided: ${context}
    `;

    const response = await genAI.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the market data server right now.";
  }
};