"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

export default function ViewModuleAssignment() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;


    const [courses, setCourses] = useState({})
    const [oneAssignment, setOneAssignment] = useState({})
    const [oneModule, setOneModule] = useState([]);

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

        const getOneModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId })
                // console.log(res.data.content)
                setOneModule(res.data.content);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule()

        const getModuleAssignments = async () => {
            try {
                const res = await axios.post('/api/get/assignments/one-assignments', { assignmentId })
                setOneAssignment(res.data)
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getModuleAssignments();
    }, [assignmentId, moduleId, courseId])

    const handleDeleteAssignment = async () => {
        try {
            const res = await axios.delete(`/api/delete/delete-assignment/${assignmentId}`);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`)
    }

    const handleEditAssignment = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/edit-assignment`)
    }

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
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/mycourse/${params.courseId}`)}>{courses.title}</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        {params.moduleId ? (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>Module {oneModule.title}</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        ) : (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/assignments`)}>Assignments</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        )}
                        <li className="p-3 rounded-xl text-black cursor-pointer">{oneAssignment.title}</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">{oneAssignment.title}</h2>
                        <p className="text-sm text-gray-600">Opened : {formatDate(oneAssignment.created_at)}</p>
                        <p className="text-sm text-gray-600">Due date : {formatDate(oneAssignment.due_date)}</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                            onClick={handleEditAssignment} // Replace with your add module logic
                        >
                            Edit Assignments
                        </button>
                        <br />
                        <br />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                            onClick={handleDeleteAssignment} // Replace with your add module logic
                        >
                            Delete Assignments
                        </button>
                    </div>
                    <div>
                        <button
                            className="bg-black text-white rounded-xl p-3 my-5"
                            onClick={() => router.push(params.moduleId ? `/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/add-submission` : `/teacher/${userId}/mycourse/${courseId}/assignments/${assignmentId}/add-submission`)}
                        >
                            Add Submission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
