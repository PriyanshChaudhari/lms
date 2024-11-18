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
    position: number
}

interface ModulesComponentProps {
    userId: string,
    courseId: string,
    moduleId: string;
}

export default function ModulesComponent({ userId, courseId, moduleId }: ModulesComponentProps) {
    const router = useRouter();
    const params = useParams();
    // const userId = params.userId as string;
    // const courseId = params.courseId as string;
    // const moduleId = params.moduleId as string;

    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [courseContent, setCourseContent] = useState<contents[]>([])
    const [course, setCourse] = useState<courses | null>(null)

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
                // console.log(res.data.module)
                setOneModule(res.data.module);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule()

        const getCourseContent = async () => {
            try {
                const res = await axios.post('/api/get/course-content', { moduleId })
                setCourseContent(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseContent()
    }, [moduleId, courseId]);

    const handleViewClick = (contentId: string) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);
    }

    const handleDownloadClick = (contentId: string) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);
    }

    const sortedContent = courseContent ? courseContent.sort((a, b) => a.position - b.position) : [];

    return (
        <div className="flex w-full dark:bg-transparent py-8 px-4">
            <div className="flex-auto max-w-7xl mx-auto">
                <div className="flex gap-4 space-y-6">
                    <div className='flex flex-col w-full'>
                        <h2 className="text-xl font-bold my-2">Contents:</h2>
                        <div className="grid gap-4 items-center mt-4">
                            {sortedContent.map((content) => (
                                <div key={content.id} className="space-y-4 w-full">
                                    <div
                                        className="w-full bg-white flex justify-between border border-gray-200 rounded-lg-xl p-4 shadow-sm hover:shadow-md transition-shadow min-h-6 dark:bg-gray-700">
                                        {/* <h2 className="text-xl font-semibold">{content.title}</h2>
                                        <h2 className="text-xl font-semibold">{content.description}</h2>
                                        <h2 className="text-xl font-semibold">{content.position}</h2>
                                        <div className='flex space-x-2'>
                                            <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300 hover:bg-gray-200' onClick={() => handleViewClick(content.id)}>View</div>
                                            <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300 hover:bg-gray-200' onClick={() => handleDownloadClick(content.id)}>Download</div>
                                        </div> */}
                                        {/* <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300  hover:bg-gray-200' onClick={() => handleContentClick(content.id)} > GO -&gt; </div> */}

                                        <table className="min-w-full bg-white dark:bg-gray-700">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">Title</th>
                                                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">Description</th>
                                                    <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedContent.map((content) => (
                                                    <tr key={content.id}>
                                                        <td className="py-2 px-4 text-center border-b border-gray-200 dark:border-gray-600">{content.title}</td>
                                                        <td className="py-2 px-4 text-center border-b border-gray-200 dark:border-gray-600">{content.description}</td>
                                                        <td className="py-2 px-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-600 space-x-2">
                                                            <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300 hover:bg-gray-200' onClick={() => handleViewClick(content.id)}>View</div>
                                                            <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300 hover:bg-gray-200' onClick={() => handleDownloadClick(content.id)}>Download</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}
