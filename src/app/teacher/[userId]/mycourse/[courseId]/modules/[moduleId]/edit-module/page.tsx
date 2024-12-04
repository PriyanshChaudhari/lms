"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { IoMdClose } from 'react-icons/io';

const EditModule = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId;
    const courseId = params.courseId;
    const moduleId = params.moduleId;  // Assuming you pass moduleId in the URL

    const [module, setModule] = useState({
        title: "",
        description: "",
        course_id: courseId
    });

    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId });
                const data = res.data.module;

                // Pre-fill the form with fetched module data
                setModule({
                    title: data.title,
                    description: data.description,
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

        if (module.title.trim() === "" || module.description.trim() === "" || module.course_id === "") {
            setError("Please Fill All Required Fields.")
            return;
        }

        try {
            setError("")
            const res = await axios.put(`/api/put/update-module/${moduleId}`, module);
            router.push(`/teacher/${userId}/mycourse/${courseId}`);
        } catch (error) {
            console.error("Error updating module:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="w-full max-w-md mx-auto mt-8 p-6  rounded-lg shadow-md">
            <div className='flex justify-between mb-4 items-center'>
                    <div className="text-2xl font-semibold text-black dark:text-gray-300">Edit Module</div>
                    <div onClick={() => (router.back())}>
                        <IoMdClose className='font-semibold text-3xl cursor-pointer hover:scale-125 transition-transform ease-linear text-red-500' />
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 text-red-500 font-semibold text-left">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Module Title:
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={module.title}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Description:
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={module.description}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* <div className="mb-4">
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                            Position
                        </label>
                        <input
                            type="number"
                            id="position"
                            name="position"
                            value={module.position}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                        />
                    </div> */}

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
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
