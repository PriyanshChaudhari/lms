"use client"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const { title, description, total_marks, due_date } = formData;
        if (!title || !description || !total_marks || !due_date) {
            setError('Please fill in all required fields.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Exit if validation fails
        }

        try {
            const response = await axios.post('/api/assignments/create-assignment', formData);
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
                    <div className="mb-4">
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
                    </div>
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

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create Assignment
                    </button>
                </form>
            </div>
        </div>
    );
}
