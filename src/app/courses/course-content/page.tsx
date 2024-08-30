"use client";
import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';

const CreateContent = () => {
    const [content, setContent] = useState({
        course_id: "",
        title: "",
        content_type: "",
        content_url: "",
        text_content: "",
        position: ""
    });

    const [errors, setErrors] = useState({
        title: "",
        content_type: "",
        content_url: "",
        text_content: "",
        position: ""
    });

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;

        // Validation
        if (content.title.trim() === "") {
            setErrors(prev => ({ ...prev, title: "Title is required" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, title: "" }));
        }

        if (content.content_type === "") {
            setErrors(prev => ({ ...prev, content_type: "Content type is required" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, content_type: "" }));
        }

        if (content.content_type === 'video' && content.content_url.trim() === "") {
            setErrors(prev => ({ ...prev, content_url: "Content URL is required for videos" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, content_url: "" }));
        }

        if (content.content_type === 'article' && content.text_content.trim() === "") {
            setErrors(prev => ({ ...prev, text_content: "Text content is required for articles" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, text_content: "" }));
        }

        if (content.position.trim() === "" || isNaN(Number(content.position))) {
            setErrors(prev => ({ ...prev, position: "Position must be a valid number" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, position: "" }));
        }

        if (valid) {
            try {
                const res = await axios.post('/api/content/create', content);
                console.log(res.data);
                // Optionally, reset the form
                setContent({
                    course_id: "",
                    title: "",
                    content_type: "",
                    content_url: "",
                    text_content: "",
                    position: ""
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create Content</h2>
            <form onSubmit={handleSubmit}>
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
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                        <option value="resource">Resource</option>
                    </select>
                    {errors.content_type && <p className="text-red-600 text-sm">{errors.content_type}</p>}
                </div>

                {content.content_type === 'video' && (
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
    );
};

export default CreateContent;
