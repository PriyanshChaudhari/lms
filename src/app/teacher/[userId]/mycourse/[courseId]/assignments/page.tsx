"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function ViewAssignments() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId;
    const courseId = params.courseId;

    const [assignments, setAssignments] = useState([]);  // Initialize as an array
    const [courses, setCourses] = useState({});

    // Helper function to convert Firestore Timestamp to a readable date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.post('/api/get/course-details', { courseId });
                setCourses(res.data.courseDetails);
            } catch (error) {
                console.error(error);
            }
        };
        getCourse();

        const getAssignments = async () => {
            try {
                const res = await axios.post('/api/get/assignments/all-assignments', { courseId });
                setAssignments(res.data || []);  // Ensure it sets an array
                console.log(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        getAssignments();
    }, [courseId]);

    const handleAssignmentClick = (assignmentId) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/assignments/${assignmentId}`);
    };

    return (
        <div className="border border-gray-300 m-5 flex items-center h-screen justify-center">
            <div className="w-full max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{courses.title || 'Course Title'}</h1>
                <p className="text-lg text-gray-700 mb-6">{courses.description || 'Course Description'}</p>

                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{courses.title || 'Course Title'}</li>
                        {/* <li className="p-3 rounded-xl text-black cursor-pointer">/</li> */}
                        {/* {params.moduleId ? (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${params.moduleId}`)}>Module {params.moduleId}</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        ) : (
                            <>
                                <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/assignments`)}>Assignments</li>
                                <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                            </>
                        )} */}
                    </ul>
                </nav>
                <div className="space-y-4">
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className=" border border-gray-300 rounded-xl p-6 shadow-md h-64 cursor-pointer"
                                onClick={() => handleAssignmentClick(assignment.id)}
                            >
                                <h2 className="text-xl font-semibold mb-6">{assignment.title}</h2>
                                <div className="shadow-md items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                    <p className="text-sm text-gray-600 mb-4">Description: {assignment.description}</p>
                                    <p className="text-sm text-gray-600 mb-4">Marks: {assignment.total_marks}</p>
                                    <p className="text-sm text-gray-600 mb-4">Due Date: {formatDate(assignment.due_date)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No assignments available for this course.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
