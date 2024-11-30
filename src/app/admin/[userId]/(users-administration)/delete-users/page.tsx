"use client"
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const ExcelDeleteUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const params = useParams()
    const userId = params.userId as string

    const router = useRouter();

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    // Handle file upload and deletion logic
    const handleFileUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result;

            if (result && typeof result !== 'string') {
                const data = new Uint8Array(result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Parse the Excel file and extract userIds
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Convert it to an array of user IDs
                const userIds = jsonData.slice(1).map((row: any) => ({ userId: row[0] }));
                console.log(JSON.stringify(userIds) )
                try {
                    // Send request to delete users by userId
                    const response = await axios.post('/api/auth/delete-users',  { userId: userIds }, {
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.status === 200) {
                        alert('Users deleted successfully');
                        setIsDeleted(true);
                        // router.push(`/admin/${userId}/view-users`)
                        console.log('Users deleted successfully');
                    } else {
                        alert('Failed to delete users');
                        console.error('Failed to delete users');
                    }
                } catch (error) {
                    console.error('Error deleting users:', error);
                    setError("Error deleting Users")
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // UI for displaying success or error message after file processing
    if (isDeleted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg-lg shadow-md max-w-md w-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Users Deleted Successfully</h2>
                        <p className="mb-6 text-gray-600">Your Excel file has been processed, and the users have been deleted.</p>
                        <p className="text-gray-700">
                            Deleted file: <span className="font-medium">{file?.name}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Main UI for selecting and uploading the Excel file
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Delete Users via Excel</h2>
                <p className="mb-6 text-center text-gray-600">Upload an Excel file with user IDs to delete users</p>

                <div
                    className={`border-2 border-dashed rounded-lg-lg p-6 text-center cursor-pointer transition ${file ? 'border-red-500 bg-red-50' : 'border-gray-400 hover:border-gray-500'
                        }`}
                >
                    {!file && (
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                    )}
                    <label htmlFor="file-upload" className="block">
                        {file ? (
                            <div className="flex items-center justify-center">
                                <p className="text-red-700">
                                    Selected: <span className="font-medium">{file.name}</span>
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600">Choose a file or drag & drop it here</p>
                                <p className="text-gray-500 text-sm mt-1">Excel files (.xlsx, .xls) only</p>
                            </>
                        )}
                    </label>
                </div>

                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleFileUpload}
                        className={`py-2 px-4 rounded-lg-md transition ${file
                            ? 'bg-red-500 text-white w-1/2 hover:bg-red-600'
                            : 'bg-gray-300 text-gray-500 w-full cursor-not-allowed'
                            }`}
                        disabled={!file}
                    >
                        Delete Users
                    </button>
                    {file && (
                        <button
                            type="button"
                            className="w-1/2 ml-4 bg-red-100 text-red-600 py-2 px-4 rounded-lg-md hover:bg-red-200 transition"
                            onClick={() => {
                                setFile(null);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExcelDeleteUploader;
