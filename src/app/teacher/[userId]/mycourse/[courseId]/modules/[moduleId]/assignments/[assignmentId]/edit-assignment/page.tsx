"use client";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

export default function EditAssignment() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;

    const [formData, setFormData] = useState({
        course_id: courseId,
        module_id: moduleId,
        title: '',
        assessment_type: 'assignment', // default type
        description: '',
        total_marks: '',
        due_date: '',
        attachment_url: [] as string[], // Change to array to hold multiple URLs
    });

    const [loading, setLoading] = useState(true);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [deleteFiles, setDeleteFiles] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch the current assignment details
    useEffect(() => {
        async function fetchAssignment() {
            try {
                const response = await axios.get(`/api/assignments/${assignmentId}`);
                const assignment = response.data.assignment;
                setFormData({
                    course_id: courseId,
                    module_id: moduleId,
                    title: assignment.title,
                    assessment_type: assignment.assessment_type,
                    description: assignment.description,
                    total_marks: assignment.total_marks,
                    due_date: new Date(assignment.due_date.seconds * 1000).toISOString().split('T')[0],
                    attachment_url: assignment.attachment_url || [], // Initialize with existing URLs
                });
            } catch (error) {
                setError('Failed to load assignment data.');
            } finally {
                setLoading(false);
            }
        }
        fetchAssignment();
    }, [assignmentId, courseId, moduleId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles(Array.from(e.target.files)); // Handle multiple files
        }
    };

    const handleDeleteAttachment = (fileUrl: string) => {
        setDeleteFiles((prev) => [...prev, fileUrl]);
        setFormData((prevContent) => ({
            ...prevContent,
            attachment_url: prevContent.attachment_url.filter((url) => url !== fileUrl),
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const formSubmissionData = new FormData();
            formSubmissionData.append('course_id', formData.course_id);
            formSubmissionData.append('module_id', formData.module_id);
            formSubmissionData.append('title', formData.title);
            formSubmissionData.append('assessment_type', formData.assessment_type);
            formSubmissionData.append('description', formData.description);
            formSubmissionData.append('total_marks', formData.total_marks);
            formSubmissionData.append('due_date', formData.due_date);

            // Append new files to FormData
            newFiles.forEach((file) => formSubmissionData.append('newFiles', file));

            // Send delete files list
            formSubmissionData.append('deleteFiles', JSON.stringify(deleteFiles));

            const response = await axios.put(`/api/assignments/${assignmentId}/edit-assignment`, formSubmissionData);
            if (response.status === 200) {
                setMessage('Assignment updated successfully!');
                router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`);
            } else {
                setError('Failed to update assignment');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="w-full max-w-md mx-auto dark:bg-[#151b23] p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-semibold text-black dark:text-gray-300 mb-4">Edit Assignment</h1>
                {message && <p className="text-green-500">{message}</p>}
                {error && (
                    <div className="mb-4 text-red-500 font-semibold text-left">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg dark:bg-[#151b23]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg dark:bg-[#151b23]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Total Marks:</label>
                        <input
                            type="number"
                            name="total_marks"
                            value={formData.total_marks}
                            onChange={handleChange}
                            min={0}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg dark:bg-[#151b23]"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Due Date:</label>
                        <input
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg dark:bg-[#151b23]"
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>

                    <h3 className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Existing Attachments:</h3>
                    <ul className="mb-4">
                        {formData.attachment_url.map((fileUrl) => (
                            <li key={fileUrl} className="flex items-center justify-between">
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {fileUrl}
                                </a>
                                <button type="button" onClick={() => handleDeleteAttachment(fileUrl)} className="text-red-600 hover:underline">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Upload New Files:</label>
                        <p className='text-red-600'>Upload all previous files, as it will overwrite previous files for multiple uploads.</p>
                        <input type="file" multiple onChange={handleFileChange} className="mt-1" />
                    </div>

                    <div className="mb-4">
                        <button type="submit" className="bg-blue-600 text-white w-full px-4 py-2 rounded-lg hover:bg-blue-700">
                            Update Assignment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
