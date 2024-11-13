"use client";
import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

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

const UserTable = ({
    title,
    users,
    searchPlaceholder,
    searchState,
    setSearchState
}: {
    title: string;
    users: User[];
    searchPlaceholder: string;
    searchState: string;
    setSearchState: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const filteredUsers = searchState === ''
        ? users
        : users.filter((user) =>
            [user.first_name, user.last_name, user.email, user.id].some((field) =>
                field.toLowerCase().includes(searchState.toLowerCase())
            )
        );

        async function getUserCoursesAndCount(userId: string) {
            // Query the 'enrolled_at' collection to find all documents with the given userId
            const enrollmentsQuery = query(
                collection(db, 'enrolled_at'),
                where('user_id', '==', userId)  // Filtering by userId
            );
    
            try {
                const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
    
                // If no documents are found, the user is not enrolled in any course
                if (enrollmentsSnapshot.empty) {
                    console.log('User is not enrolled in any courses');
                    return { courses: [], count: 0 };
                }
    
                // Retrieve the course_ids from the enrolled documents
                const courses = enrollmentsSnapshot.docs.map(doc => doc.data().course_id);
    
                // Count the number of courses the user is enrolled in
                const courseCount = courses.length;
    
                // Optionally, you can fetch detailed information about each course by querying the 'courses' collection
                // Example: Query courses collection if you want more details about each course
                const courseDetails = await Promise.all(
                    courses.map(async (courseId) => {
                        const courseDoc = await getDoc(doc(db, 'courses', courseId));
                        if (courseDoc.exists()) {
                            return { id: courseDoc.id, ...courseDoc.data() };
                        } else {
                            return null; // In case course info is not found
                        }
                    })
                );
    
                // Filter out any null values if some courses couldn't be fetched
                const validCourses = courseDetails.filter(course => course !== null);
    
                return { courses: validCourses, count: courseCount };
            } catch (error) {
                console.error('Error fetching user courses:', error);
                return { courses: [], count: 0 };
            }
        }

    const [userCourses, setUserCourses] = useState<any>({}); // Store courses per user

    useEffect(() => {
        // Fetch courses for each user when the component mounts
        filteredUsers.forEach(async (user) => {
            const { courses } = await getUserCoursesAndCount(user.id); // Fetch courses for the user
            setUserCourses(prev => ({
                ...prev,
                [user.id]: courses // Store courses for each user by userId
            }));
        });
    }, [filteredUsers]);

    return (
        <div>
            <p className='font-bold'>{title}</p>
            <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
            />
            <table className="min-w-full table-auto">

                <thead>
                    <tr>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">User ID</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">First Name</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Last Name</th>
                        <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Email</th>
                        {title != "Admins" && <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">courses</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">{user.id}</td>
                            <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">{user.first_name}</td>
                            <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">{user.last_name}</td>
                            <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">{user.email}</td>
                            {title !== "Admins" && (
                                <td className="border px-4 py-2 text-gray-700 text-center dark:text-gray-300">
                                    {/* Display the courses each user is enrolled in */}
                                    {userCourses[user.id]?.length > 0 ? (
                                        <ul>
                                            {userCourses[user.id].map((course: any) => (
                                                <li key={course.id}>{course.title}</li> // Assuming `course.title` exists
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No courses</span>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

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
                    fetch('/api/get/users'),
                    fetch('/api/get/courses')
                ]);
                const usersData = await userRes.json();
                const coursesData = await courseRes.json();
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

    

    async function fetchParticipantCount(course_id: string) {
        if (participantCounts[course_id] === undefined) {
            const enrollmentsQuery = query(
                collection(db, 'enrolled_at'),
                where('course_id', '==', course_id)
            );
            const enrollmentsSnapshot = await getDocs(enrollmentsQuery);

            let studentCount = 0;
            let teacherCount = 0;

            const participants: Participant[] = await Promise.all(
                enrollmentsSnapshot.docs.map(async (enrollmentDoc) => {
                    const userId = enrollmentDoc.data().user_id;
                    const userDocRef = doc(db, 'users', userId);  // Correct usage of `doc`
                    const userDoc = await getDoc(userDocRef);
                    const role = userDoc.exists() ? userDoc.data().role : 'Unknown';
                    if (role === 'Student') studentCount += 1;
                    else if (role === 'Teacher') teacherCount += 1;

                    return { userId, role };
                })
            );

            setParticipantCounts(prevCounts => ({
                ...prevCounts,
                [course_id]: enrollmentsSnapshot.size
            }));
            setParticipantRoles(prevRoles => ({
                ...prevRoles,
                [course_id]: participants
            }));
            setParticipantRolesCount(prevRolesCount => ({
                ...prevRolesCount,
                [course_id]: { students: studentCount, teachers: teacherCount }
            }));
        }
    }

    return (
        <div className="bg-gray-50 dark:bg-[#212830] min-h-screen p-6">
            <div className="bg-gray-300 rounded-lg shadow-md my-4 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-around space-y-4 sm:space-y-0">
                    <p className="font-semibold text-xl text-blue-600 flex items-center space-x-2">
                        <span className="">Total Users</span>
                        <FaUser className="" />
                        <span className="">: {users.length}</span>
                    </p>
                    <p className="font-semibold text-xl text-red-500 flex items-center space-x-2">
                        <span className="" >Admins</span>
                        <FaUserTie className="" />
                        <span className="">: {admins.length}</span>
                    </p>
                    <p className="font-semibold text-xl text-green-600 flex items-center space-x-2">
                        <span className="" >Teachers</span>
                        <PiChalkboardTeacherFill className="text-3xl" />
                        <span className="">: {teachers.length}</span>
                    </p>
                    <p className="font-semibold text-xl text-yellow-600 flex items-center space-x-2">
                        <span className="" >Students</span>
                        <FaUserGraduate className="" />
                        <span className="">: {students.length}</span>
                    </p>
                </div>
            </div>

            <UserTable
                title="Students"
                users={students}
                searchPlaceholder="Search Students..."
                searchState={studentSearch}
                setSearchState={setStudentSearch}
            />

            <UserTable
                title="Teachers"
                users={teachers}
                searchPlaceholder="Search Teachers..."
                searchState={teacherSearch}
                setSearchState={setTeacherSearch}
            />

            <UserTable
                title="Admins"
                users={admins}
                searchPlaceholder="Search Admins..."
                searchState={adminSearch}
                setSearchState={setAdminSearch}
            />

            <div>
                <p>Total Courses: {courses.length}</p>
                <div>
                    <p className='font-bold'>Courses</p>
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
                                                {participantCounts[course.id]}
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
