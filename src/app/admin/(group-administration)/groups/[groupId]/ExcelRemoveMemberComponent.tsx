import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { json } from 'stream/consumers';

const ExcelRemoveMemberComponent = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError(''); // Clear error when a new file is selected
        }
    };


    const router = useRouter();
    const params = useParams()
    const groupId = params.groupId;
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
                console.log(JSON.stringify(jsonData))
                try {
                    // Switch to POST or PATCH request instead of DELETE
                    const response = await axios.post('/api/groups/remove-members', {
                        members: jsonData,
                    });

                    if (response.status === 201) {
                        // alert('Group members removed successfully');
                        router.push(`/admin/groups/${groupId}`);
                        console.log('Data removed successfully');
                    } else {
                        alert('Failed to remove group members');
                        console.error('Failed to remove data');
                    }
                } catch (error) {
                    console.error('Error removing data:', error);
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="border border-gray-300 m-5 relative lg:left-32 md:left-32">
            <div className="max-w-4xl mx-auto p-5">
                <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto p-4">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Upload Excel File to remove</h2>
                        <p className="mb-6">Select and upload the Excel file of your choice</p>

                        <div
                            className="border-2 border-dashed border-gray-400 dark:border-gray-300 lg:p-16 p-6 text-center cursor-pointer hover:border-gray-500 transition"
                        >
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-remove"
                            />
                            <label htmlFor="file-remove" className="block">
                                <p className="text-gray-600">Choose a file or drag & drop it here</p>
                                <p className="text-gray-500">Excel files (.xlsx, .xls) only</p>
                            </label>
                        </div>

                        {file && (
                            <p className="text-center text-gray-600 mt-4">
                                Selected file: <span className="font-medium">{file.name}</span>
                            </p>
                        )}

                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleFileUpload}
                                className="bg-black text-white py-2 px-7 rounded-xl dark:hover:bg-[#1a1a1a] transition"
                            >
                                remove
                            </button>
                            <button
                                type="button"
                                className="bg-gray-300 dark:bg-white text-black border border-gray-300 py-2 px-4 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-100 transition"
                                onClick={() => {
                                    setFile(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default ExcelRemoveMemberComponent