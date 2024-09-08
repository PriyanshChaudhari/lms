"use client"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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

    const convertTimestampToDate = (timestamp) => {
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
                console.log(data.due_date)
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
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
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Update Assignment
                </button>
            </form>
        </div>
    );
}
