"use client";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

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
        description: "",
        content_type: "",
        attachments: ""
    });

    const [files, setFiles] = useState<File[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files)); // Handle multiple files
        }
        console.log(`files from frontend :: $${files}`)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;

        if (content.title.trim() === "" || content.content_type === "" || content.description.trim() === "" || content.module_id.trim() === "" || content.course_id.trim() === "") {
            setError("Please Fill All Required Fields.")
            valid = false;
        }
        if (valid) {
            try {
                const formData = new FormData();
                formData.append("course_id", content.course_id);
                formData.append("module_id", content.module_id);
                formData.append("title", content.title);
                formData.append("content_type", content.content_type);
                formData.append("description", content.description);
                formData.append("attachments", content.attachments);

                // Append all files if content type is "file"
                if (files.length > 0) {
                    files.forEach((file) => {
                        formData.append("files", file);
                    });
                }

                const res = await axios.post("/api/courses/create-content", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                console.log(res.data);
                setContent({
                    course_id: courseId,
                    module_id: moduleId,
                    title: "",
                    content_type: "",
                    description: "",
                    attachments: ""
                });
                setFiles([]);
                setShowModal(false);
                router.push(`/teacher/${userId}/mycourse/${courseId}`);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // const isFormValid = () => {
    //     return (
    //         content.title.trim() !== "" &&
    //         content.content_type !== ""
    //     );
    // };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md mx-auto mt-8 p-6 dark:bg-[#151b23] rounded-lg shadow-md">
                <div className='flex justify-between mb-4 items-center'>
                    <div className="text-2xl font-semibold text-black dark:text-gray-300">Create Content</div>
                    <div onClick={() => (router.back())}>
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
                            Title:
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={content.title}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Description:
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={content.description}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-700"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content_type" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Content Type:
                        </label>
                        <select
                            id="content_type"
                            name="content_type"
                            value={content.content_type}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-700"
                            required
                        >
                            <option value="">Select Content Type</option>
                            <option value="file">File</option>
                            <option value="url">URL</option>
                        </select>
                    </div>

                    {content.content_type === "url" && (
                        <div className="mb-4">
                            <label htmlFor="attachments" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                Attachments:
                            </label>
                            <input
                                type="text"
                                id="attachments"
                                name="attachments"
                                value={content.attachments}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-700"
                                required
                            />
                        </div>
                    )}

                    {content.content_type === "file" && (
                        <div className="mb-4">
                            <label htmlFor="file" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                Upload Files:
                            </label>
                            <input type="file" name="file" required onChange={handleFileChange} />
                        </div>
                    )}

                    <div className="mb-4">
                        <button
                            type="submit"
                            // onClick={() => setShowModal(true)}
                            className='w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
                        // disabled={!isFormValid()}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateContent;
