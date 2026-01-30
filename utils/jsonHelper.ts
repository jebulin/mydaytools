import { ValidationResult } from '../types';

export const validateJson = (jsonStr: string): ValidationResult => {
  if (!jsonStr.trim()) {
    return { isValid: true };
  }
  try {
    JSON.parse(jsonStr);
    return { isValid: true };
  } catch (e: any) {
    return { isValid: false, error: e.message };
  }
};

export const beautifyJson = (jsonStr: string, indent = 2): string => {
  try {
    const obj = JSON.parse(jsonStr);
    return JSON.stringify(obj, null, indent);
  } catch (e) {
    return jsonStr; // Return original if invalid
  }
};

export const minifyJson = (jsonStr: string): string => {
  try {
    const obj = JSON.parse(jsonStr);
    return JSON.stringify(obj);
  } catch (e) {
    return jsonStr;
  }
};
