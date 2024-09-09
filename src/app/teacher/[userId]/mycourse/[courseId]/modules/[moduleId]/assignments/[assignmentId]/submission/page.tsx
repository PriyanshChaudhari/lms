"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ViewSubmissions() {
    const params = useParams();
    const { userId, courseId, moduleId, assignmentId } = params;
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.post('/api/get/assignments/submissions', { assignmentId });
                const data = response.data;
                if (response.status === 200) {
                    setSubmissions(data);
                } else {
                    setError('Failed to fetch submissions');
                }
            } catch (error) {
                setError('An error occurred while fetching submissions.');
            }
        };

        fetchSubmissions();
    }, [assignmentId]);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Assignment Submissions</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-200 p-2">Student</th>
                        <th className="border border-gray-200 p-2">Submission Date</th>
                        <th className="border border-gray-200 p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission, index) => (
                        <tr key={index}>
                            <td className="border border-gray-200 p-2">{submission.student_name}</td>
                            <td className="border border-gray-200 p-2">{new Date(submission.submission_date.seconds * 1000).toLocaleDateString()}</td>
                            <td className="border border-gray-200 p-2">
                                <a
                                    href={`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/submissions/${submission.submission_id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Review Submission
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
