"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    due_date: string;
    created_at: string;
    attachment_url: string;
}

interface submission {
    marks_obtained: number;
    feedback: string;
    file_url: string;
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
    const [submissionExists, setSubmissionExists] = useState<boolean>(false);
    const [submissionData, setSubmissionData] = useState<submission | null>(null);

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.post(`/api/get/course-details`, { courseId });
                setCourses(res.data.courseDetails);
            } catch (error) {
                console.log(error);
            }
        };
        getCourse();

        const getOneModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId });
                setOneModule(res.data.module);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule();

        const getModuleAssignments = async () => {
            try {
                const res = await axios.get(`/api/assignments/${assignmentId}`);
                setOneAssignment(res.data.assignment);

                const submissionRes = await axios.post(`/api/assignments/${assignmentId}/submission/check-submission`, { userId, assignmentId });
                setSubmissionExists(submissionRes.data.exists);
                const data = submissionRes.data.submissions[0];
                setSubmissionData({
                    marks_obtained: data.marks_obtained,
                    feedback: data.feedback,
                    file_url: data.file_url,
                });
                console.log(data.marks_obtained,data.feedback,data.file_url)

            } catch (error) {
                console.log(error);
            }
        };
        getModuleAssignments();
    }, [assignmentId, moduleId, courseId, userId]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
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
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/${userId}/mycourse/${courseId}`)}>{courses?.title}</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
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
                        <div>
                            {/* Display the attachment in an iframe */}
                            <iframe
                                src={oneAssignment?.attachment_url}
                            ></iframe>

                            {oneAssignment?.attachment_url && (
                                <a href={oneAssignment.attachment_url} className="block mt-2 text-blue-600 hover:underline">
                                    Download Attachment
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Submission Action Section */}
                    {!isPastDue(oneAssignment?.due_date) ? (
                        <>
                            <div>
                                <button
                                    className="bg-gray-950 hover:bg-gray-700 text-white rounded-xl px-4 py-2"
                                    onClick={() => router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/submission/add-submission`)}
                                >
                                    {submissionExists ? "Edit Submission" : "Add Submission"}
                                </button>
                            </div>
                        </>
                    ) : (
                        submissionExists && (
                            <div className="bg-gray-100 p-4 rounded-xl shadow-md">
                                <h3 className="text-lg font-semibold">Marks and Feedback</h3>
                                <p className="text-md text-gray-700">Marks Obtained: {submissionData?.marks_obtained ?? "N/A"}</p>
                                <p className="text-md text-gray-700">Feedback: {submissionData?.feedback ?? "No feedback provided"}</p>
                                <iframe src={submissionData?.file_url}></iframe>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
