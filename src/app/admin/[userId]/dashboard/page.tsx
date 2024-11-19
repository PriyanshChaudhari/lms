"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUser, FaUserTie, FaUserGraduate } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { IoBookSharp } from "react-icons/io5";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profilePicUrl: string;
}

interface Course {
    id: string;
    title: string;
    coursePicUrl: string;
    description: string;
    teacher_id: string;
    category: string;
}

interface Participant {
    userId: string;
    role: string;
}

interface RoleCount {
    students: number;
    teachers: number;
}

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    // const [studentSearch, setStudentSearch] = useState<string>('');
    // const [teacherSearch, setTeacherSearch] = useState<string>('');
    // const [adminSearch, setAdminSearch] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [participantCounts, setParticipantCounts] = useState<{ [key: string]: number }>({});
    const [participantRoles, setParticipantRoles] = useState<{ [key: string]: Participant[] }>({});
    const [participantRolesCount, setParticipantRolesCount] = useState<{ [key: string]: RoleCount }>({});

    const filteredCourses = searchTerm === ''
        ? courses
        : courses.filter((course) =>
            [course.title, course.category, course.teacher_id].some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, courseRes] = await Promise.all([
                    axios.get('/api/get/users'),
                    axios.get('/api/get/courses')
                ]);
                const usersData = await userRes.data;
                const coursesData = await courseRes.data;
                setIsLoaded(true);
                setUsers(usersData);
                setCourses(coursesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    if (!isLoaded) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    const teachers = users.filter((user) => user.role === 'Teacher');
    const admins = users.filter((user) => user.role === 'Admin');
    const students = users.filter((user) => user.role === 'Student');

    const fetchParticipantCount = async (courseId: string) => {
        if (participantCounts[courseId] === undefined) {
            try {
                const response = await axios.post(`/api/get/count/participant`, { courseId: courseId });
                const data = response.data;

                setParticipantCounts(prevCounts => ({
                    ...prevCounts,
                    [courseId]: data.participantCount
                }));
                setParticipantRoles(prevRoles => ({
                    ...prevRoles,
                    [courseId]: data.participants
                }));
                setParticipantRolesCount(prevRolesCount => ({
                    ...prevRolesCount,
                    [courseId]: data.roleCount
                }));
            } catch (error) {
                console.error('Error fetching participant count and roles:', error);
            }
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-[#212830] min-h-screen p-6">
            <div className="bg-gray-100 rounded-lg shadow-md my-6 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Total Users */}
                    <div className="flex flex-col items-center justify-center bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="text-blue-600 text-4xl font-semibold flex items-center space-x-2">
                            <span>Users   </span>
                            <FaUser className="text-blue-500" />
                        </div>
                        <span className="text-3xl text-blue-700 mt-2">{users.length}</span>
                    </div>

                    {/* Admins */}
                    <div className="flex flex-col items-center justify-center bg-red-50 p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="text-red-600 text-4xl font-semibold flex items-center space-x-2">
                            <span>Admins</span>
                            <FaUserTie className="text-red-500" />
                        </div>
                        <span className="text-3xl text-red-700 mt-2">{admins.length}</span>
                    </div>

                    {/* Teachers */}
                    <div className="flex flex-col items-center justify-center bg-green-50 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="text-green-600 text-4xl font-semibold flex items-center space-x-2">
                            <span>Teachers</span>
                            <GiTeacher className="text-green-500" />
                        </div>
                        <span className="text-3xl text-green-700 mt-2">{teachers.length}</span>
                    </div>

                    {/* Students */}
                    <div className="flex flex-col items-center justify-center bg-yellow-50 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="text-yellow-600 text-4xl font-semibold flex items-center space-x-2">
                            <span>Students</span>
                            <FaUserGraduate className="text-yellow-500 " />
                        </div>
                        <span className="text-3xl text-yellow-700 mt-2">{students.length}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-purple-50 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-2xl transition-shadow duration-300">
                    <div className="text-purple-600 text-4xl font-semibold flex items-center space-x-2">
                        <span>Courses   </span>
                        <IoBookSharp className="text-purple-500" />
                    </div>
                    <span className="text-3xl text-purple-700 mt-2">{courses.length}</span>
                </div>
                </div>

                
            </div>


            
            <div>
                <div>
                    <div className='font-bold text-3xl p-3'>Courses</div>
                    <input
                        type="text"
                        placeholder="Search Course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
                    />
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Course Name</th>
                                <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Teacher Id</th>
                                <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Participants</th>
                                <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Students</th>
                                <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Teachers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
                                <tr key={course.id}>
                                    <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">{course.title}</td>
                                    <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">{course.teacher_id}</td>
                                    <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">
                                        {participantCounts[course.id] !== undefined ? (
                                            <>
                                                {participantCounts[course.id]}
                                                {/* <ul>
                                                    {participantRoles[course.id]?.map((participant) => (
                                                        <li key={participant.userId}>
                                                            {participant.userId} - {participant.role}
                                                        </li>
                                                    ))}
                                                </ul> */}
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => fetchParticipantCount(course.id)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                Load Count
                                            </button>
                                        )}
                                    </td>
                                    <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">
                                        {participantRolesCount[course.id]?.students ?? 'Loading...'}
                                    </td>
                                    <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">
                                        {participantRolesCount[course.id]?.teachers ?? 'Loading...'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}