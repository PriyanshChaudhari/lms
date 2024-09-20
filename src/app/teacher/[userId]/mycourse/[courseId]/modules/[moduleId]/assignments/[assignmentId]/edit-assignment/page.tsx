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
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal state for file upload
    const [file, setFile] = useState<File | null>(null); // File state

    const convertTimestampToDate = (timestamp: any) => {
        if (timestamp?.seconds) {
            const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
            return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        }
        return '';
    };

    // Fetch the existing assignment data
    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.post('/api/get/assignments/one-assignments', { assignmentId });
                const data = response.data;
                if (response.status === 200) {
                    setFormData({
                        ...data,
                        due_date: convertTimestampToDate(data.due_date)
                    });
                } else {
                    setError('Failed to fetch assignment details');
                }
            } catch (error) {
                setError('An error occurred while fetching the assignment.');
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const isFormComplete = () => {
        const { title, description, total_marks, due_date } = formData;
        return title && description && total_marks && due_date;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.put(`/api/assignments/${assignmentId}/edit-assignment`, formData);
            const data = response.data;

            if (response.status === 200) {
                setMessage('Assignment updated successfully!');
                router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`);
            } else {
                setError(data.error || 'Failed to update assignment');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-6">Edit Assignment</h1>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
                    <select
                        name="assessment_type"
                        value={formData.assessment_type}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                    <input
                        type="number"
                        name="total_marks"
                        value={formData.total_marks}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className={`bg-gray-500 w-full text-white px-4 py-2 rounded hover:bg-gray-600 ${!isFormComplete() ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isFormComplete()} // Disable if form is incomplete
                    >
                        Upload Files
                    </button>
                </div>
            </form>

            {/* Modal for File Upload */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-md lg:left-32 md:left-32">
                        <h3 className="text-xl font-bold mb-4">Upload File</h3>
                        <input type="file" onChange={handleFileChange} />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleSubmit}  // Call submit from here
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Update Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
