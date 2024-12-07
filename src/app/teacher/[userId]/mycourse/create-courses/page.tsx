"use client";
import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'; // Firebase storage
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from "@/lib/firebaseConfig";
import { IoMdClose } from 'react-icons/io';

const CreateCourse = () => {
    const params = useParams()
    const router = useRouter()
    const userId = params.userId as string;
    const [course, setCourse] = useState({
        title: "",
        description: "",
        teacher_id: userId,
        category: "",
    });
    const [category, setCategory] = useState({
        category_name: "",
        parent_category_id: ""
    });
    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null); // File state
    const [error, setError] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState(false);


    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/get/categories');
            setCategories(res.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

   useEffect(() => {
    if (showMessage) {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000);

        return () => clearTimeout(timer); // Cleanup the timer
    }
}, [showMessage]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const updatedSelectedCategories = [...selectedCategories.slice(0, index + 1)];
        updatedSelectedCategories[index] = value;
        setSelectedCategories(updatedSelectedCategories);

        // Update the category's parent_category_id
        setCategory({ ...category, parent_category_id: value });
    };

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const updateCategoryInCourse = () => {
        return new Promise<void>((resolve) => {
            const selectedCategoryId = selectedCategories[selectedCategories.length - 1];
            console.log(selectedCategoryId);

            setCourse((prevCourse) => ({
                ...prevCourse,
                category: selectedCategoryId,
            }));

            // Since setCourse is async, use a setTimeout to simulate state update completion
            setTimeout(() => {
                resolve();
            }, 0);
        });
    };

    const validateForm = () => {
        if (course.title.trim() === "" || course.description.trim() === "") {
            setError("Please Fill All Required Fields.")
            return false;
        }
        return true
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateCategoryInCourse(); // Ensure category is updated before proceeding
        if (!validateForm()) {
            return; // Exit if validation fails
        }

        try {
            const formSubmissionData = new FormData();
            formSubmissionData.append('title', course.title);
            formSubmissionData.append('description', course.description);
            formSubmissionData.append('teacher_id', course.teacher_id);
            formSubmissionData.append('category', course.category);
            console.log(course.title,course.description,course.teacher_id,course.category)

            // Attach the image file to the form data
            if (file) {
                formSubmissionData.append('file', file);
            }

            // Send form data to the backend
            const res = await axios.post('/api/courses/create-courses', formSubmissionData);
            if (res.status === 201) {
                // Handle successful course creation
                setCourse({
                    title: '',
                    description: '',
                    category: '',
                    teacher_id: userId,
                });
                setFile(null);
                setShowMessage(true);
                router.push(`/teacher/${userId}/dashboard`)                
            }
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

    const closeShowMessage = () => {
        router.push(`/teacher/${userId}/dashboard`);
        setShowMessage(false);
    }

    return (
        <div className=''>
            <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-[#151b23] rounded-lg shadow-md">
            {showMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Course Created Successfully
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Course added to the category sucessfully.
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
                <div className='flex justify-between mb-4 items-center'>
                    <div className="text-2xl font-semibold text-black dark:text-gray-300">Create Course</div>
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-[#151b23] uppercase"
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
                            autoCapitalize='true'
                            value={course.description}
                            onChange={handleChange}
                            className="mt-1  capitalize p-2 w-full border border-gray-300 rounded-lg dark:bg-[#151b23]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="courseImage" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Course Image  (PNG, JPG, JPEG):
                        </label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className="mt-1 p-2 w-full border"
                        />
                    </div>

                    {renderCategoryDropdowns()}

                    <div className='mt-4'>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                            Create Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
