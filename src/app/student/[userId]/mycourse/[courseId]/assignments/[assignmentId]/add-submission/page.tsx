"use client";
import { useEffect, useState, ChangeEvent, DragEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebaseConfig";  // Adjust the path
import axios from "axios";

export default function AssignmentSubmission() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [submissionExists, setSubmissionExists] = useState<boolean>(false);
    const [previousSubmission, setPreviousSubmission] = useState<any>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;

    const validFormats = ["image/jpeg", "image/png", "application/pdf", "video/mp4"];

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const submissionRef = doc(db, "submissions", `${userId}_${assignmentId}`);
                const submissionSnap = await getDoc(submissionRef);

                if (submissionSnap.exists()) {
                    setSubmissionExists(true);
                    setPreviousSubmission(submissionSnap.data());
                }
            } catch (error) {
                console.error("Error fetching submission:", error);
            }
        };

        fetchSubmission();
    }, [userId, assignmentId]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        const validFiles = selectedFiles.filter(
            (file) => validFormats.includes(file.type) && file.size <= 50 * 1024 * 1024
        );

        if (validFiles.length !== selectedFiles.length) {
            setError("Some files are invalid or exceed the size limit of 50MB.");
        } else {
            setError("");
        }

        setFiles(validFiles);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (files.length === 0) {
            setError("Please select files to upload.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('student_id', userId);
            formData.append('assignment_id', assignmentId);
            formData.append('course_id', courseId);
            formData.append('module_id', moduleId);
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await axios.post('/api/assignments/add-submission', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploading(false);
            if (response.status === 200) {
                setMessage(response.data.message);
                router.push(`/student/${userId}/courses/${courseId}/modules/${moduleId}/assignments`);
            } else {
                setError(response.data.error || 'Error during submission');
            }
            // router.push(`/student/${userId}/courses/${courseId}/modules/${moduleId}/assignments`);
        } catch (error) {
            console.error("Error uploading files or saving submission:", error);
            setError("An error occurred during submission. Please try again.");
            setUploading(false);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        // Handle drag-and-drop if needed
    };

    if (submissionExists && previousSubmission) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Assignment Already Submitted</h2>
                        <p className="mb-6 text-gray-600">You have already submitted this assignment.</p>
                        <p className="text-gray-700 mb-2">
                            Submission Date: <span className="font-medium">{previousSubmission.submission_date?.toDate().toLocaleString()}</span>
                        </p>
                        <p className="text-gray-700 mb-4">Uploaded Files:</p>
                        <ul className="mb-6">
                            {previousSubmission.file_urls?.map((url: string, index: number) => (
                                <li key={index} className="mb-2">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        File {index + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="text-gray-600">You can update your submission if needed.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Submit Your Assignment</h2>
                <p className="mb-6 text-center text-gray-600">Select and upload the files of your choice</p>

                <form onSubmit={handleSubmit}>
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                            files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-400 hover:border-gray-500'
                        }`}
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
                            {files.length > 0 ? (
                                <div className="flex items-center justify-center">
                                    <p className="text-green-700">
                                        Selected: <span className="font-medium">{files.length} file(s)</span>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-600">Choose files or drag & drop them here</p>
                                    <p className="text-gray-500 text-sm mt-1">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                                </>
                            )}
                        </label>
                    </div>

                    {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                    {message && <p className="text-green-500 mt-2 text-center">{message}</p>}
                    {uploading && <p className="text-blue-500 mt-2 text-center">Uploading files...</p>}

                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            className={`py-2 px-4 rounded-md transition ${
                                files.length > 0
                                    ? 'bg-green-500 text-white w-1/2 hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 w-full cursor-not-allowed'
                            }`}
                            disabled={files.length === 0 || uploading}
                        >
                            {submissionExists ? "Update" : "Submit"}
                        </button>
                        {files.length > 0 && (
                            <button
                                type="button"
                                className="w-1/2 ml-4 bg-red-100 text-red-600 py-2 px-4 rounded-md hover:bg-red-200 transition"
                                onClick={() => setFiles([])}
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}