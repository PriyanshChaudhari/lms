"use client"
import { useState, ChangeEvent, DragEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function AssignmentSubmission() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;

    // Valid file formats and size limits
    const validFormats = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
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

        try {
            // Simulate file upload logic (e.g., to Firebase Storage or S3)
            const uploadedFileUrls: string[] = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await axios.post('/api/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    // Return the file URL from the response
                    return response.data.fileUrl;
                })
            );

            // Prepare the submission data
            const submissionData = {
                student_id: userId,
                assessment_id: assignmentId,
                submission_date: new Date(),
                file_urls: uploadedFileUrls, // An array of URLs for the submitted files
                created_at: new Date(),
                updated_at: new Date(),
            };

            // Save the submission data to Firestore or your preferred database
            await axios.post(`/api/assignments/submissions`, submissionData);

            setMessage('Submission successful!');
            router.push(`/student/${userId}/courses/${courseId}/modules/${moduleId}/assignments`);
        } catch (error) {
            console.error('Error uploading files or saving submission:', error);
            setError('An error occurred during submission. Please try again.');
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        // You can handle drag-and-drop logic here if needed
    };

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto p-4">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Submit Your Assignment</h2>
                        <p className="mb-6">Select and upload the files of your choice</p>

                        <form onSubmit={handleSubmit}>
                            <div
                                className="border-2 border-dashed border-gray-400 lg:p-16 p-6 text-center cursor-pointer hover:border-gray-500 transition"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept=".jpeg, .png, .pdf, .mp4"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="block">
                                    <p className="text-gray-600">Choose a file or drag & drop it here</p>
                                    <p className="text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                                </label>
                            </div>

                            {error && <p className="text-red-500 mt-2">{error}</p>}
                            {message && <p className="text-green-500 mt-2">{message}</p>}

                            <div className="flex justify-between mt-4">
                                <button type="submit" className="bg-black text-white py-2 px-7 rounded-xl hover:bg-gray-800 transition">
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black border border-gray-300 py-2 px-4 rounded-xl hover:bg-gray-400 transition"
                                    onClick={() => setFiles([])}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
