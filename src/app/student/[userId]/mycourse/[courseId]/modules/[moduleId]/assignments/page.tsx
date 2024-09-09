"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

export default function ViewModuleAssignments() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

    const handleAssignmentClick = (moduleId: string, assignmentId: number) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`);
    };

    const [courses, setCourses] = useState({})
    const [assignments, setAssignments] = useState([])

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.post(`/api/get/course-details`, { courseId })
                setCourses(res.data.courseDetails)
            } catch (error) {
                console.log(error)
            }
        }
        getCourse()

        const getModuleAssignments = async () => {
            try {
                const res = await axios.post('/api/get/assignments/module-assignments', { moduleId })
                setAssignments(res.data)
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getModuleAssignments();

    }, [moduleId, courseId])

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A"; // Fallback if timestamp is not provided
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{courses.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{courses.description}</p>

                <div className="space-y-4 ">

                    {assignments.length > 0 ? (
                        assignments.map((ass) => (
                            <div
                                key={ass.id}
                                className="bg-white border border-gray-300 rounded-xl p-6 shadow-md min-h-72">
                                <h2 className="text-xl font-semibold mb-6">Title : {ass.title}</h2>
                                <div className="shadow-md items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                    <p className="text-sm text-gray-600 mb-4">Description : {ass.description}</p>
                                    <p className="text-sm text-gray-600 mb-4">DeadLine : {formatDate(ass.due_date)}</p>
                                    <button className='bg-gray-950 text-white px-4 py-2 rounded-xl hover:bg-gray-700 ' onClick={() => handleAssignmentClick(moduleId, ass.id)}> Submit Assignment</button>
                                </div>


                            </div>
                        ))
                    ) : (
                        <p>No assignments found for this module.</p>
                    )}
                </div>
            </div >
        </div >
    );
}
