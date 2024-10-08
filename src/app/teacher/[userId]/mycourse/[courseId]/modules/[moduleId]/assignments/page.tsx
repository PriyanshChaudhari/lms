"use client"

import React, { useEffect, useState } from 'react'
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

interface assignments {
    id: string;
    module_id:string;
    title: string;
    due_date: object;
    description: string;
    total_marks: number;
}

export default function ViewModuleAssignments() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

    const handleAssignmentClick = (moduleId: string, assignmentId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`);
    };

    const [course, setCourse] = useState<courses | null>(null)
    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [assignments, setAssignments] = useState<assignments[]>([])

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.post(`/api/get/course-details`, { courseId })
                setCourse(res.data.courseDetails)
            } catch (error) {
                console.log(error)
            }
        }
        getCourse()

        const getOneModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId })
                // console.log(res.data.module)
                setOneModule(res.data.module);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule()

        const getModuleAssignments = async () => {
            try {
                const res = await axios.post('/api/get/assignments/module-assignments', { moduleId })
                setAssignments(res.data.assignments || []);
                console.log(res.data.assignments);
            } catch (error) {
                console.log(error)
            }
        }
        getModuleAssignments();

    }, [courseId, moduleId])

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A"; // Fallback if timestamp is not provided
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    const handleAddAssignment = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/create-assignment`)
    }

    return (
        <div className="border border-gray-300 m-5 h-screen justify-center items-center flex">
            <div className="w-full max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{course?.description}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className=" p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{course?.title}</li>
                        <li className=" p-3 rounded-xl text-black dark:text-white cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-black dark:text-white cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>{oneModule?.title}</li>
                        <li className=" p-3 rounded-xl text-black dark:text-white cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-black dark:text-white cursor-pointer">Assignments</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={handleAddAssignment} // Replace with your add module logic
                        >
                            Add Assignments
                        </button>
                    </div>
                    {assignments.length > 0 ? (
                        assignments.map((ass) => (
                            <div
                                key={ass.id}
                                className=" border border-gray-300 rounded-xl p-6 shadow-md min-h-72 cursor-pointer"
                                onClick={() => handleAssignmentClick(ass.module_id, ass.id)}
                            >
                                <h2 className="text-xl font-semibold mb-6">Title : {ass.title}</h2>
                                <div className="items-center p-5 ">
                                    <p className="text-sm text-gray-600 mb-4">Description : {ass.description}</p>
                                    <p className="text-sm text-gray-600 mb-4">DeadLine : {formatDate(ass.due_date)}</p>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p>No assignments found for this module.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
