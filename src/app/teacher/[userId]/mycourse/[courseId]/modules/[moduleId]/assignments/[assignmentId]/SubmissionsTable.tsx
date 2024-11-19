import React from 'react';
import { useRouter } from 'next/navigation';

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
    marks_obtained?: number;
}

interface SubmissionsTableProps {
    submissions: Submission[];
    userId: string;
    courseId: string;
    moduleId: string;
    assignmentId: string;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, userId, courseId, moduleId, assignmentId }) => {
    const router = useRouter();

    return (
        <div className="mt-6 bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow p-6 w-full">
            <h2 className="text-xl font-bold mb-6">Assignment Submissions</h2>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-200 p-2">UserId</th>
                        <th className="border border-gray-200 p-2">Student</th>
                        <th className="border border-gray-200 p-2">Submission Date</th>
                        <th className="border border-gray-200 p-2">Status</th>
                        <th className="border border-gray-200 p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission, index) => (
                        <tr key={index}>
                            <td className="border border-gray-200 p-2 text-center">{submission.user.id}</td>
                            <td className="border border-gray-200 p-2 text-center">{submission.user.first_name} {submission.user.last_name}</td>
                            <td className="border border-gray-200 p-2 text-center">{new Date(submission.submission_date.seconds * 1000).toLocaleDateString()}</td>
                            <td className="border border-gray-200 p-2 text-center">{submission.marks_obtained !== undefined ? 'Graded' : 'Not Graded'}</td>
                            <td className="p-2 grid justify-center">
                                <button
                                    onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/submission/${submission.submission_id}`)}
                                    className="text-blue-500 hover:underline"
                                >
                                    View Submission
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubmissionsTable;