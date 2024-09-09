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

    const [courseModules, setCourseModules] = useState([])

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
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/create-module`)
    }

    const handleModuleClick = (moduleId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`);
    }

    return (
        <div className="border border-gray-300 m-5 h-screen flex justify-center items-center">
            <div className="w-full max-w-4xl  mx-auto p-5">
                <div className='flex gap-6 justify-center items-center mb-6'>
                    <h1 className='text-2xl font-bold'>Add new Module</h1>
                    <button className='bg-blue-500 hover:bg-blue-600 rounded p-2 text-white text-sm' onClick={createModule}>Add Module</button>
                </div>
                {sortedModules.map((module) => (
                    <div key={module.id} className="space-y-4">
                        <div
                            className="border flex justify-between border-gray-300 my-2 rounded-xl p-4 shadow-md min-h-6 ">
                            <h2 className="text-xl font-semibold">{module.title}</h2>
                            <h2 className="text-xl font-semibold">{module.description}</h2>
                            <h2 className="text-xl font-semibold">{module.position}</h2>
                            <div className='px-3 rounded flex items-center cursor-pointer bg-gray-400  hover:bg-gray-500' onClick={() => handleModuleClick(module.id)} > GO -> </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
