"use client";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import { IoMdClose } from 'react-icons/io';

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
        attachments: [] as File[], // Array to hold multiple files
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal state

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData((prevData) => ({
                ...prevData,
                attachments: [...prevData.attachments, ...files], // Append selected files
            }));
        }
    };

    const validateForm = () => {
        const { title, description, total_marks, due_date } = formData;
        if (title.trim() === '' || description.trim() === '' || total_marks.trim() === '' || due_date.trim() === '') {
            setError('Please Fill All Required Fields.');
            return false;
        }
        if (formData.attachments.length === 0) {
            setError('Please Upload At Least One File.');
            return false;
        }
        return true;
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

            // Append all files
            formData.attachments.forEach((file) => {
                formSubmissionData.append('files', file);
            });

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
                    attachments: [], // Reset attachments
                });
                router.back();
            } else {
                setError(data.error || 'Failed to add assessment');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="w-full max-w-md mx-auto dark:bg-[#151b23] p-8 shadow-md rounded-lg">
                <div className='flex justify-between mb-4 items-center'>
                    <div className="text-2xl font-semibold text-black dark:text-gray-300">Add New Assignment</div>
                    <div className=''
                        onClick={() => (router.back())}
                    >
                        <IoMdClose className='font-semibold text-3xl cursor-pointer hover:scale-125 transition-transform ease-linear text-red-500' />
                    </div>
                </div>
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

                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Upload Files:</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg dark:bg-[#151b23]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white w-full px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Create Assignment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
