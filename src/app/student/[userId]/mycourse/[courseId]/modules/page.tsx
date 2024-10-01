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

    const [courseModules, setCourseModules] = useState<modules[]>([])

    useEffect(() => {
        const getCourseModules = async () => {
            try {
                const res = await axios.post('/api/get/course-modules', { courseId })
                setCourseModules(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseModules()
    }, [courseId]);

    const sortedModules = courseModules.sort((a, b) => a.position - b.position);

    const createModule = () => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/create-module`)
    }

    const handleModuleClick = (moduleId: string) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}`);
    }

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <button className='bg-red-300 hover:bg-red-400' onClick={createModule}>Add Module</button>
                {sortedModules.map((module) => (
                    <div key={module.id} className="space-y-4">
                        <div
                            className="bg-white border flex justify-between border-gray-300 rounded-xl p-4 shadow-md min-h-6 ">
                            <h2 className="text-xl font-semibold">{module.title}</h2>
                            <h2 className="text-xl font-semibold">{module.description}</h2>
                            <h2 className="text-xl font-semibold">{module.position}</h2>
                            <div className='px-3 rounded-xl cursor-pointer bg-gray-300  hover:bg-gray-200' onClick={() => handleModuleClick(module.id)} > GO -> </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
