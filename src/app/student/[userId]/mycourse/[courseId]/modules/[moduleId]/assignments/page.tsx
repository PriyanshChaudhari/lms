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
    title: string;
    description: string;
    module_id: string;
    total_marks: number;
    due_date: string
    created_at: string;
}

export default function ViewModuleAssignments() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

    const handleAssignmentClick = (moduleId: string, assignmentId: string) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`);
    };

    const [courses, setCourses] = useState<courses | null>(null)
    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [assignments, setAssignments] = useState<assignments[]>([])

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.post(`/api/get/course-details`, { courseId })
                setCourses(res.data.courseDetails)
            } catch (error) {
                console.log(error)
            }
        }
        getCourse();

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
                setAssignments(res.data.assignments)
                // console.log(res.data.assignments)
            } catch (error) {
                console.log(error)
            }
        }
        getModuleAssignments();

    }, [moduleId, courseId])

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A"; // Fallback if timestamp is not provided
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    return (
        // <div className="border border-gray-300 m-5">
        //     <div className="max-w-4xl mx-auto p-5">
        //         <h1 className="text-3xl font-bold mb-4">{courses?.title}</h1>
        //         <p className="text-lg text-gray-700 mb-6">{courses?.description}</p>
        //         <nav className="mb-6 p-2">
        //             <ul className="flex justify-start space-x-4 list-none p-0">
        // <li className=" p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}`)}>{courses?.title}</li>
        // <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">/</li>
        // <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>{oneModule?.title}</li>
        // <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">/</li>
        // <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">Assignments</li>
        //             </ul>
        //         </nav>
        //         <div className="space-y-4 ">

        // {assignments?.length > 0 ? (
        //     assignments?.map((assignment) => (
        //         <div
        //             key={assignment?.id}
        //             className="bg-white border border-gray-300 rounded-lg-xl p-6 shadow-md min-h-72">
        //             <h2 className="text-xl font-semibold mb-6">Title : {assignment?.title}</h2>
        //             <div className="shadow-md items-center p-5 border border-gray-100 rounded-lg-xl max-w-lg">
        //                 <p className="text-sm text-gray-600 mb-4">Description : {assignment?.description}</p>
        //                 <p className="text-sm text-gray-600 mb-4">DeadLine : {formatDate(assignment?.due_date)}</p>
        //                 <button className='bg-gray-950 text-white px-4 py-2 rounded-lg-xl hover:bg-gray-700 ' onClick={() => handleAssignmentClick(assignment.module_id, assignment?.id)}> Submit Assignment</button>
        //             </div>


        //         </div>
        //     ))
        // ) : (
        //     <p>No assignments found for this module.</p>
        // )}
        //         </div>
        //     </div >
        // </div >

        <div className="min-h-screen bg-gray-50 dark:bg-transparent py-8 px-4">
            <div className="max-w-7xl mx-auto">

                <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {courses?.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">{courses?.description}</p>
                </div>


                <nav className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm mb-8">
                    <ul className="flex p-2 gap-2">
                        <li className=" p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}`)}>{courses?.title}</li>
                        <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">/</li>
                        <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}`)}>{oneModule?.title}</li>
                        <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">/</li>
                        <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">Assignments</li>
                    </ul>
                </nav>

                <div className="space-y-6">


                    <div>

                        <div className="grid gap-4 ">


                            <div>
                                <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between p-6">
                                    {assignments?.length > 0 ? (
                                        assignments?.map((assignment) => (
                                            <div
                                                key={assignment?.id}
                                                className="p-6 w-full  min-h-72">
                                                <h2 className="text-xl font-semibold mb-6">Title : {assignment?.title}</h2>
                                                <div className="shadow-md items-center p-5 border border-gray-100 rounded-lg-xl ">
                                                    <p className="text-sm text-gray-600 mb-4">Description : {assignment?.description}</p>
                                                    <p className="text-sm text-gray-600 mb-4">DeadLine : {formatDate(assignment?.due_date)}</p>
                                                    <button className='bg-gray-950 text-white px-4 py-2 rounded-lg-xl hover:bg-gray-700 ' onClick={() => handleAssignmentClick(assignment.module_id, assignment?.id)}> Submit Assignment</button>
                                                </div>


                                            </div>
                                        ))
                                    ) : (
                                        <p>No assignments found for this module.</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}
