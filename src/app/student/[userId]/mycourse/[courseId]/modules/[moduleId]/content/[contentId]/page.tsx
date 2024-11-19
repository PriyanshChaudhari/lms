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
    content_type: string;
    attachments: string[];
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


    return (
        <div className="">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{course?.description}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className=" p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}?section=modules`)}>{course?.title}</li>
                        <li className=" p-3 rounded-lg-xl text-black cursor-pointer">/</li>
                        <li className=" p-3 rounded-lg-xl text-black cursor-pointer">{oneContent?.title}</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-lg-xl p-6 shadow-md h-26">
                    <h2 className="text-xl font-semibold mb-2">{oneContent?.title}</h2>
                        {oneContent?.attachments?.length > 0 && (
                            <div>
                                {oneContent?.attachments.map((attachment, index) => (
                                    <div key={index} className="mb-4">
                                        {/* <a href={attachment} target="_blank" rel="noopener noreferrer">LINK {index + 1}</a> */}
                                        <iframe
                                            src={attachment}
                                            width="100%"
                                            height="300px"
                                            className="mb-4"
                                            title={`iframe-${index}`}
                                        ></iframe>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* <h2 className="text-xl font-semibold mb-4">{oneContent?.title}</h2> */}
                        {/* <iframe src={oneContent?.content_url} width="100%" height="300px" className='mb-4'></iframe> */}
                    </div>
                </div>
            </div>
        </div >
    );
}
