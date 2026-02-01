import * as XLSX from 'xlsx';
import type { SheetData, SheetRow } from '../types';

// Helper function to convert the workbook to a downloadable binary format
function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

export function convertToOurFormat(data: any): Record<string, SheetData> {
  const createSheetData: Record<string, SheetData> = {};

  const workbook = XLSX.read(data, { type: 'binary' });

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      createSheetData[sheetName] = {
        name: sheetName,
        headers: [],
        data: []
      };
      return;
    }

    const [headers, ...dataRows] = jsonData;
    const typedHeaders: string[] = headers.map(h => String(h));

    const formattedData: SheetRow[] = dataRows.map(row => {
      const rowData: SheetRow = {};
      typedHeaders.forEach((header, index) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowData[header] = (row[index] as any) || null;
      });
      return rowData;
    });

    createSheetData[sheetName] = {
      name: sheetName,
      headers: typedHeaders,
      data: formattedData
    };
  });

  return createSheetData;
}

export function directDownloadWorkbook({ newSheet1Data, newSheet2Data }: { newSheet1Data: SheetRow[], newSheet2Data: SheetRow[] }, fileName: string = 'data_export') {
  const worksheet1 = XLSX.utils.json_to_sheet(newSheet1Data);
  const worksheet2 = XLSX.utils.json_to_sheet(newSheet2Data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet1, 'Results1');
  XLSX.utils.book_append_sheet(workbook, worksheet2, 'Results2');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'binary'
  });

  const buffer = s2ab(excelBuffer);
  const blob = new Blob([buffer], {
    type: 'application/octet-stream'
  });

  const link = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
