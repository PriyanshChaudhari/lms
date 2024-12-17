
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const SearchableStudentEnrollment = ({ courseId }: { courseId: string }) => {
    const params = useParams();
    interface Student {
        id: string;
        first_name: string;
        last_name: string;
    }
    
    const [students, setStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const userId = params.userId;


    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/get/students');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
                setGeneralError('Failed to load students');
            }
        };

        fetchStudents();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000); // 5 seconds delay

        // Cleanup the timer when the component unmounts or re-renders
        return () => clearTimeout(timer);
    }, []);

    const handleEnroll = async (studentId: any) => {
        setLoading(true);
        try {
            await axios.post('/api/enrollment', {
                user_id: studentId,
                course_id: courseId
            });
            setGeneralError(null);
            setShowMessage(true);
            window.location.href = `/teacher/${userId}/mycourse/${courseId}?section=participants`;
        } catch (error) {
            console.error('Error enrolling student:', error);
            if (axios.isAxiosError(error)) {
                setGeneralError(error.response?.data?.error || 'Failed to enroll student');
            } else {
                setGeneralError('Failed to enroll student');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const id = student.id.toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || id.includes(query);
    });

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            {showMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Participant enrolled sucessfully!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            The participant has been enrolled to the course.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowMessage(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Search participants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
                />
            </div>

            {generalError && (
                <div className="text-red-600 font-medium text-center py-2">
                    {generalError}
                </div>
            )}

            <div className="border rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                            <th className="p-4 font-semibold text-gray-900 dark:text-white">ID</th>
                            <th className="p-4 font-semibold text-gray-900 dark:text-white">First Name</th>
                            <th className="p-4 font-semibold text-gray-900 dark:text-white">Last Name</th>
                            <th className="p-4 font-semibold text-gray-900 dark:text-white">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id}
                                className="border-t border-gray-100 dark:border-gray-700">
                                <td className="p-4 text-gray-700 dark:text-gray-300">{student.id}</td>
                                <td className="p-4 text-gray-700 dark:text-gray-300">{student.first_name}</td>
                                <td className="p-4 text-gray-700 dark:text-gray-300">{student.last_name}</td>
                                <td className="p-4 text-gray-700 dark:text-gray-300">
                                    <button
                                        onClick={() => handleEnroll(student.id)}
                                        disabled={loading}
                                        className="text-green-500 hover:text-green-600"
                                    >
                                        Enroll
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    No students found matching your search.
                </div>
            )}
        </div>
    );
};

export default SearchableStudentEnrollment;