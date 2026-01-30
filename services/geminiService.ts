import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fixJsonWithGemini = async (invalidJson: string, errorMessage: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const prompt = `
      You are a JSON repair expert. 
      The following JSON is invalid. 
      Error message: "${errorMessage}".
      
      Please return ONLY the fixed, valid JSON string. 
      Do not include any markdown formatting, backticks, or explanations. 
      Just the raw JSON string.
      
      Invalid JSON:
      ${invalidJson}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "{}";
    // Clean up if model adds markdown accidentally
    return text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  } catch (error) {
    console.error("Gemini fix failed:", error);
    throw error;
  }
};

export const generateSampleJson = async (topic: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const prompt = `
      Generate a complex, nested sample JSON object about "${topic}".
      Include arrays, numbers, booleans, and nested objects.
      Return ONLY the valid JSON string. No markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "{}";
    return text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  } catch (error) {
    console.error("Gemini generate failed:", error);
    throw error;
  }
};
