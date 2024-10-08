"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import AddSubmission from './AddSubmission';

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
    title: string;
    description: string;
    module_id: string;
    total_marks: number;
    due_date: string
    created_at: string;
    attachment_url: string;
}

export default function ViewModuleAssignment() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;


    const [courses, setCourses] = useState<courses | null>(null)
    const [oneAssignment, setOneAssignment] = useState<assignments | null>(null)
    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [submissionExists, setSubmissionExists] = useState<boolean>(false);

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
                // console.log(res.data.module)
                setOneModule(res.data.module);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule()

        const getModuleAssignments = async () => {
            try {
                const res = await axios.post('/api/get/assignments/one-assignments', { assignmentId })
                setOneAssignment(res.data.assignment)
                // console.log(res.data.assignment)

                // const submissionRes = await axios.post('/api/get/assignments/check-submission', { userId, assignmentId });
                // setSubmissionExists(submissionRes.data.exists);
            } catch (error) {
                console.log(error)
            }
        }
        getModuleAssignments();
    }, [assignmentId, moduleId, courseId, userId])

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A"; // Fallback if timestamp is not provided
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    const isPastDue = (dueDate: any) => {
        if (!dueDate) return false;
        const currentDate = new Date();
        const due = new Date(dueDate.seconds * 1000);
        return currentDate > due;
    };

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{courses?.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{courses?.description}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/mycourse/${params.courseId}`)}>{courses?.title}</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        {/*{params.moduleId ? (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>Module {oneModule?.title}</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        ) : (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/assignments`)}>Assignments</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        )} */}
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>Module {oneModule?.title}</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`)}>Assignments</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">{oneAssignment?.title}</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">{oneAssignment?.title}</h2>
                        <p className="text-sm text-gray-600">Opened : {formatDate(oneAssignment?.created_at)}</p>
                        <p className="text-sm text-gray-600">Due date : {formatDate(oneAssignment?.due_date)}</p>
                        <a href={oneAssignment?.attachment_url} download className="text-md text-gray-600">Download Attachment</a>
                    </div>
                    {/* <div>
                        <button
                            className="bg-gray-950 hover:bg-gray-700 text-white rounded-xl px-4 py-2"
                            onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/add-submission`)}
                        >
                            Add Submission
                        </button>
                    </div> */}
                    {!isPastDue(oneAssignment?.due_date) && (
                        <div>
                            <button
                                className="bg-gray-950 hover:bg-gray-700 text-white rounded-xl px-4 py-2"
                                onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/${submissionExists ? 'edit-submission' : 'add-submission'}`)}
                            >
                                {submissionExists ? "Edit Submission" : "Add Submission"}
                            </button>
                        </div>
                    )}

                    <AddSubmission/>
                </div>
            </div>
        </div>
    );
}
