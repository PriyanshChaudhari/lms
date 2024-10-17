import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

interface ExcelMemberComponentProps {
    onClose: () => void;
}

const ExcelMemberComponent: React.FC<ExcelMemberComponentProps> = ({ onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [actionType, setActionType] = useState<'upload' | 'remove'>('upload');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const params = useParams();
    const userId = params.userId as string;
    const groupId = params.groupId as string;
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

        setIsUploading(true);

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
                    let response;

                    if (actionType === 'upload') {
                        response = await axios.post('/api/groups/upload-members', {
                            members: jsonData,
                        });
                    } else if (actionType === 'remove') {
                        response = await axios.delete('/api/groups/upload-members', {
                            data: { members: jsonData },
                        });
                    }

                    if (response?.status === 201) {
                        setMessage(
                            actionType === 'upload'
                                ? 'Group members uploaded successfully'
                                : 'Group members removed successfully'
                        );
                    } else {
                        setError(
                            actionType === 'upload'
                                ? 'Failed to upload group members'
                                : 'Failed to remove group members'
                        );
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setError('An error occurred while processing the request.');
                } finally {
                    setIsUploading(false);
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-50 dark:bg-[#151b23] p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Manage Group Members</h2>
                <p className="mb-6 text-center text-gray-600">Select action and upload the Excel file</p>

                {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <select
                        value={actionType}
                        onChange={(e) => setActionType(e.target.value as 'upload' | 'remove')}
                        className="w-full p-2 border rounded-md dark:bg-[#1f2937] dark:border-gray-600"
                    >
                        <option value="upload">Add Members</option>
                        <option value="remove">Remove Members</option>
                    </select>
                </div>

                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${file ? (actionType === 'upload' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-400 hover:border-gray-500'}`}
                >
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="block">
                        {file ? (
                            <div className="flex items-center justify-center">
                                <p className={`${actionType === 'upload' ? 'text-green-700':'text-red-700'}`}>
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

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleFileUpload}
                        className={`py-2 px-4 rounded-md transition ${file
                            ? actionType === 'upload'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } ${file ? 'w-1/2' : 'w-1/2'}`}
                        disabled={!file || isUploading}
                    >
                        {isUploading ? 'Processing...' : actionType === 'upload' ? 'Add Members' : 'Remove Members'}
                    </button>

                    {/* <button
                        type="button"
                        className="w-1/2 ml-4 bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition"
                        onClick={() => {
                            setFile(null);
                            setError('');
                            setMessage('');
                            onClose();
                        }}

                    >
                        Cancel
                    </button> */}

                  
                        <button
                            type="button"
                            className="w-1/2  ml-4 bg-red-100 text-red-600 py-2 px-4 rounded-md hover:bg-red-200 transition"
                            onClick={() => {
                                setFile(null);
                                setError('');
                                setMessage('');
                                onClose();
                            }}
                        >
                            Cancel
                        </button>
                
                </div>
            </div>
        </div >
    );
};

export default ExcelMemberComponent;