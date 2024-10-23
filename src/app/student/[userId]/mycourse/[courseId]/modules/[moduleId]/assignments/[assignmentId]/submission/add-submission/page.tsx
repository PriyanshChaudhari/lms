"use client";

import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

export default function AddSubmission() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;

    const [submission, setSubmission] = useState<string | null>(null); // Submission URL state
    const [file, setFile] = useState<File | null>(null); // File state
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch existing submission (if any)
    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await axios.post(`/api/assignments/${assignmentId}/submission/check-submission`,{userId,assignmentId});
                if (response.status === 200) {
                    setSubmission(response.data.submissions[0].file_url); // Existing submission URL
                }
            } catch (error) {
                console.error("Error fetching submission:", error);
            }
        };
        fetchSubmission();
    }, [assignmentId, userId]);

    // Handle file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    // Submit or update assignment
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please upload a file.");
            return;
        }

        try {
            setUploading(true);
            const formSubmissionData = new FormData();
            formSubmissionData.append("course_id", courseId);
            formSubmissionData.append("module_id", moduleId);
            formSubmissionData.append("assignmentId", assignmentId);
            formSubmissionData.append("user_id", userId);

            if (file) {
                formSubmissionData.append("file", file);
            }

            const url = `/api/assignments/${assignmentId}/submission/manage-submission` 
                // : `/api/assignments/${assignmentId}/submission/add-submission`;

            const response = await axios.post(url, formSubmissionData);
            if (response.status === 201) {
                setMessage("Submission added/updated successfully!");
                setSubmission(response.data.submission_url); // Update the submission URL
                setFile(null);
            } else {
                setError(response.data.error || "Failed to submit assignment.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    // Delete submission
    const handleDelete = async () => {
        try {
            setDeleting(true);
            const response = await axios.delete(`/api/assignments/${assignmentId}/submission/manage-submission`,{data:{userId,assignmentId}});
            if (response.status === 200) {
                setMessage("Submission deleted successfully.");
                setSubmission(null); // Remove submission from UI
                setFile(null); // Reset file input
            } else {
                setError("Failed to delete submission.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-full max-w-md mx-auto dark:bg-[#151b23] p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>
                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}

                {submission ? (
                    <div>
                        <p className="mb-4 text-green-500">You have already submitted an assignment:</p>
                        <a href={submission} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            View Submission
                        </a>
                        <div className="mt-4">
                            <button
                                onClick={handleDelete}
                                className={`bg-red-600 text-white w-full px-4 py-2 rounded-lg hover:bg-red-700 ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete Submission"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Upload File</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg dark:bg-[#151b23]"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <button
                                type="submit"
                                className={`bg-blue-600 text-white w-full px-4 py-2 rounded-lg hover:bg-blue-700 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Submit"}
                            </button>
                        </div>
                    </form>
                )}
                {submission && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Edit Submission</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Upload New File</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg dark:bg-[#151b23]"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className={`bg-blue-600 text-white w-full px-4 py-2 rounded-lg hover:bg-blue-700 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Edit Submission"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}




// ----------------------------------------------------------------------------------------------------------
// "use client"
// import { useState, ChangeEvent, DragEvent } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function AssignmentSubmission() {
//     const [files, setFiles] = useState<File[]>([]);
//     const [error, setError] = useState<string>('');
//     const [message, setMessage] = useState<string>('');
//     const router = useRouter();
//     const params = useParams();
//     const userId = params.userId as string;
//     const courseId = params.courseId as string;
//     const moduleId = params.moduleId as string;
//     const assignmentId = params.assignmentId as string;

//     // Valid file formats and size limits
//     const validFormats = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];

//     const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = Array.from(event.target.files ?? []);
//         const validFiles = selectedFiles.filter(file =>
//             validFormats.includes(file.type) && file.size <= 50 * 1024 * 1024
//         );

//         if (validFiles.length !== selectedFiles.length) {
//             setError('Some files are invalid or exceed the size limit of 50MB.');
//         } else {
//             setError('');
//         }

//         setFiles(validFiles);
//     };

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         if (files.length === 0) {
//             setError('Please select files to upload.');
//             return;
//         }

//         try {
//             // Simulate file upload logic (e.g., to Firebase Storage or S3)
//             const uploadedFileUrls: string[] = await Promise.all(
//                 files.map(async (file) => {
//                     const formData = new FormData();
//                     formData.append('file', file);

//                     const response = await axios.post('/api/upload', formData, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     });

//                     // Return the file URL from the response
//                     return response.data.fileUrl;
//                 })
//             );

//             // Prepare the submission data
//             const submissionData = {
//                 student_id: userId,
//                 assessment_id: assignmentId,
//                 submission_date: new Date(),
//                 file_urls: uploadedFileUrls, // An array of URLs for the submitted files
//                 created_at: new Date(),
//                 updated_at: new Date(),
//             };

//             // Save the submission data to Firestore or your preferred database
//             await axios.post(`/api/assignments/submissions`, submissionData);

//             setMessage('Submission successful!');
//             router.push(`/student/${userId}/courses/${courseId}/modules/${moduleId}/assignments`);
//         } catch (error) {
//             console.error('Error uploading files or saving submission:', error);
//             setError('An error occurred during submission. Please try again.');
//         }
//     };

//     const handleDrop = (event: DragEvent<HTMLDivElement>) => {
//         event.preventDefault();
//         // You can handle drag-and-drop logic here if needed
//     };

//     return (
//         <div className="border border-gray-300 m-5">
//             <div className="max-w-4xl mx-auto p-5">
//                 <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto p-4">
//                     <div>
//                         <h2 className="text-2xl font-semibold mb-4">Submit Your Assignment</h2>
//                         <p className="mb-6">Select and upload the files of your choice</p>

//                         <form onSubmit={handleSubmit}>
//                             <div
//                                 className="border-2 border-dashed border-gray-400 lg:p-16 p-6 text-center cursor-pointer hover:border-gray-500 transition"
//                                 onDragOver={(e) => e.preventDefault()}
//                                 onDrop={handleDrop}
//                             >
//                                 <input
//                                     type="file"
//                                     multiple
//                                     accept=".jpeg, .png, .pdf, .mp4"
//                                     onChange={handleFileChange}
//                                     className="hidden"
//                                     id="file-upload"
//                                 />
//                                 <label htmlFor="file-upload" className="block">
//                                     <p className="text-gray-600">Choose a file or drag & drop it here</p>
//                                     <p className="text-gray-500">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
//                                 </label>
//                             </div>

//                             {error && <p className="text-red-500 mt-2">{error}</p>}
//                             {message && <p className="text-green-500 mt-2">{message}</p>}

//                             <div className="flex justify-between mt-4">
//                                 <button type="submit" className="dark:bg-[#212830] text-white py-2 px-7 rounded-lg-xl hover:bg-[#151b23] transition">
//                                     Submit
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="bg-gray-300 text-black border border-gray-300 py-2 px-4 rounded-lg-xl hover:bg-gray-400 transition"
//                                     onClick={() => setFiles([])}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// "use client"
// import { useState, ChangeEvent, DragEvent } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';

// export default function AssignmentSubmission() {
//     const [files, setFiles] = useState<File[]>([]);
//     const [error, setError] = useState<string>('');
//     const [message, setMessage] = useState<string>('');
//     const [uploading, setUploading] = useState<boolean>(false);
//     const router = useRouter();
//     const params = useParams();
//     const userId = params.userId as string;
//     const courseId = params.courseId as string;
//     const moduleId = params.moduleId as string;
//     const assignmentId = params.assignmentId as string;

//     const validFormats = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];

//     const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = Array.from(event.target.files ?? []);
//         const validFiles = selectedFiles.filter(file =>
//             validFormats.includes(file.type) && file.size <= 50 * 1024 * 1024
//         );

//         if (validFiles.length !== selectedFiles.length) {
//             setError('Some files are invalid or exceed the size limit of 50MB.');
//         } else {
//             setError('');
//         }

//         setFiles(validFiles);
//     };

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         if (files.length === 0) {
//             setError('Please select files to upload.');
//             return;
//         }

//         setUploading(true);
//         try {
//             // Simulate file upload logic (e.g., to Firebase Storage or S3)
//             const uploadedFileUrls: string[] = await Promise.all(
//                 files.map(async (file) => {
//                     const formData = new FormData();
//                     formData.append('file', file);

//                     const response = await axios.post('/api/upload', formData, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     });

//                     return response.data.fileUrl;
//                 })
//             );

//             const submissionData = {
//                 student_id: userId,
//                 assessment_id: assignmentId,
//                 file_urls: uploadedFileUrls
//             };

//             await axios.post(`/api/assignments/submissions`, submissionData);

//             setMessage('Submission successful!');
//             setUploading(false);
//             router.push(`/student/${userId}/courses/${courseId}/modules/${moduleId}/assignments`);
//         } catch (error) {
//             console.error('Error uploading files or saving submission:', error);
//             setError('An error occurred during submission. Please try again.');
//             setUploading(false);
//         }
//     };

//     const handleDrop = (event: DragEvent<HTMLDivElement>) => {
//         event.preventDefault();
//         const droppedFiles = Array.from(event.dataTransfer.files);
//         const validFiles = droppedFiles.filter(file =>
//             validFormats.includes(file.type) && file.size <= 50 * 1024 * 1024
//         );

//         if (validFiles.length !== droppedFiles.length) {
//             setError('Some files are invalid or exceed the size limit of 50MB.');
//         } else {
//             setError('');
//         }

//         setFiles(validFiles);
//         // Handle drag-and-drop logic here if needed
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg-lg shadow-md max-w-md w-full">
//                 <h2 className="text-2xl font-semibold mb-4 text-center">Submit Your Assignment</h2>
//                 <p className="mb-6 text-center text-gray-600">Select and upload the files of your choice</p>

//                 <form onSubmit={handleSubmit}>
//                     <div
//                         className={`border-2 border-dashed rounded-lg-lg p-6 text-center cursor-pointer transition ${files.length > 0 ? 'border-green-500 bg-green-50' : 'border-gray-400 hover:border-gray-500'
//                             }`}
//                         onDragOver={(e) => e.preventDefault()}
//                         onDrop={handleDrop}
//                     >
//                         <input
//                             type="file"
//                             multiple
//                             accept=".jpeg, .png, .pdf, .mp4"
//                             onChange={handleFileChange}
//                             className="hidden"
//                             id="file-upload"
//                         />
//                         <label htmlFor="file-upload" className="block">
//                             {files.length > 0 ? (
//                                 <div className="flex items-center justify-center">
//                                     <p className="text-green-700">
//                                         Selected: <span className="font-medium">{files.length} file(s)</span>
//                                     </p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <p className="text-gray-600">Choose files or drag & drop them here</p>
//                                     <p className="text-gray-500 text-sm mt-1">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
//                                 </>
//                             )}
//                         </label>
//                     </div>

//                     {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//                     {message && <p className="text-green-500 mt-2 text-center">{message}</p>}
//                     {uploading && <p className="text-blue-500 mt-2 text-center">Uploading files...</p>}

//                     <div className="flex justify-between mt-6">
//                         <button
//                             type="submit"
//                             className={`py-2 px-4 rounded-lg-md transition ${files.length > 0
//                                     ? 'bg-green-500 text-white w-1/2 hover:bg-green-600'
//                                     : 'bg-gray-300 text-gray-500 w-full cursor-not-allowed'
//                                 }`}
//                             disabled={files.length === 0 || uploading}
//                         >
//                             Submit
//                         </button>
//                         {files.length > 0 && (
//                             <button
//                                 type="button"
//                                 className="w-1/2 ml-4 bg-red-100 text-red-600 py-2 px-4 rounded-lg-md hover:bg-red-200 transition"
//                                 onClick={() => setFiles([])}
//                                 disabled={uploading}
//                             >
//                                 Cancel
//                             </button>
//                         )}
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }
