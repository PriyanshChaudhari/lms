"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import SubmissionsTable from './SubmissionsTable';

interface courses {
    course_id: string;
    title: string;
    description: string;
    teacher_id: string;
    category: string;
}

interface modules {
    id: string;
    title: string;
    description: string;
}

interface assignments {
    id: string;
    title: string;
    created_at: object;
    due_date: object;
    description: string;
    total_marks: number;
}

interface Submission {
    submission_id: string;
    user: {
        id: string;
        first_name: string;
        last_name: string;
    };
    submission_date: {
        seconds: number;
    };
    graded: boolean;
}

export default function ViewModuleAssignment() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [courses, setCourses] = useState<courses | null>(null);
    const [oneAssignment, setOneAssignment] = useState<assignments | null>(null);
    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [error, setError] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ confirmText: string }>({
        confirmText: ''
    });

    const [showdeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);


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
                // console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getModuleAssignments();

        const fetchSubmissions = async () => {
            try {
                const response = await axios.post(`/api/assignments/${assignmentId}/submission/`, { assignmentId });
                if (response.status === 200) {
                    setSubmissions(response.data.submissions);
                } else {
                    setError('Failed to fetch submissions');
                }
            } catch (error) {
                console.log(error);
                setError('An error occurred while fetching submissions.');
            }
        };
        fetchSubmissions();

    }, [assignmentId, moduleId, courseId])

    const handleDeleteAssignment = async () => {
        if (deleteConfirmation.confirmText.toLowerCase() !== 'confirm') {
            alert('Deletion cancelled. Please type "confirm" to delete.');
            return;
        }
        try {
            const response = await axios.delete(`/api/assignments/${assignmentId}/delete-assignment`);
            if (response.status === 200) {
                window.location.href = `/teacher/${userId}/mycourse/${courseId}?section=assignments`;
            } else {
            }
        } catch (error) {
            console.error('An error occurred while deleting the assignment.');
        }

    }

    const handleEditAssignment = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/edit-assignment`)
    }

    const handleViewSubmission = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/submission`)
    }

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A"; // Fallback if timestamp is not provided
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    return (
       
        <div className="min-h-screen bg-gray-50 dark:bg-transparent py-8 px-4">
            {showdeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Confirm Assignment Deletion
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this assignment?
                            Type &quot;confirm&quot; below to proceed.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmation.confirmText}
                            onChange={(e) => setDeleteConfirmation({
                                confirmText: e.target.value
                            })}
                            className="w-full px-3 py-2 border rounded-lg mb-4 dark:bg-[#151b23]"
                            placeholder="Type 'confirm' here"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button

                                onClick={handleDeleteAssignment}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="max-w-7xl mx-auto">

                <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {courses?.title} - Assignment
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">{courses?.description}</p>
                </div>


                <nav className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm mb-8">
                    <ul className="flex p-2 gap-2">
                        <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}?section=assignments`)}>{courses?.title}</li>
                        <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
                        <li className="p-3 rounded-lg-xl text-black cursor-pointer">{oneAssignment?.title}</li>
                    </ul>
                </nav>

                <div className="space-y-6">
                    <div>
                        <div className="grid gap-4 ">
                            <div>
                                <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-start justify-start p-6">
                                    <div className=" w-full p-6  h-26">
                                        <h2 className="text-xl font-semibold mb-2">{oneAssignment?.title} </h2>
                                        <p className="text-sm text-gray-600">Opened : {formatDate(oneAssignment?.created_at)}</p>
                                        <p className="text-sm text-gray-600">Due date : {formatDate(oneAssignment?.due_date)}</p>
                                        <div className='flex justify-start gap-6 items-center'>
                                            <div className='flex justify-center gap-6 mt-4'>
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg-lg hover:bg-blue-600"
                                                    onClick={handleEditAssignment} // Replace with your add module logic
                                                >
                                                    Edit Assignment
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    onClick={() =>  setShowDeleteConfirmation(true)} // Replace with your add module logic
                                                >
                                                    Delete Assignment
                                                </button>
                                                {/* <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    onClick={handleViewSubmission} // Replace with your add module logic
                                                >
                                                    View Submissions
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex w-full'>

                                        <SubmissionsTable
                                            submissions={submissions}
                                            userId={userId}
                                            courseId={courseId}
                                            moduleId={moduleId}
                                            assignmentId={assignmentId}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
