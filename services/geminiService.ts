import { ReceiptData, ReceiptItem } from "@/types";
import { GoogleGenAI, Type, Schema } from "@google/genai";

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

// Helper to encode file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const receiptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique simplified ID for the item (e.g., 'item-1')" },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          assignedTo: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of names assigned to this item. Empty initially." }
        },
        required: ["id", "name", "price", "assignedTo"]
      }
    },
    subtotal: { type: Type.NUMBER },
    tax: { type: Type.NUMBER },
    tip: { type: Type.NUMBER, description: "Any tip explicitly listed on the receipt, otherwise 0" },
    total: { type: Type.NUMBER },
    currency: { type: Type.STRING, description: "Currency symbol, e.g., $, €, £" }
  },
  required: ["items", "subtotal", "tax", "total", "currency"]
};

export const parseReceiptImage = async (base64Image: string, mimeType: string): Promise<ReceiptData> => {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: "Analyze this receipt image. Extract all line items with their prices. Also extract the subtotal, tax, tip (if any), and grand total. If tax or tip are not explicitly separated but can be inferred, do so. Ensure numerical accuracy. Return a pure JSON object." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: receiptSchema,
        systemInstruction: "You are a precise receipt parser. Extract data exactly as it appears."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as ReceiptData;
  } catch (error) {
    console.error("Error parsing receipt:", error);
    throw error;
  }
};

const chatResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    conversationalResponse: { type: Type.STRING, description: "A friendly, short natural language response to the user confirming the action or asking for clarification." },
    updatedItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          assignedTo: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["id", "name", "price", "assignedTo"]
      },
      description: "The complete list of items, with the 'assignedTo' field updated based on the user's request."
    }
  },
  required: ["conversationalResponse", "updatedItems"]
};

export const processChatCommand = async (
  currentReceipt: ReceiptData,
  userMessage: string
): Promise<{ responseText: string; updatedReceiptItems: ReceiptItem[] }> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Current Receipt Data (JSON):
    ${JSON.stringify(currentReceipt.items)}

    User Message: "${userMessage}"

    Instructions:
    1. Interpret the user's message to assign items to people.
    2. Examples: 
       - "Tom had the burger" -> Find item "Burger" and add "Tom" to assignedTo.
       - "Sarah and Mike shared the pizza" -> Add "Sarah" and "Mike" to assignedTo for "Pizza".
       - "Remove Tom from the beer" -> Remove "Tom" from assignedTo for "Beer".
       - "Everything else is mine" -> Assign all currently unassigned items to "Me" (or the speaker).
    3. Return the FULL updated list of items in the JSON response. Do not miss any items.
    4. Provide a polite, brief conversational confirmation in 'conversationalResponse'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
        systemInstruction: "You are a helpful bill splitter assistant. Maintain the state of the receipt accurately."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const data = JSON.parse(text);
    return {
      responseText: data.conversationalResponse,
      updatedReceiptItems: data.updatedItems
    };
  } catch (error) {
    console.error("Error processing chat:", error);
    throw error;
  }
};
