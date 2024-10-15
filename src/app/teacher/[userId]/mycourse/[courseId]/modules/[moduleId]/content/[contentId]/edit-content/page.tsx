"use client"
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { describe } from 'node:test';

const EditContent = () => {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const contentId = params.contentId as string;

    const [content, setContent] = useState({
        course_id: courseId,
        module_id: moduleId,
        title: "",
        description: "",
        content_type: "",
        attachments: [] as string[],
    });
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [deleteFiles, setDeleteFiles] = useState<string[]>([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.post('/api/get/one-content', { contentId });
                const fetchedContent = res.data.content;
                setContent({
                    course_id: courseId, // Include course_id from the parameters
                    module_id: moduleId, // Include module_id from the parameters
                    title: fetchedContent.title,
                    description: fetchedContent.description,
                    content_type: fetchedContent.content_type,
                    attachments: fetchedContent.attachments,
                });
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };
        fetchContent();
    }, [contentId]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles(Array.from(e.target.files)); // Handle multiple files
        }
    };

    const handleDeleteAttachment = (fileUrl: string) => {
        setDeleteFiles((prev) => [...prev, fileUrl]);
        setContent((prevContent) => ({
            ...prevContent,
            attachments: prevContent.attachments.filter((url) => url !== fileUrl),
        }));
    };

    function extractTitleFromUrl(url: string) {
        // Check if the url is a string
        if (typeof url !== 'string') {
            console.error("Invalid input: expected a string");
            return undefined; // Return undefined if input is not a string
        }

        // Split the URL by the underscore
        const parts = url.split('_');

        // Safeguard against .pop() returning undefined
        const lastPart = parts.length > 0 ? parts.pop() : '';

        // If lastPart is defined, remove query parameters; otherwise, return an empty string
        const cleanTitle = lastPart ? lastPart.split('?')[0] : '';

        return cleanTitle;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", content.title);
            formData.append("description", content.description);
            formData.append("content_type", content.content_type);
            formData.append("course_id", content.course_id);
            formData.append("module_id", content.module_id);
            console.log("form " + formData.entries())
            // Append files to formData
            newFiles.forEach((file) => formData.append("newFiles", file));

            // Send delete files list
            formData.append("deleteFiles", JSON.stringify(deleteFiles));

            const res = await axios.put(`/api/put/update-content/${contentId}`, formData);

            console.log(res.data);
            router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md mx-auto mt-8 p-6 dark:bg-[#151b23] rounded shadow-md">
                <h2>Edit Content</h2>
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
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={content.description}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-700"
                            required
                        />

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
                            <option value="file">File</option>
                            <option value="url">URL</option>
                        </select>
                    </div>

                    {content.content_type === "url" && (
                        <div className="mb-4">
                            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Attachments
                            </label>
                            <input
                                type="text"
                                id="attachments"
                                name="attachments"
                                value={content.attachments}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded dark:bg-gray-700"

                            />
                        </div>
                    )}

                    {content.content_type === "file" && (
                        <div className="mb-4">
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-white">
                                Upload Files
                            </label>
                            <input type="file" name="file" multiple onChange={handleFileChange} />
                        </div>
                    )}

                    <h3>Existing Attachments</h3>
                    <ul>
                        {content.attachments.map((fileUrl) => (
                            <li key={fileUrl}>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    {extractTitleFromUrl(fileUrl)}  {/* Pass fileUrl directly as a string */}
                                </a>
                                <button type="button" onClick={() => handleDeleteAttachment(fileUrl)}>
                                    Delete
                                </button>
                            </li>
                        ))}

                    </ul>

                    <div className="mb-4">
                        <button
                            type="submit"
                            className='w-full py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white'
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditContent;
