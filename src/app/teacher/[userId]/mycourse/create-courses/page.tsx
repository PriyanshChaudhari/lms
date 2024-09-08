"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const CreateCourse = () => {
    const params = useParams()
    const router = useRouter()
    const userId = params.userId;
    const [course, setCourse] = useState({
        title: "",
        description: "",
        thumbnail: "",
        teacher_id: userId,
        category: ""
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
        setCourse({ ...course, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/courses/create-courses', course);
            const data = res.data;
            console.log(data);

            // Optionally, you can reset the form after successful submission
            setCourse({
                title: "",
                description: "",
                thumbnail: "",
                teacher_id: userId,
                category: ""
            });
            router.push(`/teacher/${userId}/mycourse/`)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create a New Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Course Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={course.title}
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
                        value={course.description}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                        Thumbnail URL
                    </label>
                    <input
                        type="text"
                        id="thumbnail"
                        name="thumbnail"
                        value={course.thumbnail}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                    />
                </div>

                {/* <div className="mb-4">
                    <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">
                        Teacher
                    </label>
                    <select
                        id="teacher_id"
                        name="teacher_id"
                        value={course.teacher_id}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.first_name} {teacher.last_name}
                            </option>
                        ))}
                    </select>
                </div> */}

                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={course.category}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        {/* Add more categories as needed */}
                    </select>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Create Course
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourse;
