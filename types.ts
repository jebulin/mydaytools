export enum EditorMode {
  Input = 'input',
  Output = 'output',
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  count?: number;
}

export enum ViewMode {
  Split = 'SPLIT',
  Unified = 'UNIFIED'
}

export enum DiffMethod {
  Chars = 'CHARS',
  Words = 'WORDS',
  Lines = 'LINES'
}

export enum ConversionMode {
  ENCODE = 'ENCODE',
  DECODE = 'DECODE',
}

export enum StringType {
  FULL_URL = 'FULL_URL',
  COMPONENT = 'COMPONENT',
}

export interface ParsedUrlData {
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string>;
}


export interface SheetRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface SheetData {
  name: string;
  data: SheetRow[];
  headers: string[];
}

export interface ColumnFormData {
  uniqueColumn: string;
  comparisonColumn: string;
  uniqueColumnSheet2: string;
  comparisonColumnSheet2: string;
  sheetData?: Record<string, SheetData>;
  sheet1Name: string;
  sheet2Name: string;
}

export interface ProcessedResult {
  newSheet1Data: SheetRow[];
  newSheet2Data: SheetRow[];
}
