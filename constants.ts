export const SAMPLE_JSON = `{
  "name": "My Day Tools",
  "version": 1.0,
  "features": [
    "Validation",
    "Beautification",
    "Minification",
    "Find & Replace"
  ],
  "aiEnabled": true,
  "settings": {
    "theme": "dark",
    "fontSize": 14
  }
}`;

export const GEMINI_MODEL_RECEIPT = 'gemini-3-flash-preview';
export const GEMINI_MODEL_CHAT = 'gemini-3-flash-preview';

export const INITIAL_SYSTEM_PROMPT = `
You are an intelligent bill-splitting assistant. 
Your goal is to parse receipts accurately and help users assign items to people using natural language.
Always return valid JSON when requested.
When parsing receipts, be precise with prices and item names.
When assigning items, listen to the user's natural language (e.g., "John had the burger") and update the list.
If a user says "Shared by X and Y", split the assignment.
`;
