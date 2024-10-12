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
        coursePicUrl: "",
        teacher_id: userId,
        category: ""
    });

    const [categories, setCategories] = useState<{ id: string; category_name: string; parent_category_id: string | null }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // To manage loading state
    const [imageFile, setImageFile] = useState<File | null>(null);

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
                    coursePicUrl: courseData.coursePicUrl || defaultCoursePicUrl,
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

    const handleCategoryChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const updatedSelectedCategories = [...selectedCategories.slice(0, index + 1)];
        updatedSelectedCategories[index] = value;
        setSelectedCategories(updatedSelectedCategories);

        // Update the category in the course
        setCourse({ ...course, category: value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageFile(file || null);
    };

    const uploadImageAndGetUrl = async () => {
        if (!imageFile) {
            return course.coursePicUrl; // Keep the old image if no new file is uploaded
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

        try {
            console.log("Updating course:", course);

            const res = await axios.put(`/api/put/update-course/${courseId}`, {
                ...course,
                coursePicUrl // Use the new or old image URL
            }); // Send updated data
            console.log("Course updated:", res.data);

            // Optionally, redirect after successful update
            router.push(`/teacher/${userId}/mycourse`);
        } catch (error) {
            console.error("Error updating course:", error);
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
                            onChange={handleImageChange}
                            className="mt-1 p-2 w-full border"
                        />
                    </div>

                    {/* <div className="mb-4">
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
                </div> */}

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
