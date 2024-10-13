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
        coursePicUrl: ""
    });
    const [category, setCategory] = useState({
        category_name: "",
        parent_category_id: ""
    });
    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const defaultCoursePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-course-pic.png?alt=media`;

    const hasFetchedTeachers = useRef(false);
    const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);

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

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageFile(file || null);
    };

    const uploadImageAndGetUrl = async () => {
        if (!imageFile) {
            // Return default course picture URL if no file is uploaded
            return defaultCoursePicUrl;
        }

        if (!course.title.trim()) {
            throw new Error('Title cannot be empty when uploading an image');
        }

        const formattedTitle = course.title.replace(/\s+/g, '-').toLowerCase();
        const storageRef = ref(storage, `course-images/${formattedTitle}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        return await getDownloadURL(uploadTask.ref);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const coursePicUrl = await uploadImageAndGetUrl();
        await updateCategoryInCourse();
        console.log(course.category);

        try {
            const res = await axios.post('/api/courses/create-courses', {
                ...course,
                coursePicUrl,
                category: selectedCategories[selectedCategories.length - 1], // Ensure the latest category
            });
            const data = res.data;
            console.log(data);

            // Optionally, you can reset the form after successful submission
            setCourse({
                title: "",
                description: "",
                coursePicUrl: "",
                teacher_id: userId,
                category: ""
            });
            router.push(`/teacher/${userId}/mycourse/`)
        } catch (error) {
            console.error(error);
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

    return (
        <div className=''>
            <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Create a New Course</h2>
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-800 uppercase"
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
                            className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-800"
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
                            onChange={handleImageChange}
                            className="mt-1 p-2 w-full border"
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

                    {/*<div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={course.category}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-800"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        {/* Add more categories as needed *\/}
                    </select>
                </div>*/}

                    {renderCategoryDropdowns()}

                    <div className='mt-4'>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
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
