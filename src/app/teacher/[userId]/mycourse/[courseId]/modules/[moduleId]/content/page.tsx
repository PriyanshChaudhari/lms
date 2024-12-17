// ignore page
"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

export default function ViewContent() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

    interface CourseContent {
        id: string;
        title: string;
        description: string;
        position: number;
    }

    const [courseContent, setCourseContent] = useState<CourseContent[]>([])

    useEffect(() => {
        const getCourseContent = async () => {
            try {
                const res = await axios.post('/api/get/course-content', { moduleId })
                setCourseContent(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseContent()
    }, [moduleId]);

    const sortedContent = courseContent.sort((a, b) => a.position - b.position);

    const createContent = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/create-content`)
    }

    const handleContentClick = (contentId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);
    }

    return (
        <div className=" h-screen flex justify-center items-center">
            <div className="w-full max-w-4xl mx-auto p-5 grid gap-4">
                <div> <button className='bg-blue-500 hover:bg-blue-600 text-white  p-2' onClick={createContent}>Add Content</button></div>
                {sortedContent.map((content) => (
                    <div key={content.id} className="space-y-4 grid gap-4">
                        <div
                            className="bg-white border flex justify-between border-gray-300 rounded-lg-xl p-4 shadow-md min-h-6 ">
                            <h2 className="text-xl font-semibold">{content.title}</h2>
                            <h2 className="text-xl font-semibold">{content.description}</h2>
                            <h2 className="text-xl font-semibold">{content.position}</h2>
                            <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300  hover:bg-gray-200' onClick={() => handleContentClick(content.id)} > GO -&gt; </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
