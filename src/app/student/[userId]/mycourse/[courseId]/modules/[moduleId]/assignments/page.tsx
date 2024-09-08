"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

export default function ViewModuleAssignments() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const contentId = params.moduleId as string;

    const handleAssignmentClick = (moduleId: string, assignmentId: number) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${contentId}/assignments/${assignmentId}`);
    };

    const [assignments, setAssignments] = useState()
    useEffect(() => {
        const getAsssignments = async () => {
            try {
                const res = await axios.post('api/get/assignments', { courseId })
                setAssignments(res.data.assignments)
                console.log(assignments)
            } catch (error) {
                console.log(error)
            }
        }
        getAsssignments();

    }, [courseId])

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">sdfgh
                <h1 className="text-3xl font-bold mb-4">Course {params.courseId}</h1>
                <p className="text-lg text-gray-700 mb-6">Description of course 1</p>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleAssignmentClick(contentId, 1)}>
                        <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                        <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                            <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                            <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                            <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleAssignmentClick(contentId, assignments.id)}>
                        <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                        <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                            <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                            <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                            <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
