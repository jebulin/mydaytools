import type { ColumnFormData, SheetRow, ProcessedResult } from "../types";

export default function processSheet(data: ColumnFormData): ProcessedResult {
  const {
    uniqueColumn,
    comparisonColumn,
    uniqueColumnSheet2,
    comparisonColumnSheet2,
    sheet1Name,
    sheet2Name,
    sheetData
  } = data;

  if (!sheetData || !sheetData[sheet1Name] || !sheetData[sheet2Name]) {
    throw new Error("Invalid sheet data provided");
  }

  const sheet1Data: SheetRow[] = sheetData[sheet1Name].data;
  const sheet2Data: SheetRow[] = sheetData[sheet2Name].data;

  const newSheet1Data: SheetRow[] = [];
  const newSheet2Data: SheetRow[] = [];

  // Create a map for faster lookup of sheet2 data
  // Key is the unique column value, Value is the row
  const sheet2Map = new Map<string | number, SheetRow>();

  for (const row of sheet2Data) {
    const key = row[uniqueColumnSheet2] as string | number;
    if (key !== undefined && key !== null) {
      sheet2Map.set(key, row);
    }
  }

  for (const sheet1Row of sheet1Data) {
    const uniqueVal = sheet1Row[uniqueColumn] as string | number;
    const match = sheet2Map.get(uniqueVal);

    if (match && match[comparisonColumnSheet2] == sheet1Row[comparisonColumn]) {
      newSheet1Data.push({ ...sheet1Row, Match: 'Yes' });
      // We might want to mark this match as used if we only want 1:1 matching, 
      // but keeping original logic for now which seems to just check existence.
      // Actually, original logic pushed to newSheet2Data every time a match was found for sheet1Row.
      // This might duplicate rows in newSheet2Data if multiple sheet1Rows match the same sheet2Row.
      // Assuming 1:1 or N:1 is acceptable based on original code.
      // However, to avoid duplicates in newSheet2Data if we iterate sheet1, we should be careful.
      // The original code pushed to newSheet2Data inside the loop over sheet1. 
      // This means if 5 rows in sheet1 match the same row in sheet2, that row appears 5 times in newSheet2Data.
      // I will preserve this behavior for now to avoid breaking changes, but it's worth noting.
      newSheet2Data.push({ ...match, Match: 'Yes' });
    } else {
      newSheet1Data.push({ ...sheet1Row, Match: 'No' });
      if (match) {
        newSheet2Data.push({ ...match, Match: 'No' });
      }
    }
  }

  return { newSheet1Data, newSheet2Data };
}

