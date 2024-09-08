"use client"

import React, { useEffect, useId, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

export default function ViewModule() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const contentId = params.contentId as string

    const [oneContent, setOneContent] = useState([]);
    const [course, setCourse] = useState({})

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
                const res = await axios.post('/api/get/one-content', { contentId })
                // console.log(res.data.content)
                setOneContent(res.data.content);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule()
    }, [contentId, courseId]);

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{course.description}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className=" p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{course.title}</li>
                        <li className=" p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-black cursor-pointer">{oneContent.title}</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">{oneContent.title}</h2>
                    </div>
                </div>
            </div>
        </div >
    );
}
