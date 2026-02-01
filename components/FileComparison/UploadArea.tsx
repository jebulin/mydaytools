import { useState } from 'react';
import type { ColumnFormData, SheetData } from '../../types';
import ColumnForm from './ColumnForm';
import FileDropZone from './FileDropZone';
import { convertToOurFormat } from '@/services/excel';

export type UploadState = {
  file: File | null;
  isUploading: boolean;
  error: string | null;
  success: boolean;
  showColumnForm: boolean;
};

interface UploadAreaProps {
  title: string;
  description: string;
  accept: string;
  onFileSelect: (file: File) => void;
  uploadState: UploadState;
  onUpload: () => void;
  onColumnSubmit: (data: ColumnFormData) => void;
  onClear: () => void;
}

export default function UploadArea({
  title,
  description,
  accept,
  onFileSelect,
  uploadState,
  onUpload,
  onColumnSubmit,
  onClear
}: UploadAreaProps) {
  const [sheetData, setSheetData] = useState<Record<string, SheetData>>({});

  const handleFileSelect = (file: File) => {
    onFileSelect(file);
    readExcelColumns(file);
  };

  const readExcelColumns = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (typeof data === 'string') {
        const extractedData = convertToOurFormat(data);
        setSheetData(extractedData);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full h-full p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <FileDropZone
        onFileSelect={handleFileSelect}
        file={uploadState.file}
        error={uploadState.error}
        success={uploadState.success}
        accept={accept}
        isUploading={uploadState.isUploading}
        onClear={onClear}
      />

      {uploadState.file && !uploadState.success && !uploadState.isUploading && !uploadState.error && (
        <div className="flex items-center justify-center w-full mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={onUpload}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            Upload and Process
          </button>
        </div>
      )}

      {uploadState.showColumnForm && (
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <ColumnForm
            onSubmit={onColumnSubmit}
            sheetNames={Object.keys(sheetData)}
            sheetData={sheetData}
          />
        </div>
      )}
    </div>
  );
}