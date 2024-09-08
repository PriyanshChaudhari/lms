"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const EditCourse = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId;
    const courseId = params.courseId; // Assuming courseId is passed in the URL

    const [course, setCourse] = useState({
        title: "",
        description: "",
        thumbnail: "",
        teacher_id: userId,
        category: ""
    });

    const [loading, setLoading] = useState(true); // To manage loading state

    // Fetch the course data when the component mounts
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.post(`/api/get/course-details`, { courseId });
                const courseData = res.data.courseDetails;

                setCourse({
                    title: courseData.title,
                    description: courseData.description,
                    thumbnail: courseData.thumbnail || "",
                    teacher_id: courseData.teacher_id || userId,
                    category: courseData.category || ""
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        fetchCourse();
    }, [courseId, userId]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.put(`/api/put/update-course/${courseId}`, course); // Send updated data
            console.log("Course updated:", res.data);

            // Optionally, redirect after successful update
            router.push(`/teacher/${userId}/mycourse`);
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show a loading indicator while data is being fetched
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
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
                        Update Course
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCourse;
