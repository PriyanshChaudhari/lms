"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            router.push(`/teacher/${userId}/mycourse/${courseId}/`)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="w-full max-w-md mx-auto mt-8 p-6 rounded border dark:bg-[#151b23] border-gray-100 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create a New Module</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2 ">
                        Module Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={module.title}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-[#151b23]"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2 ">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={module.description}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-[#151b23]"
                        required
                    />
                </div>

                <div className='mt-8'>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
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
