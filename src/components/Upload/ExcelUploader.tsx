// app/components/ExcelUploader.tsx
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelUploader = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;

        // Ensure that result is not null and is an ArrayBuffer
        if (result && typeof result !== 'string') {
          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Send the data to the API
          try {
            const response = await fetch('/api/auth/create-user/excel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(jsonData),
            });

            if (response.ok) {
              console.log('Data uploaded successfully');
            } else {
              console.error('Failed to upload data');
            }
          } catch (error) {
            console.error('Error uploading data:', error);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default ExcelUploader;
