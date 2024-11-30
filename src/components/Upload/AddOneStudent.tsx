// "use client";
// import React, { ChangeEvent, useState, useEffect } from 'react';
// import axios from 'axios';

// interface Props {
//     courseId: string; // Type for the single prop
// }

// const AddOneStudent = ({ courseId }: Props) => {
//     const [enrollment, setEnrollment] = useState({
//         student_id: "",
//         // role: "student",
//         course_id: courseId,
//     });

//     const [students, setStudents] = useState<{ id: string, name: string }[]>([]);
//     const [courses, setCourses] = useState<{ id: string, title: string }[]>([]);
//     const [generalError, setGeneralError] = useState<string | null>(null); // New state for error message
//     const [errors, setErrors] = useState({
//         student_id: "",
//         course_id: "",
//     });

//     useEffect(() => {
//         // Fetch students and courses on component mount
//         const fetchData = async () => {
//             try {
//                 const studentsRes = await axios.get('/api/get/students');
//                 const coursesRes = await axios.get('/api/get/courses');
//                 setStudents(studentsRes.data);
//                 setCourses(coursesRes.data);
//             } catch (error) {
//                 console.error('Error fetching students or courses:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setEnrollment({ ...enrollment, [name]: value });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         let valid = true;

//         // Validation
//         if (enrollment.student_id === "") {
//             setErrors(prev => ({ ...prev, student_id: "Student is required" }));
//             valid = false;
//         } else {
//             setErrors(prev => ({ ...prev, student_id: "" }));
//         }

//         if (enrollment.course_id === "") {
//             setErrors(prev => ({ ...prev, course_id: "Course is required" }));
//             valid = false;
//         } else {
//             setErrors(prev => ({ ...prev, course_id: "" }));
//         }

//         if (valid) {
//             try {
//                 setGeneralError(null);
//                 const { student_id, ...restEnrollment } = enrollment;
//                 const res = await axios.post('/api/enrollment', { user_id: student_id, ...restEnrollment });
//                 console.log(res.data);
//                 // Optionally, reset the form
//                 setEnrollment({
//                     student_id: "",
//                     // role: "student",
//                     course_id: courseId,
//                 });
//             } catch (error: any) {
//                 console.error(error);
//                 if (error.response && error.response.data && error.response.data.error) {
//                     setGeneralError(error.response.data.error); // Set error message from backend
//                 } else {
//                     setGeneralError("An unexpected error occurred. Please try again."); // Fallback error message
//                 }
//             }
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4">Enroll Student in Course</h2>
//             {generalError && (
//                 <div className="mb-4 text-red-600 font-bold text-center">
//                     {generalError}
//                 </div>
//             )}
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
//                         Student
//                     </label>
//                     <select
//                         id="student_id"
//                         name="student_id"
//                         value={enrollment.student_id}
//                         onChange={handleChange}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
//                         required
//                     >
//                         <option value="">Select Student</option>
//                         {students.map(student => (
//                             <option key={student.id} value={student.id}>
//                                 {student.id} {student.first_name} {student.last_name}
//                             </option>
//                         ))}
//                     </select>
//                     {errors.student_id && <p className="text-red-600 text-sm">{errors.student_id}</p>}
//                 </div>

//                 {/* <div className="mb-4">
//                     <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
//                         Course
//                     </label>
//                     <select
//                         id="course_id"
//                         name="course_id"
//                         value={enrollment.course_id}
//                         onChange={handleChange}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
//                         required
//                     >
//                         <option value="">Select Course</option>
//                         {courses.map(course => (
//                             <option key={course.id} value={course.id}>
//                                 {course.title}
//                             </option>
//                         ))}
//                     </select>
//                     {errors.course_id && <p className="text-red-600 text-sm">{errors.course_id}</p>}
//                 </div> */}

//                 {/* <div className="mb-4">
//                     <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
//                         Progress (%)
//                     </label>
//                     <input
//                         type="number"
//                         id="progress"
//                         name="progress"
//                         value={enrollment.progress}
//                         onChange={handleChange}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
//                         required
//                     />
//                     {errors.progress && <p className="text-red-600 text-sm">{errors.progress}</p>}
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="completion_status" className="block text-sm font-medium text-gray-700">
//                         Completion Status
//                     </label>
//                     <select
//                         id="completion_status"
//                         name="completion_status"
//                         value={enrollment.completion_status}
//                         onChange={handleChange}
//                         className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
//                         required
//                     >
//                         <option value="">Select Status</option>
//                         <option value="in_progress">In Progress</option>
//                         <option value="completed">Completed</option>
//                         <option value="not_started">Not Started</option>
//                     </select>
//                     {errors.completion_status && <p className="text-red-600 text-sm">{errors.completion_status}</p>}
//                 </div> */}

//                 <div>
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//                     >
//                         Enroll Student
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddOneStudent;

"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios from 'axios';

const SearchableStudentEnrollment = ({ courseId }) => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [generalError, setGeneralError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    

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

    const handleEnroll = async (studentId) => {
        setLoading(true);
        try {
            await axios.post('/api/enrollment', {
                user_id: studentId,
                course_id: courseId
            });
            setGeneralError(null);
            setShowMessage(true);
        } catch (error) {
            console.error('Error enrolling student:', error);
            setGeneralError(error.response?.data?.error || 'Failed to enroll student');
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
                               Cancel (Closing in 5 seconds)
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