"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from "@/lib/firebaseConfig";

const EditCourse = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId;
    const courseId = params.courseId; // Assuming courseId is passed in the URL

    const [course, setCourse] = useState({
        title: "",
        description: "",
        teacher_id: userId,
        category: ""
    });

    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [file, setFile] = useState<File | null>(null); // File state
    const [error, setError] = useState('');

    const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const defaultCoursePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-course-pic.png?alt=media`;

    // Fetch the course and categories data when the component mounts
    useEffect(() => {
        const fetchCourseAndCategories = async () => {
            try {
                const courseRes = await axios.post(`/api/get/course-details`, { courseId });
                const courseData = courseRes.data.courseDetails;

                setCourse({
                    title: courseData.title,
                    description: courseData.description,
                    teacher_id: courseData.teacher_id || userId,
                    category: courseData.category || ""
                });

                const categoriesRes = await axios.get('/api/get/categories');
                setCategories(categoriesRes.data.categories);

                // If the course has a selected category, set the selectedCategories state
                const categoryPath = getCategoryPath(courseData.category, categoriesRes.data.categories);
                setSelectedCategories(categoryPath);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching course or categories:", error);
            }
        };

        fetchCourseAndCategories();
    }, [courseId, userId, defaultCoursePicUrl]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const validateForm = () => {
        const { title, description, category, teacher_id } = course;
        if (!title || !description || !category || !teacher_id) {
            setError('Please fill in all required fields.');
            return false;
        }
        return true;
    };



    const handleCategoryChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const updatedSelectedCategories = [...selectedCategories.slice(0, index + 1)];
        updatedSelectedCategories[index] = value;
        setSelectedCategories(updatedSelectedCategories);

        // Update the category in the course
        setCourse({ ...course, category: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Exit if validation fails
        }
        try {
            const formSubmissionData = new FormData();
            formSubmissionData.append('title', course.title);
            formSubmissionData.append('description', course.description);
            formSubmissionData.append('teacher_id', course.teacher_id);
            formSubmissionData.append('category', course.category);

            // Attach the image file to the form data
            if (file) {
                formSubmissionData.append('file', file);
            }

            // Send form data to the backend
            const res = await axios.put(`/api/put/update-course/${courseId}`, formSubmissionData);
            router.push(`/teacher/${userId}/mycourse/`);
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const renderCategoryDropdowns = () => {
        let availableCategories = categories.filter(cat => !cat.parent_category_id);
        const dropdowns = [];

        for (let i = 0; i <= selectedCategories.length; i++) {
            const parentId = i === 0 ? null : selectedCategories[i - 1];
            availableCategories = categories.filter(cat => cat.parent_category_id === parentId);

            if (availableCategories.length === 0) break;

            dropdowns.push(
                <div key={i} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        {i === 0 ? "Top-Level Category" : `Subcategory Level ${i}`}
                    </label>
                    <select
                        value={selectedCategories[i] || ""}
                        onChange={(e) => handleCategoryChange(i, e)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                    >
                        <option value="">Select Category</option>
                        {availableCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return dropdowns;
    };

    // Helper function to get the category path (i.e., top-level to sub-level) for pre-selection
    const getCategoryPath = (categoryId: string, categories: { id: string; category_name: string; parent_category_id: string | null }[]) => {
        const path = [];
        let currentCategoryId = categoryId;
        while (currentCategoryId) {
            path.unshift(currentCategoryId); // Add category at the beginning of the path
            const category = categories.find(cat => cat.id === currentCategoryId);
            currentCategoryId = category ? category.parent_category_id : null;
        }
        return path;
    };

    if (loading) {
        return <p>Loading...</p>; // Show a loading indicator while data is being fetched
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded uppercase"
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
                            className="mt-1 p-2 w-full border capitalize border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="courseImage" className="block text-sm font-medium">
                            Course Image (PNG, JPG, JPEG)
                        </label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className="mt-1 p-2 w-full border"
                        />
                    </div>

                    {renderCategoryDropdowns()}

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
        </div>
    );
};

export default EditCourse;
