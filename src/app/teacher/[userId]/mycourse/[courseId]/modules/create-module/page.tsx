"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { IoMdClose } from 'react-icons/io';

const CreateCourseModule = () => {
    const params = useParams()
    const router = useRouter()
    const userId = params.userId;
    const courseId = params.courseId;
    const [module, setModule] = useState({
        title: "",
        description: "",
        course_id: courseId
    });
    const [error, setError] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);

    // useEffect(() => {
    //     // Fetch the list of teachers when the component mounts
    //     const fetchTeachers = async () => {
    //         try {
    //             const res = await axios.get('/api/get/teachers');
    //             setTeachers(res.data);
    //         } catch (error) {
    //             console.error('Error fetching teachers:', error);
    //         }
    //     };

    //     fetchTeachers();
    // }, []);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setModule({ ...module, [name]: value });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000); // 5 seconds delay

        // Cleanup the timer when the component unmounts or re-renders
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (module.title.trim() === "" || module.description.trim() === "" || module.course_id === "") {
            setError("Please Fill All Required Fields.")
            return;
        }

        try {
            const res = await axios.post('/api/courses/create-module', module);
            const data = res.data;
            console.log(data);

            // Optionally, you can reset the form after successful submission
            setModule({
                title: "",
                description: "",
                course_id: courseId
            });
           setShowMessage(true);
        } catch (error) {
            console.error(error);
        }
    };

    const closeShowMessage = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/`)
        setShowMessage(false);
    }

    return (
        <div className='h-screen flex justify-center items-center'>
             {showMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Module Created Sucessfully
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Module added to the course sucessfully.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={closeShowMessage}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                                Cancel (Closing in 5 seconds)
                            </button>

                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-md mx-auto mt-8 p-6 rounded-lg border dark:bg-[#151b23] border-gray-100 shadow-md">
                <div className='flex justify-between mb-4 items-center'>
                    <div className="text-2xl font-semibold text-black dark:text-gray-300">Create New Module</div>
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-[#151b23]"
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-[#151b23]"
                            required
                        />
                    </div>

                    <div className='mt-8'>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Create Module
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourseModule;
