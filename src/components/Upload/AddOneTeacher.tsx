"use client";
import React, { ChangeEvent, useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
    courseId: string; // Type for the single prop
}

const AddOneTeacher = ({ courseId }: Props) => {
    const [enrollment, setEnrollment] = useState({
        teacher_id: "",
        // role: "teacher",
        course_id: courseId,
    });

    const [teachers, setTeachers] = useState<{ id: string, name: string }[]>([]);
    const [courses, setCourses] = useState<{ id: string, title: string }[]>([]);
    const [generalError, setGeneralError] = useState<string | null>(null); // New state for error message
    const [errors, setErrors] = useState({
        teacher_id: "",
        course_id: "",
    });

    useEffect(() => {
        // Fetch teachers and courses on component mount
        const fetchData = async () => {
            try {
                const teachersRes = await axios.get('/api/get/teachers');
                const coursesRes = await axios.get('/api/get/courses');
                setTeachers(teachersRes.data);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error('Error fetching teachers or courses:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEnrollment({ ...enrollment, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;

        // Validation
        if (enrollment.teacher_id === "") {
            setErrors(prev => ({ ...prev, teacher_id: "Teacher is required" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, teacher_id: "" }));
        }

        if (enrollment.course_id === "") {
            setErrors(prev => ({ ...prev, course_id: "Course is required" }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, course_id: "" }));
        }

        if (valid) {
            try {
                setGeneralError(null); // Reset general error state before request
                const { teacher_id, ...restEnrollment } = enrollment;
                const res = await axios.post('/api/enrollment', { user_id: teacher_id, ...restEnrollment });

                console.log(res.data);

                // Optionally, reset the form
                setEnrollment({
                    teacher_id: "",
                    // role: "teacher",
                    course_id: courseId,
                });
            } catch (error: any) {
                console.error(error);

                // Check if the error response exists and has the necessary message
                if (error.response && error.response.data && error.response.data.error) {
                    setGeneralError(error.response.data.error); // Set error message from backend
                } else {
                    setGeneralError("An unexpected error occurred. Please try again."); // Fallback error message
                }
            }
        }
    };


    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Enroll teacher in Course</h2>
            {generalError && (
                <div className="mb-4 text-red-600 font-bold text-center">
                    {generalError}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">
                        Teacher
                    </label>
                    <select
                        id="teacher_id"
                        name="teacher_id"
                        value={enrollment.teacher_id}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.first_name} {teacher.last_name}
                            </option>
                        ))}
                    </select>
                    {errors.teacher_id && <p className="text-red-600 text-sm">{errors.teacher_id}</p>}
                </div>

                {/* <div className="mb-4">
                    <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
                        Course
                    </label>
                    <select
                        id="course_id"
                        name="course_id"
                        value={enrollment.course_id}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                    {errors.course_id && <p className="text-red-600 text-sm">{errors.course_id}</p>}
                </div> */}

                {/* <div className="mb-4">
                    <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                        Progress (%)
                    </label>
                    <input
                        type="number"
                        id="progress"
                        name="progress"
                        value={enrollment.progress}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                    {errors.progress && <p className="text-red-600 text-sm">{errors.progress}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="completion_status" className="block text-sm font-medium text-gray-700">
                        Completion Status
                    </label>
                    <select
                        id="completion_status"
                        name="completion_status"
                        value={enrollment.completion_status}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="not_started">Not Started</option>
                    </select>
                    {errors.completion_status && <p className="text-red-600 text-sm">{errors.completion_status}</p>}
                </div> */}

                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Enroll Teacher
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddOneTeacher;
