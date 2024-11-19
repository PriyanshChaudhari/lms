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

export default function ViewModuleAssignment() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;
    const assignmentId = params.assignmentId as string;


    const [courses, setCourses] = useState<courses | null>(null);
    const [oneAssignment, setOneAssignment] = useState<assignments | null>(null);
    const [oneModule, setOneModule] = useState<modules | null>(null);

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
    }, [assignmentId, moduleId, courseId])

    const handleDeleteAssignment = async () => {
        if (window.confirm("Are you sure you want to delete this assignment? This action cannot be undone.")) {
            try {
                const response = await axios.delete(`/api/assignments/${assignmentId}/delete-assignment`);
                if (response.status === 200) {
                    router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`);
                } else {
                }
            } catch (error) {
                console.error('An error occurred while deleting the assignment.');
            }
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
        // <div className="border border-gray-300 flex justify-center h-screen items-center m-5">
        //     <div className="w-full max-w-4xl mx-auto p-5">
        //         <h1 className="text-3xl font-bold mb-4">{courses?.title}</h1>
        //         <p className="text-lg text-gray-700 mb-6">{courses?.description}</p>
        //         <nav className="mb-6 p-2">
        //             <ul className="flex justify-start space-x-4 list-none p-0">
        // <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{courses?.title}</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
        // <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>{oneModule?.title}</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
        // <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`)}>Assignments</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">{oneAssignment?.title}</li>
        //             </ul>
        //         </nav>
        //         <div className="space-y-4 ">
        //     <div className=" border border-gray-300 rounded-lg-xl p-6 shadow-md h-26">
        //         <h2 className="text-xl font-semibold mb-2">{oneAssignment?.title}</h2>
        //         <p className="text-sm text-gray-600">Opened : {formatDate(oneAssignment?.created_at)}</p>
        //         <p className="text-sm text-gray-600">Due date : {formatDate(oneAssignment?.due_date)}</p>
        //         <div className='flex justify-start gap-6 items-center'>
        //             <div className='flex justify-center gap-6 mt-4'>
        //                 <button
        //                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        //                     onClick={handleEditAssignment} // Replace with your add module logic
        //                 >
        //                     Edit Assignments
        //                 </button>
        //                 <button
        //                     className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        //                     onClick={handleDeleteAssignment} // Replace with your add module logic
        //                 >
        //                     Delete Assignments
        //                 </button>
        //                 <button
        //                     className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        //                     onClick={handleViewSubmission} // Replace with your add module logic
        //                 >
        //                     View Submissions
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        //     {/* <div>
        //         <button
        //             className="dark:bg-[#212830] text-white rounded-lg-xl p-3 my-5"
        //             onClick={() => router.push(params.moduleId ? `/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/add-submission` : `/teacher/${userId}/mycourse/${courseId}/assignments/${assignmentId}/add-submission`)}
        //         >
        //             Add Submission
        //         </button>
        //     </div> */}
        // </div>
        //     </div>
        // </div >

        <div className="min-h-screen bg-gray-50 dark:bg-transparent py-8 px-4">
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
                                <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between p-6">
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
                                                    Edit Assignments
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    onClick={handleDeleteAssignment} // Replace with your add module logic
                                                >
                                                    Delete Assignments
                                                </button>
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    onClick={handleViewSubmission} // Replace with your add module logic
                                                >
                                                    View Submissions
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div>
                        <button
                            className="dark:bg-[#212830] text-white rounded-lg-xl p-3 my-5"
                            onClick={() => router.push(params.moduleId ? `/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/add-submission` : `/teacher/${userId}/mycourse/${courseId}/assignments/${assignmentId}/add-submission`)}
                        >
                            Add Submission
                        </button>
                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
