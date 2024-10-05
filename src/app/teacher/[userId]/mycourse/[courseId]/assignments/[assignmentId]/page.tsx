"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Courses {
    course_id: string;
    title: string;
    description: string;
    teacher_id: string;
    category: string;
}

interface Assignments {
    id: string;
    title: string;
    due_date: object;
    created_at: object;
    description: string;
    total_marks: number;
}

interface Submissions {
    submission_id: string;
    student_id: string;
    student_name: string;
    submission_date: object;
    obtained_marks: number;
    feedback: string;
    submission_file_urls: string[];
}

export default function ViewAssignment() {
    const params = useParams();
    const userId = params.userId;
    const courseId = params.courseId;
    const assignmentId = params.assignmentId;

    const [courses, setCourses] = useState<Courses | null>(null);
    const [oneAssignment, setOneAssignment] = useState<Assignments | null>(null);
    const [submissions, setSubmissions] = useState<Submissions[]>([]);

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

        const getSubmissions = async () => {
            try {
                const res = await axios.post('/api/get/assignments/submissions', { assignmentId });
                setSubmissions(res.data.submissions);
            } catch (error) {
                console.log(error);
            }
        };
        getSubmissions();
    }, [courseId, assignmentId]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    return (
        <div className="border border-gray-300 m-5 flex justify-center items-center h-screen">
            <div className="max-w-4xl mx-auto p-5 w-full">
                <h1 className="text-3xl font-bold mb-4">{courses?.title || 'Course Title'}</h1>
                <p className="text-lg text-gray-700 mb-6">{courses?.description || 'Course Description'}</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer">
                            <Link href={`/teacher/${userId}/mycourse/${courseId}`}>{courses?.title || 'Course Title'}</Link>
                        </li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className="p-3 rounded-xl text-gray-500 cursor-pointer">
                            <Link href={`/teacher/${userId}/mycourse/${courseId}/assignments`}>Assignments</Link>
                        </li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className="p-3 rounded-xl text-black cursor-pointer">{oneAssignment ? oneAssignment.title : 'Assignment Title'}</li>
                    </ul>
                </nav>

                <div className="space-y-4">
                    <div className="border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">
                            {oneAssignment?.description || 'No description available'}
                        </h2>
                        <p className="text-sm text-gray-600">Opened: {oneAssignment ? formatDate(oneAssignment.created_at) : 'N/A'}</p>
                        <p className="text-sm text-gray-600">Due date: {oneAssignment ? formatDate(oneAssignment.due_date) : 'N/A'}</p>
                    </div>

                    {/* Submissions Block */}
                    <div className="border border-gray-300 rounded-xl p-6 shadow-md">
                        <h3 className="text-2xl font-semibold mb-4">Student Submissions</h3>
                        {submissions.length > 0 ? (
                            <ul className="space-y-2">
                                {submissions.map((submission) => {
                                    // const queryParams = {
                                    //     submissionData: {
                                    //         studentName: submission.student_name,
                                    //         submissionDate: formatDate(submission.submission_date),
                                    //         fileUrl: submission.submission_file_urls
                                    //     }
                                    // };
                                    return (
                                        <li key={submission.submission_id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                                            <p><strong>Student Name:</strong> {submission.student_name}</p>
                                            <p><strong>Submission Date:</strong> {formatDate(submission.submission_date)}</p>
                                            <Link
                                                href={{
                                                    pathname: `/teacher/${userId}/mycourse/${courseId}/assignments/${assignmentId}/submission/${submission.submission_id}`,
                                                    query: {
                                                        submissionData: JSON.stringify({
                                                            studentName: submission.student_name,
                                                            submissionDate: formatDate(submission.submission_date),
                                                            fileUrls: submission.submission_file_urls
                                                        })
                                                    }
                                                }}
                                                className="text-blue-600 underline"
                                            >
                                                View Submission
                                            </Link>

                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No submissions yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
