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

interface assignments {
    id: string;
    title: string;
    created_at: object;
    due_date: object;
    description: string;
    total_marks: number;
}

export default function ViewAssignment() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId;
    const courseId = params.courseId as string;
    const assignmentId = params.assignmentId as string;

    const [courses, setCourses] = useState<courses | null>(null);
    const [oneAssignment, setOneAssignment] = useState<assignments | null>(null); // Initialize as null

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.post('/api/get/course-details', { courseId });
                setCourses(res.data.courseDetails);
            } catch (error) {
                console.log(error);
            }
        };
        getCourse();

        const getOneAssignment = async () => {
            try {
                const res = await axios.post('/api/get/assignments/one-assignments', { assignmentId });
                setOneAssignment(res.data.assignment);
            } catch (error) {
                console.log(error);
            }
        };
        getOneAssignment();
    }, [courseId, assignmentId]);

    const formatDate = (timestamp:any) => {
        if (!timestamp) return "N/A"; // Fallback if timestamp is not provided
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{courses?.title || 'Course Title'}</h1>
                <p className="text-lg text-gray-700 mb-6">{courses?.description || 'Course Description'}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}`)}>{courses?.title || 'Course Title'}</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        {params.moduleId ? (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${params.moduleId}`)}>Module {params.moduleId}</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        ) : (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/assignments`)}>Assignments</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        )}
                        <li className="p-3 rounded-xl text-black cursor-pointer">{oneAssignment ? oneAssignment.title : 'Assignment Title'}</li>
                    </ul>
                </nav>

                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">
                            {oneAssignment?.description || 'No description available'}
                        </h2>
                        <p className="text-sm text-gray-600">Opened: {oneAssignment ? formatDate(oneAssignment.created_at) : 'N/A'}</p>
                        <p className="text-sm text-gray-600">Due date: {oneAssignment ? formatDate(oneAssignment.due_date) : 'N/A'}</p>
                    </div>

                    <div>
                        <button
                            className="bg-gray-950 hover:bg-gray-700 text-white rounded-xl px-4 py-2"
                            onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/assignments/${assignmentId}/add-submission`)}
                        >
                            Add Submission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}