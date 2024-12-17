"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface users {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

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

export default function ViewSubmissions() {
    const params = useParams();
    const router = useRouter()
    const { userId, courseId, moduleId, assignmentId } = params;
    interface Submission {
        user: {
            id: string;
            first_name: string;
        };
        submission_date: {
            seconds: number;
        };
        submission_id: string;
    }

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [error, setError] = useState('');
    const [oneAssignment, setOneAssignment] = useState<assignments | null>(null);
    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [courses, setCourses] = useState<courses | null>(null);


    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.post(`/api/assignments/${assignmentId}/submission/`, { assignmentId });
                if (response.status === 200) {
                    setSubmissions(response.data.submissions);
                } else {
                    setError('Failed to fetch submissions');
                }
            } catch (error) {
                console.log(error)
                setError('An error occurred while fetching submissions.');
            }
        };

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

        fetchSubmissions();
    }, [assignmentId, moduleId, courseId]);

    return (
        // <div className="max-w-4xl mx-auto p-8"><h1 className="text-3xl font-bold mb-4">{courses?.title}</h1>
        //     <p className="text-lg text-gray-700 mb-6">{courses?.description}</p>
        //     <nav className="mb-6 p-2">
        //         <ul className="flex justify-start space-x-4 list-none p-0">
        // <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{courses?.title}</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
        // <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`)}> {oneModule?.title}</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
        // <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`)}>Assignments</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`)}>{oneAssignment?.title}</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
        // <li className="p-3 rounded-lg-xl text-black cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`)}>Submissions</li>
        //         </ul>
        //     </nav>
        // <h1 className="text-2xl font-bold mb-6">Assignment Submissions</h1>

        // {error && <p className="text-red-500 mb-4">{error}</p>}
        // <table className="min-w-full border-collapse border border-gray-200">
        //     <thead>
        //         <tr>
        //             <th className="border border-gray-200 p-2">UserId</th>

        //             <th className="border border-gray-200 p-2">Student</th>
        //             <th className="border border-gray-200 p-2">Submission Date</th>
        //             <th className="border border-gray-200 p-2">Action</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {submissions.map((submission, index) => (
        //             <tr key={index}>
        //                 <td className="border border-gray-200 p-2">{submission.user.id}</td>

        //                 <td className="border border-gray-200 p-2">{submission.user.first_name}</td>
        //                 <td className="border border-gray-200 p-2">{new Date(submission.submission_date.seconds * 1000).toLocaleDateString()}</td>
        //                 <td className="border border-gray-200 p-2">
        //                     <button onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/submission/${submission.submission_id}`)}
        //                         className="text-blue-500 hover:underline"
        //                     >
        //                         Review Submission {submission.submission_id}
        //                     </button>
        //                 </td>
        //             </tr>
        //         ))}
        //     </tbody>
        // </table>
        // </div>

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
                        <li className="p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{courses?.title}</li>
                        <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
                        <li className="p-3 rounded-lg-xl text-black cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`)}>{oneAssignment?.title}</li>
                        <li className="p-3 rounded-lg-xl text-black cursor-pointer">/</li>
                        <li className="p-3 rounded-lg-xl text-black cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`)}>Submissions</li>
                    </ul>
                </nav>

                <div className="space-y-6">


                    <div>

                        <div className="grid gap-4 ">


                            <div>
                                <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between p-6">
                                    <div className="grid gap-4 w-full">
                                        <h1 className="text-2xl font-bold mb-6">Assignment Submissions</h1>

                                        {error && <p className="text-red-500 mb-4">{error}</p>}
                                        <table className="min-w-full border-collapse border border-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="border border-gray-200 p-2">UserId</th>

                                                    <th className="border border-gray-200 p-2">Student</th>
                                                    <th className="border border-gray-200 p-2">Submission Date</th>
                                                    <th className="border border-gray-200 p-2">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {submissions.map((submission, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-gray-200 p-2">{submission.user.id}</td>

                                                        <td className="border border-gray-200 p-2">{submission.user.first_name}</td>
                                                        <td className="border border-gray-200 p-2">{new Date(submission.submission_date.seconds * 1000).toLocaleDateString()}</td>
                                                        <td className="border border-gray-200 p-2">
                                                            <button onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/submission/${submission.submission_id}`)}
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                Review Submission {submission.submission_id}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
