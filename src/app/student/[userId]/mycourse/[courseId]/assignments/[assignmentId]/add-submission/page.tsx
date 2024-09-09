"use client";
import { useEffect, useState, ChangeEvent, DragEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "@/lib/firebaseConfig";  // Adjust the path

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

    // Fetch submission details on component load
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
            const uploadedFileUrls: string[] = await Promise.all(
                files.map(async (file) => {
                    const storageRef = ref(storage, `assignments/${userId}/${assignmentId}/${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    return new Promise<string>((resolve, reject) => {
                        uploadTask.on(
                            "state_changed",
                            (snapshot) => {
                                // Progress monitoring if needed
                            },
                            (error) => {
                                reject(error);
                            },
                            async () => {
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                resolve(downloadURL);
                            }
                        );
                    });
                })
            );

            const submissionData = {
                student_id: userId,
                assignment_id: assignmentId,
                course_id: courseId,
                module_id: moduleId,
                submission_date: serverTimestamp(),
                file_urls: uploadedFileUrls,
                updated_at: serverTimestamp(),
            };

            if (submissionExists) {
                // Update existing submission
                const submissionRef = doc(db, "submissions", `${userId}_${assignmentId}`);
                await updateDoc(submissionRef, submissionData);
                setMessage("Submission updated successfully!");
            } else {
                // Create new submission
                await addDoc(collection(db, "submissions"), {
                    ...submissionData,
                    created_at: serverTimestamp(),
                });
                setMessage("Submission successful!");
            }

            setUploading(false);
            router.push(`/student/${userId}/courses/${courseId}/modules/${moduleId}/assignments`);
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

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto p-4">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Submit Your Assignment</h2>
                        <p className="mb-6">Select and upload the files of your choice</p>

                        {submissionExists && previousSubmission ? (
                            <>
                                <h3 className="text-xl text-green-600 mb-4">You have already submitted this assignment!</h3>
                                <p className="mb-4">Submission Date: {previousSubmission.submission_date?.toDate().toLocaleString()}</p>
                                <p className="mb-6">Uploaded Files:</p>
                                <ul className="mb-6">
                                    {previousSubmission.file_urls?.map((url: string, index: number) => (
                                        <li key={index}>
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                File {index + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mb-6 text-gray-500">You can update your submission if needed.</p>
                            </>
                        ) : null}

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
                            {uploading && <p className="text-blue-500 mt-2">Uploading files...</p>}

                            <div className="flex justify-between mt-4">
                                <button
                                    type="submit"
                                    className="bg-black text-white py-2 px-7 rounded-xl hover:bg-gray-800 transition"
                                    disabled={uploading}
                                >
                                    {submissionExists ? "Update Submission" : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black border border-gray-300 py-2 px-4 rounded-xl hover:bg-gray-400 transition"
                                    onClick={() => setFiles([])}
                                    disabled={uploading}
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
