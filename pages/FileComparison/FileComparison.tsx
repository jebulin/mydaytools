import React, { useState } from 'react';
import UploadArea, { type UploadState } from '../../components/FileComparison/UploadArea';
// import './FileComparison.css'; // Removed in favor of Tailwind
import type { ColumnFormData } from '../../types';
import { directDownloadWorkbook } from '@/services/excel';
import processSheet from '@/utils/processData';
import { ArrowRightLeft } from 'lucide-react';
import SEO from '../../components/SEO';

export default function FileComparison() {
  const [upload1, setUpload1] = useState<UploadState>({
    file: null,
    isUploading: false,
    error: null,
    success: false,
    showColumnForm: false
  });

  const handleFileSelect = (file: File, setUpload: React.Dispatch<React.SetStateAction<UploadState>>) => {
    if (file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      setUpload(prev => ({ ...prev, file, error: null, success: false, showColumnForm: false }));
    } else {
      setUpload(prev => ({ ...prev, error: 'Please select a valid Excel file (.xlsx or .xls)' }));
    }
  };

  const handleUpload = async (upload: UploadState, setUpload: React.Dispatch<React.SetStateAction<UploadState>>) => {
    if (!upload.file) return;
    setUpload(prev => ({ ...prev, isUploading: true, error: null }));
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Uploading file:', upload.file.name);
      setUpload(prev => ({
        ...prev,
        isUploading: false,
        success: true,
        showColumnForm: true
      }));
    } catch (error) {
      setUpload(prev => ({ ...prev, isUploading: false, error: 'Upload failed. Please try again.' }));
    }
  };

  const handleClear = (setUpload: React.Dispatch<React.SetStateAction<UploadState>>) => {
    setUpload({
      file: null,
      isUploading: false,
      error: null,
      success: false,
      showColumnForm: false
    });
  };

  const handleColumnSubmit = (data: ColumnFormData, isFile1: boolean) => {
    // Logic to handle column submission for each file
    // For now, we'll just log it or handle it as before
    // setUpload... showColumnForm: false
    if (isFile1) {
      setUpload1(prev => ({ ...prev, showColumnForm: false }));
    }

    // Example processing (needs to be adapted for two files comparison later)
    const { newSheet1Data, newSheet2Data } = processSheet(data);
    directDownloadWorkbook({ newSheet1Data, newSheet2Data });
    console.log(`Column config for file ${isFile1 ? '1' : '2'}:`, data);
  };

  return (
    <>
      <SEO
        title="Excel File Comparison - Compare Excel Sheets Online"
        description="Upload and compare two Excel files to find differences. Secure, fast, and easy to use Excel comparison tool."
        canonical="/file-comparison"
      />
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Excel File Comparison</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Upload two Excel files to process, compare data, and identify discrepancies instantly.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* File 1 Upload */}
            <div className="flex-1 w-full">
              <UploadArea
                title="First Excel File"
                description="Upload the original or reference file"
                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onFileSelect={(file) => handleFileSelect(file, setUpload1)}
                uploadState={upload1}
                onUpload={() => handleUpload(upload1, setUpload1)}
                onColumnSubmit={(data) => handleColumnSubmit(data, true)}
                onClear={() => handleClear(setUpload1)}
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => handleClear(setUpload1)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
            >
              Reset
            </button>
          </div>

        </main>
      </div>
    </>
  );
}
