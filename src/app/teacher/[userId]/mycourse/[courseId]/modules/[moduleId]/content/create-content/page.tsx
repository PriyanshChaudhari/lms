"use client";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const CreateContent = () => {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

    const [content, setContent] = useState({
        course_id: courseId,
        module_id: moduleId,
        title: "",
        content_type: "",
        text_content: "",
        position: "",
    });

    const [errors, setErrors] = useState({
        course_id: "",
        module_id: "",
        title: "",
        content_type: "",
        text_content: "",
        position: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;
        const newErrors = {
            module_id: "",
            title: "",
            content_type: "",
            text_content: "",
            position: "",
        };

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

        if (content.content_type === "article" && content.text_content.trim() === "") {
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
                const formData = new FormData();
                formData.append("course_id", content.course_id);
                formData.append("module_id", content.module_id);
                formData.append("title", content.title);
                formData.append("content_type", content.content_type);
                formData.append("text_content", content.text_content);
                formData.append("position", content.position);
                if (file) {
                    formData.append("file", file);
                }

                const res = await axios.post("/api/courses/create-content", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                console.log(res.data);
                setContent({
                    course_id: "",
                    module_id: "",
                    title: "",
                    content_type: "",
                    text_content: "",
                    position: "",
                });
                setErrors({
                    course_id: "",
                    module_id: "",
                    title: "",
                    content_type: "",
                    text_content: "",
                    position: "",
                });
                setFile(null);
                setShowModal(false);
                router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content`);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const isFormValid = () => {
        return (
            content.title.trim() !== "" &&
            content.content_type !== "" &&
            (content.content_type !== "article" || content.text_content.trim() !== "") &&
            content.position.trim() !== "" &&
            !isNaN(Number(content.position))
        );
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md mx-auto mt-8 p-6 dark:bg-gray-800 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Create Content</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={content.title}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-700"
                            required
                        />
                        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Content Type
                        </label>
                        <select
                            id="content_type"
                            name="content_type"
                            value={content.content_type}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-700"
                            required
                        >
                            <option value="">Select Content Type</option>
                            <option value="video">Video</option>
                            <option value="article">Audio</option>
                            <option value="assignment">Assignment</option>
                        </select>
                        {errors.content_type && <p className="text-red-600 text-sm">{errors.content_type}</p>}
                    </div>

                    {content.content_type === "article" && (
                        <div className="mb-4">
                            <label htmlFor="text_content" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Text Content
                            </label>
                            <textarea
                                id="text_content"
                                name="text_content"
                                value={content.text_content}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-700"
                                required
                            />
                            {errors.text_content && <p className="text-red-600 text-sm">{errors.text_content}</p>}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Position
                        </label>
                        <input
                            type="number"
                            id="position"
                            name="position"
                            value={content.position}
                            onChange={handleChange}
                            min={1}
                            className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-700"
                            required
                        />
                        {errors.position && <p className="text-red-600 text-sm">{errors.position}</p>}
                    </div>

                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className={`w-full py-2 px-4 rounded ${isFormValid() ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                            disabled={!isFormValid()}
                        >
                            Upload File
                        </button>
                    </div>
                </form>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-md lg:left-32 md:left-32">
                            <h3 className="text-xl font-bold mb-4">Upload File</h3>
                            <input type="file" onChange={handleFileChange} />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create Content
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
};

export default CreateContent;
