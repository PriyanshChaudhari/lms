"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from "@/lib/firebaseConfig";
import { IoMdClose } from 'react-icons/io';

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
    const [error, setError] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState(false);

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

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000);
    
            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [showMessage]);
    

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
        if (course.title.trim() === "" || course.description.trim() === "" || course.category.trim() === "" || course.teacher_id === "") {
            setError("Please Fill All Required Fields.")
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
            formSubmissionData.append('teacher_id', course.teacher_id as string);
            formSubmissionData.append('category', course.category);

            // Attach the image file to the form data
            if (file) {
                formSubmissionData.append('file', file);
            }

            // Send form data to the backend
            const res = await axios.put(`/api/put/update-course/${courseId}`, formSubmissionData);
           
            setShowMessage(true);
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
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        {i === 0 ? "Top-Level Category:" : `Subcategory Level ${i}:`}
                    </label>
                    <select
                        value={selectedCategories[i] || ""}
                        onChange={(e) => handleCategoryChange(i, e)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
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
    const getCategoryPath = (categoryId: string | null, categories: { id: string; category_name: string; parent_category_id: string | null }[]) => {
        const path = [];
        let currentCategoryId = categoryId;
        while (currentCategoryId) {
            path.unshift(currentCategoryId); // Add category at the beginning of the path
            const category = categories.find(cat => cat.id === currentCategoryId);
            currentCategoryId = category ? category.parent_category_id : null;
        }
        return path;
    };

    const closeShowMessage = () => {
        router.push(`/teacher/${userId}/dashboard/`);
        setShowMessage(false);
    }

    if (loading) {
        return <p>Loading...</p>; // Show a loading indicator while data is being fetched
    }

    return (
        <div className='flex justify-center items-center h-screen'>
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
                               Close (Closing in 5 seconds)
                            </button>

                        </div>
                    </div>
                </div>
            )}
            <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white dark:bg-[#151b23] rounded-lg shadow-md">
            <div className='flex justify-between mb-4 items-center'>
                    <div className="text-2xl font-semibold text-black dark:text-gray-300">Edit Course</div>
                    <div className=''
                        onClick={() => (router.back())}
                    >
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
                            Course Title:
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={course.title}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg uppercase bg-inherit"
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
                            value={course.description}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border capitalize border-gray-300 rounded-lg bg-inherit"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="courseImage" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Course Image (PNG, JPG, JPEG):
                        </label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className="mt-1 p-2 w-full border bg-inherit"
                        />
                    </div>

                    {renderCategoryDropdowns()}

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
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
