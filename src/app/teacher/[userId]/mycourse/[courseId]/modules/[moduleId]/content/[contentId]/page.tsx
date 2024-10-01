"use client"

import React, { useEffect, useId, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

interface courses {
    course_id: string;
    title: string;
    description: string;
    teacher_id: string;
    category: string;
}

interface modules {
    id: string;
    course_id: string;
    title: string;
    description: string;
    position: number;
}

interface contents {
    id: string;
    title: string;
    description: string;
    position: number;
    text_content: string;
    content_url: string;
}

export default function ViewModule() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const contentId = params.contentId as string

    const [oneContent, setOneContent] = useState<contents | null>(null);
    const [course, setCourse] = useState<courses | null>(null)
    const [oneModule, setOneModule] = useState<modules | null>(null);

    useEffect(() => {
        const getCourseDetails = async () => {
            try {
                const res = await axios.post('/api/get/course-details', { courseId })
                setCourse(res.data.courseDetails)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseDetails()

        const getOneModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId })
                // console.log(res.data.content)
                setOneModule(res.data.module);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule()

        const getOneContent = async () => {
            try {
                const res = await axios.post('/api/get/one-content', { contentId })
                // console.log(res.data.content)
                setOneContent(res.data.content);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneContent()
    }, [contentId, moduleId, courseId]);

    const handleEditContent = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}/edit-content`)
    }

    const handleDeleteContent = async () => {
        try {
            const res = await axios.delete(`/api/delete/delete-content/${contentId}`);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content`)
    }

    return (
        <div className="border border-gray-300 m-5 flex justify-center items-center h-screen">
            <div className="w-full max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{course?.description}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className=" p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{course?.title}</li>
                        <li className=" p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>{oneModule?.title}</li>
                        <li className=" p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-black cursor-pointer">{oneContent?.title}</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">{oneContent?.title}</h2>
                        <h2 className="text-xl font-semibold mb-2">{oneContent?.content_url}</h2>
                        <h2 className="text-xl font-semibold mb-2">{oneContent?.text_content}</h2>
                        {/* Edit Content Button */}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 mt-2"
                            onClick={handleEditContent} // Function to handle edit
                        >
                            Edit Content
                        </button>
                        <p></p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 mt-2"
                            onClick={handleDeleteContent} // Function to handle edit
                        >
                            Delete Content
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
