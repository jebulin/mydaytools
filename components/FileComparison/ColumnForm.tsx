import React, { useState, useEffect } from 'react';
import './ColumnForm.css';
import type { ColumnFormData, SheetData } from '../../types';
import SelectDropdown from './SelectDropdown';

interface ColumnFormProps {
  onSubmit: (data: ColumnFormData) => void;
  sheetNames: string[];
  sheetData: Record<string, SheetData>;
}

export default function ColumnForm({ onSubmit, sheetNames, sheetData }: ColumnFormProps) {
  const [formData, setFormData] = useState<ColumnFormData>({
    uniqueColumn: '',
    comparisonColumn: '',
    uniqueColumnSheet2: '',
    comparisonColumnSheet2: '',
    sheetData: sheetData,
    sheet1Name: "",
    sheet2Name: "",
  });

  const [accordion1Open, setAccordion1Open] = useState(true);
  const [accordion2Open, setAccordion2Open] = useState(false);

  const [selectedSheet, setSelectedSheet] = useState<string>(sheetNames[0] || '');
  const [selectedSheet2, setSelectedSheet2] = useState<string>(sheetNames[1] || '');

  // Auto-open Sheet 2 options when Sheet 1 options are valid
  useEffect(() => {
    if (formData.uniqueColumn && formData.comparisonColumn) {
      setAccordion1Open(false);
      setAccordion2Open(true);
    }
  }, [formData.uniqueColumn, formData.comparisonColumn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.uniqueColumn &&
      formData.comparisonColumn &&
      formData.uniqueColumnSheet2 &&
      formData.comparisonColumnSheet2
    ) {
      const finalData = {
        ...formData,
        sheetData: sheetData,
        sheet1Name: selectedSheet,
        sheet2Name: selectedSheet2
      };
      onSubmit(finalData);
    }
  };

  const handleInputChange = (field: keyof ColumnFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'uniqueColumn' ? { comparisonColumn: '' } : {}),
      ...(field === 'uniqueColumnSheet2' ? { comparisonColumnSheet2: '' } : {}),
    }));
  };

  const getHeaders = (sheet: string) => (sheetData[sheet]?.headers || []);

  return (
    <div className="column-form">
      <h4>Column Configuration</h4>
      <p>Please specify the columns for comparison:</p>

      {/* Accordion for Sheet 1 */}
      <div className="accordion">
        <button type="button" className="accordion-toggle" onClick={() => setAccordion1Open(open => !open)}>
          <span>Update Columns for Sheet 1</span>
          <span className="accordion-arrow">{accordion1Open ? '▲' : '▼'}</span>
        </button>
        {accordion1Open && (
          <div className="accordion-content">
            <SelectDropdown
              id="selectSheetDropdown1"
              label="Select sheet"
              options={sheetNames.map(name => ({ value: name, label: name }))}
              value={selectedSheet}
              onChange={setSelectedSheet}
            />
            <SelectDropdown
              id="uniqueColumnDropdown"
              label="Select Unique column"
              options={getHeaders(selectedSheet).map(h => ({ value: h, label: h }))}
              value={formData.uniqueColumn}
              onChange={value => handleInputChange('uniqueColumn', value)}
              required
              placeholder="Select column"
              smallText="This column will be used to identify unique records"
            />
            <SelectDropdown
              id="comparisonColumnDropdown"
              label="Select comparison column"
              options={getHeaders(selectedSheet)
                .filter(title => title !== formData.uniqueColumn)
                .map(h => ({ value: h, label: h }))}
              value={formData.comparisonColumn}
              onChange={value => handleInputChange('comparisonColumn', value)}
              required
              disabled={!formData.uniqueColumn}
              placeholder={formData.uniqueColumn ? 'Select column' : 'Select unique column first'}
              smallText="This column will be compared between files"
            />
          </div>
        )}
      </div>

      {/* Accordion for Sheet 2 */}
      <div className="accordion">
        <button type="button" className="accordion-toggle" onClick={() => setAccordion2Open(open => !open)}>
          <span>Update Columns for Sheet 2</span>
          <span className="accordion-arrow">{accordion2Open ? '▲' : '▼'}</span>
        </button>
        {accordion2Open && (
          <div className="accordion-content">
            <SelectDropdown
              id="selectSheetDropdown2"
              label="Select sheet"
              options={sheetNames.filter(name => name !== selectedSheet).map(name => ({ value: name, label: name }))}
              value={selectedSheet2}
              onChange={setSelectedSheet2}
            />
            <SelectDropdown
              id="uniqueColumnDropdownSheet2"
              label="Select unique column from Sheet 2"
              options={getHeaders(selectedSheet2).map(h => ({ value: h, label: h }))}
              value={formData.uniqueColumnSheet2}
              onChange={value => handleInputChange('uniqueColumnSheet2', value)}
              required
              placeholder="Select column"
              smallText="This column will be used to identify unique records in Sheet 2"
            />
            <SelectDropdown
              id="comparisonColumnDropdownSheet2"
              label="Select comparison column"
              options={getHeaders(selectedSheet2)
                .filter(title => title !== formData.uniqueColumnSheet2)
                .map(h => ({ value: h, label: h }))}
              value={formData.comparisonColumnSheet2}
              onChange={value => handleInputChange('comparisonColumnSheet2', value)}
              required
              disabled={!formData.uniqueColumnSheet2}
              placeholder={formData.uniqueColumnSheet2 ? 'Select column' : 'Select unique column first'}
              smallText="This column will be compared between files"
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Compare
        </button>
      </div>
    </div>
  );
}