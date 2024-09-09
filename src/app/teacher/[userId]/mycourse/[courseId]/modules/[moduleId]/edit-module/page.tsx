"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const EditModule = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId;
    const courseId = params.courseId;
    const moduleId = params.moduleId;  // Assuming you pass moduleId in the URL

    const [module, setModule] = useState({
        title: "",
        description: "",
        position: "",
        course_id: courseId
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId });
                const data = res.data.content;

                // Pre-fill the form with fetched module data
                setModule({
                    title: data.title,
                    description: data.description,
                    position: data.position,
                    course_id: courseId,
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching module:", error);
            }
        };

        fetchModule();
    }, [moduleId, courseId]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setModule({ ...module, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.put(`/api/put/update-module/${moduleId}`, module);
            console.log("Module updated:", res.data);
            // Optionally, you can redirect the user after successful update
            router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`);
        } catch (error) {
            console.error("Error updating module:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="w-full max-w-md mx-auto mt-8 p-6  rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Edit Module</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Module Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={module.title}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={module.description}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                        Position
                    </label>
                    <input
                        type="number"
                        id="position"
                        name="position"
                        value={module.position}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Update Module
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default EditModule;
