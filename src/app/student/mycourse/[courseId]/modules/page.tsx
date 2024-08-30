"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

export default function ViewModules({ params }: { params: { courseId: string } }){
    const router = useRouter();
    const handleModuleClick = (moduleId: string) => {
        router.push(`/student/mycourse/${params.courseId}/modules/${moduleId}`);
    };

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Course {params.courseId}</h1>
                <p className="text-lg text-gray-700 mb-6">Description of course 1</p>
                <div className="space-y-4 ">
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleModuleClick("1")}>
                                <h2 className="text-xl font-semibold mb-2">Module One</h2>
                                <p className="text-sm text-gray-600">The React Framework - created and maintained by @vercel.</p>
                            </div>
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleModuleClick("2")}>
                                <h2 className="text-xl font-semibold mb-2">Module Two</h2>
                                <p className="text-sm text-gray-600">Advanced concepts of React.</p>
                            </div>
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleModuleClick("3")}>
                                <h2 className="text-xl font-semibold mb-2">Module Three</h2>
                                <p className="text-sm text-gray-600">Advanced concepts of React.</p>
                            </div>
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer " onClick={() => handleModuleClick("4")}>
                                <h2 className="text-xl font-semibold mb-2">Module Four</h2>
                                <p className="text-sm text-gray-600">Advanced concepts of React.</p>
                            </div>
                        </div>
            </div>
        </div>
    );
}
