import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

interface UploadGradesProps {
    courseId: string;
}

const UploadGrades: React.FC<UploadGradesProps> = ({ courseId }) => {
    const [file, setFile] = useState<File | null>(null);
    const [eventName, setEventName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isUploaded, setIsUploaded] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        if (!eventName) {
            setError('Please enter an event name.');
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

                // Format the data as required by the backend
                const formattedData = jsonData.map((row: any) => ({
                    user_id: row['Student ID'],
                    course_id: courseId,
                    marks: row['Marks'],
                    event_name: eventName
                }));

                try {
                    const response = await axios.post('/api/marks/upload-marks', formattedData);
                    console.log('Upload successful:', response.data);
                    setIsUploaded(true);
                } catch (error) {
                    console.error('Error uploading grades:', error);
                    setError('Error uploading grades. Please try again.');
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    if (isUploaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white dark:bg-transparent p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">File Uploaded Successfully</h2>
                        <p className="mb-6 text-gray-600">Your Excel file has been uploaded and processed.</p>
                        <p className="text-gray-700">
                            Uploaded file: <span className="font-medium">{file?.name}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* <h2 className="text-2xl font-semibold mb-4 text-center">Upload Grades</h2>
            <p className="mb-6 text-center text-gray-600">Select and upload the Excel file of your choice</p> */}

            <div className="mb-4">
                <label htmlFor="event-name" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Event Name
                </label>
                <input
                    type="text"
                    id="event-name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23] dark:border-gray-700 dark:text-gray-300"
                />
            </div>

            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${file ? 'border-green-500 bg-green-50' : 'border-gray-400 hover:border-gray-500'
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
                            <p className="text-green-700">
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
                    onClick={handleUpload}
                    className={`py-2 px-4 rounded-lg transition ${file
                        ? 'bg-green-500 text-white w-1/2 hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 w-full cursor-not-allowed'
                        }`}
                    disabled={!file}
                >
                    Upload
                </button>
                {file && (
                    <button
                        type="button"
                        className="w-1/2 ml-4 bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition"
                        onClick={() => {
                            setFile(null);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadGrades;