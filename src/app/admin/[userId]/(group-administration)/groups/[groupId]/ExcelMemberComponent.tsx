import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface ExcelMemberComponentProps {
    onClose: () => void;
}

const ExcelMemberComponent: React.FC<ExcelMemberComponentProps> = ({ onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const params = useParams();
    const userId = params.userId as string;
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

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
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                try {
                    // Send the members array as payload
                    const response = await axios.post('/api/groups/upload-members', {
                        members: jsonData, // Ensure jsonData is an array
                    });

                    if (response.status === 201) {
                        setMessage('Group members Upload successfully');
                        setTimeout(() => {
                            onClose();
                            router.push(`/admin/${userId}/dashboard`);
                        }, 2000);
                    } else {
                        alert('Failed to upload group members');
                        console.error('Failed to upload data');
                    }
                } catch (error) {
                    console.error('Error uploading data:', error);
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center dark:bg-[#212830] bg-opacity-50">
            <div className="w-full max-w-md mx-auto bg-white dark:bg-[#151b23] p-8 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-6">Remove Group Members</h1>
                {message && <p className="text-green-500 mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                            Upload Excel File
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition">
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <p className="text-gray-600 dark:text-gray-300">Choose a file or drag & drop it here</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Excel files (.xlsx, .xls) only</p>
                            </label>
                        </div>
                    </div>
                    {file && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Selected file: <span className="font-medium">{file.name}</span>
                        </p>
                    )}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleFileUpload}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                        >
                            Upload Members
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ExcelMemberComponent;