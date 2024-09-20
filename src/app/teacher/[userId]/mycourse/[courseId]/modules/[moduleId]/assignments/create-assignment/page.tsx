"use client";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function CreateAssignment() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

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
    const [showModal, setShowModal] = useState(false); // Modal state
    const [file, setFile] = useState<File | null>(null); // File state

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

    const validateForm = () => {
        const { title, description, total_marks, due_date } = formData;
        if (!title || !description || !total_marks || !due_date) {
            setError('Please fill in all required fields.');
            return false;
        }
        return true;
    };

    const isFormComplete = () => {
        const { title, description, total_marks, due_date } = formData;
        return title && description && total_marks && due_date; // All required fields must be filled
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Exit if validation fails
        }

        try {
            const formSubmissionData = new FormData();
            formSubmissionData.append('course_id', formData.course_id);
            formSubmissionData.append('module_id', formData.module_id);
            formSubmissionData.append('title', formData.title);
            formSubmissionData.append('assessment_type', formData.assessment_type);
            formSubmissionData.append('description', formData.description);
            formSubmissionData.append('total_marks', formData.total_marks);
            formSubmissionData.append('due_date', formData.due_date);
            
            if (file) {
                formSubmissionData.append('file', file);
            }

            const response = await axios.post('/api/assignments/create-assignment', formSubmissionData);
            const data = response.data;

            if (response) {
                setMessage('Assessment added successfully!');
                setFormData({
                    course_id: courseId,
                    module_id: moduleId,
                    title: '',
                    assessment_type: 'assignment',
                    description: '',
                    total_marks: '',
                    due_date: '',
                });
                setFile(null);
                router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`);
            } else {
                setError(data.error || 'Failed to add assessment');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="w-full max-w-md mx-auto dark:bg-gray-800 p-8 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-6">Add New Assessment</h1>
                {message && <p className="text-green-500">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-800"
                            required
                        />
                    </div>
                    {/* <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Assessment Type</label>
                        <select
                            name="assessment_type"
                            value={formData.assessment_type}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-800"
                            required
                        >
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                        </select>
                    </div> */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Total Marks</label>
                        <input
                            type="number"
                            name="total_marks"
                            value={formData.total_marks}
                            onChange={handleChange}
                            min={0}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-800"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Due Date</label>
                        <input
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-gray-800"
                            min={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className={`bg-gray-500 text-white w-full px-4 py-2 rounded hover:bg-gray-600 ${!isFormComplete() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isFormComplete()}  // Disable button if form is incomplete
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
                                    Create Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
