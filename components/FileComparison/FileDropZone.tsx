import React from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  error: string | null;
  success: boolean;
  accept: string;
  isUploading: boolean;
  onClear: () => void;
}

export default function FileDropZone({
  onFileSelect,
  file,
  error,
  success,
  accept,
  isUploading,
  onClear
}: FileDropZoneProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.includes('excel') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getBorderColor = () => {
    if (error) return 'border-red-500 bg-red-50 dark:bg-red-900/10';
    if (success) return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10';
    if (file) return 'border-blue-500 bg-blue-50 dark:bg-blue-900/10';
    return 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50';
  };

  return (
    <div className="relative group w-full">
      <div
        className={`relative flex flex-col items-center justify-center min-h-[200px] p-8 text-center border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${getBorderColor()}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !file && document.getElementById('file-upload')?.click()}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={!!file || isUploading}
          style={{ display: 'none' }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uploading...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{file?.name}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Upload Complete</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Upload Failed</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <FileSpreadsheet className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white break-all max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Excel files only (.xlsx, .xls)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
