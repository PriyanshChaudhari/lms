// ignore page
"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

export default function ViewModules() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const contentId = params.contentId as string;

    const [courseContent, setCourseContent] = useState<any[]>([]);
    const [course, setCourse] = useState({})


    const handleModuleClick = (moduleId: string) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}`);
    };

    useEffect(() => {
        const getCourseDetails = async () => {
            try {
                const res = await axios.post('/api/get/course-details', { courseId })
                setCourse(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseDetails()

        const fetchCourseContent = async () => {
            try {
                const res = await axios.post('/api/get/course-content', { contentId })
                setCourseContent(res.data.content);
            } catch (error) {
                console.error("Error fetching course content: ", error);
            }
        };
        fetchCourseContent()
    }, [contentId, courseId]);


    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{course.description}</p>
                <div className="space-y-4 ">

                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" >
                        <h2 className="text-xl font-semibold mb-2">{courseContent?.title}</h2>
                        <p className="text-sm text-gray-600">The React Framework - created and maintained by @vercel.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
