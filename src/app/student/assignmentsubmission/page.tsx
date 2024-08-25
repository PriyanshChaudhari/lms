"use client"
import { useState, ChangeEvent, DragEvent } from 'react';

const AssignmentSubmission = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        const validFormats = ['image/jpeg', 'image/png', 'image/pdg', 'video/mp4'];
        const validFiles = selectedFiles.filter(file =>
            validFormats.includes(file.type) && file.size <= 50 * 1024 * 1024
        );

        if (validFiles.length !== selectedFiles.length) {
            setError('Some files are invalid or exceed the size limit of 50MB.');
        } else {
            setError('');
        }

        setFiles(validFiles);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (files.length === 0) {
            setError('Please select files to upload.');
            return;
        }

        // Placeholder for file upload logic
        console.log('Files ready for upload:', files);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <div className="w-full max-w-md mx-auto p-4">
                    <h2 className="text-2xl font-semibold mb-2">Upload files</h2>
                    <p className="mb-4">Select and upload the files of your choice</p>

                    <form onSubmit={handleSubmit}>
                        <div
                            className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-gray-500 transition"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                multiple
                                accept=".jpeg, .png, .pdg, .mp4"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="block">
                                <p className="text-gray-600">Choose a file or drag & drop it here</p>
                                <p className="text-gray-500">JPEG, PNG, PDG, and MP4 formats, up to 50MB</p>
                            </label>
                        </div>

                        {error && <p className="text-red-500 mt-2">{error}</p>}

                        <div className="flex justify-between mt-4">
                            <button type="submit" className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition">Save</button>
                            <button type="button" className="bg-white text-black border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100 transition" onClick={() => setFiles([])}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>




    );
};

export default AssignmentSubmission;
