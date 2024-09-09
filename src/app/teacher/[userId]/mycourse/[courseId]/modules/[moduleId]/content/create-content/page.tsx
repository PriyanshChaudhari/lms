"use client";
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

const CreateContent = () => {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

    const [content, setContent] = useState({
        module_id: moduleId,
        title: "",
        content_type: "",
        content_url: "",
        text_content: "",
        position: ""
    });

    const [courses, setCourses] = useState([]);
    const [errors, setErrors] = useState({
        module_id: moduleId,
        title: "",
        content_type: "",
        content_url: "",
        text_content: "",
        position: ""
    });

    // useEffect(() => {
    //     const fetchCourses = async () => {
    //         try {
    //             const res = await axios.get('/api/get/courses');
    //             setCourses(res.data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     fetchCourses();
    // }, []);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;
        const newErrors = {
            module_id: "",
            title: "",
            content_type: "",
            content_url: "",
            text_content: "",
            position: ""
        };

        // Validation
        if (content.module_id.trim() === "") {
            newErrors.module_id = "Course is required";
            valid = false;
        }

        if (content.title.trim() === "") {
            newErrors.title = "Title is required";
            valid = false;
        }

        if (content.content_type === "") {
            newErrors.content_type = "Content type is required";
            valid = false;
        }

        if (content.content_type === 'video' && content.content_url.trim() === "") {
            newErrors.content_url = "Content URL is required for videos";
            valid = false;
        }

        if (content.content_type === 'article' && content.text_content.trim() === "") {
            newErrors.text_content = "Text content is required for articles";
            valid = false;
        }

        if (content.position.trim() === "" || isNaN(Number(content.position))) {
            newErrors.position = "Position must be a valid number";
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            try {
                const res = await axios.post('/api/courses/create-content', content);
                console.log(res.data);
                // Optionally, reset the form
                setContent({
                    module_id: "",
                    title: "",
                    content_type: "",
                    content_url: "",
                    text_content: "",
                    position: ""
                });
                setErrors({
                    module_id: "",
                    title: "",
                    content_type: "",
                    content_url: "",
                    text_content: "",
                    position: ""
                });
                router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content`)
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
       <div className='flex justify-center items-center h-screen'>
         <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create Content</h2>
            <form onSubmit={handleSubmit}>
                {/* <div className="mb-4">
                    <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
                        Course
                    </label>
                    <select
                        id="course_id"
                        name="course_id"
                        value={content.course_id}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map((course: any) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                    {errors.course_id && <p className="text-red-600 text-sm">{errors.course_id}</p>}
                </div> */}

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={content.title}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                    {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="content_type" className="block text-sm font-medium text-gray-700">
                        Content Type
                    </label>
                    <select
                        id="content_type"
                        name="content_type"
                        value={content.content_type}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Content Type</option>
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="assignment">Assignment</option>
                        <option value="resource">Resource</option>
                    </select>
                    {errors.content_type && <p className="text-red-600 text-sm">{errors.content_type}</p>}
                </div>

                {(content.content_type === 'video' || content.content_type === 'assignment' || content.content_type === 'resource') && (
                    <div className="mb-4">
                        <label htmlFor="content_url" className="block text-sm font-medium text-gray-700">
                            Content URL
                        </label>
                        <input
                            type="text"
                            id="content_url"
                            name="content_url"
                            value={content.content_url}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                        {errors.content_url && <p className="text-red-600 text-sm">{errors.content_url}</p>}
                    </div>
                )}

                {content.content_type === 'article' && (
                    <div className="mb-4">
                        <label htmlFor="text_content" className="block text-sm font-medium text-gray-700">
                            Text Content
                        </label>
                        <textarea
                            id="text_content"
                            name="text_content"
                            value={content.text_content}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                        {errors.text_content && <p className="text-red-600 text-sm">{errors.text_content}</p>}
                    </div>
                )}


                <div className="mb-4">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                        Position
                    </label>
                    <input
                        type="number"
                        id="position"
                        name="position"
                        value={content.position}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                    {errors.position && <p className="text-red-600 text-sm">{errors.position}</p>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Create Content
                    </button>
                </div>
            </form>
        </div>
       </div>
    );
};

export default CreateContent;
