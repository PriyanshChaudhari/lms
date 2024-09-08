"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

export default function ViewModuleAssignment({ params }: { params: { courseId: string; moduleId?: number; assignmentId: number } }) {
    const router = useRouter();


    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Assignment {params.assignmentId}</h1>
                <p className="text-lg text-gray-700 mb-6">Description of course {params.courseId}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/mycourse/${params.courseId}`)}>Course {params.courseId}</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        {params.moduleId ? (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/mycourse/${params.courseId}/modules/${params.moduleId}`)}>Module {params.moduleId}</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        ) : (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/mycourse/${params.courseId}/assignments`)}>Assignments</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        )}
                        <li className="p-3 rounded-xl text-black cursor-pointer">Assignment 1</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Assignment Description</h2>
                        <p className="text-sm text-gray-600">Opened: 30 OCT</p>
                        <p className="text-sm text-gray-600">Due date: 30 OCT</p>
                    </div>
                    <div>
                        <button
                            className="bg-black text-white rounded-xl p-3 my-5"
                            onClick={() => router.push(params.moduleId ? `/student/mycourse/${params.courseId}/modules/${params.moduleId}/assignments/${params.assignmentId}/add-submission` : `/student/mycourse/${params.courseId}/assignments/${params.assignmentId}/add-submission`)}
                        >
                            Add Submission
                        </button>
                    </div>
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Assignment Description</h2>
                        <p className="text-sm text-gray-600">Opened: 30 OCT</p>
                        <p className="text-sm text-gray-600">Due date: 30 OCT</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
