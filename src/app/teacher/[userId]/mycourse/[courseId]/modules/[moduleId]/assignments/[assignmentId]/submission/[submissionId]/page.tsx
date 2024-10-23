"use client";
import axios from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReviewSubmission() {
    const params = useParams();
    const { userId, courseId, moduleId, assignmentId, submissionId } = params;
    const router = useRouter();

    const [submission, setSubmission] = useState({
        student_id: '',
        submission_date: '',
        file_url: '',
        feedback: '',
        marks_obtained: 0
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                const response = await axios.get(`/api/assignments/${assignmentId}/submission/${submissionId}`);
                const data = response.data.submission;
                if (response.status === 200) {
                    setSubmission({
                        student_id: data.user_id,
                        submission_date: data.submission_date,
                        file_url: data.file_url,
                        feedback: data.feedback || '',
                        marks_obtained: data.marks_obtained || 0
                    });
                } else {
                    setError('Failed to fetch submission details');
                }
            } catch (error) {
                setError('An error occurred while fetching the submission.');
            }
        };

        fetchSubmissionDetails();
    }, [submissionId,assignmentId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setSubmission({
            ...submission,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/assignments/${assignmentId}/submission/${submissionId}`, {
                marks_obtained: submission.marks_obtained,
                feedback: submission.feedback
            });

            if (response.status === 200) {
                setSuccess('Submission graded successfully!');
                setError('');
                router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}/submission`);
            } else {
                setError('Failed to submit grades.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg-md">
            <h1 className="text-2xl font-bold mb-6">Review Submission</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <p className="mb-2"><strong>Student ID:</strong> {submission.student_id}</p>
            <p className="mb-2"><strong>Submission Date:</strong> {new Date(submission.submission_date.seconds * 1000).toLocaleDateString()}</p>
            <a href={submission.file_url} className="text-blue-500 hover:underline mb-6 block" target="_blank" rel="noopener noreferrer">
                View Submitted File
            </a>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Marks Obtained</label>
                    <input
                        type="number"
                        name="marks_obtained"
                        value={submission.marks_obtained}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Feedback</label>
                    <textarea
                        name="feedback"
                        value={submission.feedback}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg-md"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg-md hover:bg-blue-600">Submit Grade</button>
            </form>
        </div>
    );
}
