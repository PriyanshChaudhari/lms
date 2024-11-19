"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUser, FaUserTie, FaUserGraduate } from "react-icons/fa";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import UserTable from './UserTable';

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
    const [studentSearch, setStudentSearch] = useState<string>('');
    const [teacherSearch, setTeacherSearch] = useState<string>('');
    const [adminSearch, setAdminSearch] = useState<string>('');
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
            <div className="bg-gray-100 dark:bg-[#151b23] rounded-lg shadow-md my-4 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-around space-y-4 sm:space-y-0">
                    <p className="font-semibold text-xl text-blue-600 flex items-center space-x-2">
                        <span>Total Users</span>
                        <FaUser />
                        <span>: {users.length}</span>
                    </p>
                    <p className="font-semibold text-xl text-red-500 flex items-center space-x-2">
                        <span>Admins</span>
                        <FaUserTie />
                        <span>: {admins.length}</span>
                    </p>
                    <p className="font-semibold text-xl text-green-600 flex items-center space-x-2">
                        <span>Teachers</span>
                        <PiChalkboardTeacherFill className="text-3xl" />
                        <span>: {teachers.length}</span>
                    </p>
                    <p className="font-semibold text-xl text-yellow-600 flex items-center space-x-2">
                        <span>Students</span>
                        <FaUserGraduate />
                        <span>: {students.length}</span>
                    </p>
                </div>
            </div>

            <div className="py-4">
            <UserTable
                title="Students"
                users={students}
                searchPlaceholder="Search Students..."
                searchState={studentSearch}
                setSearchState={setStudentSearch}
            />
            </div>

            <div className="py-4">
            <UserTable
                title="Teachers"
                users={teachers}
                searchPlaceholder="Search Teachers..."
                searchState={teacherSearch}
                setSearchState={setTeacherSearch}
            />
            </div>

            <div className="py-4">
            <UserTable
                title="Admins"
                users={admins}
                searchPlaceholder="Search Admins..."
                searchState={adminSearch}
                setSearchState={setAdminSearch}
            />
            </div>

            <div className="py-4">
                <div>
                   <div className="my-2">
                   <p className='font-bold '>Courses</p>
                   <p>Total Courses: {courses.length}</p>
                   </div>
                    <input
                        type="text"
                        placeholder="Search participants..."
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
                                                <b>No. of Participants :</b> {participantCounts[course.id]}
                                                <ul>
                                                    {participantRoles[course.id]?.map((participant) => (
                                                        <li key={participant.userId}>
                                                            {participant.userId} - {participant.role}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => fetchParticipantCount(course.id)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                Load Count & Roles
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