"use client";
import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'; // Firebase storage
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from "@/lib/firebaseConfig";

const CreateCourse = () => {
    const params = useParams()
    const router = useRouter()
    const userId = params.userId;
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
    const [error, setError] = useState('');


    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/get/categories');
            setCategories(res.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

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
        const { title, description, category, teacher_id } = course;
        if (!title || !description || !category || !teacher_id) {
            setError('Please fill in all required fields.');
            return false;
        }
        // if (!file) {
        //     setError('Please upload file.');
        //     return false;
        // }
        return true;
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
                router.push(`/teacher/${userId}/dashboard`);
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
                    <label className="block text-sm font-medium text-gray-700">
                        {i === 0 ? "Top-Level Category" : `Subcategory Level ${i}`}
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

    return (
        <div className=''>
            <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-[#151b23] rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Create a New Course</h2>
                {error}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                            Course Title
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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                            Description
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
                        <label htmlFor="courseImage" className="block text-sm font-medium">
                            Upload File
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
