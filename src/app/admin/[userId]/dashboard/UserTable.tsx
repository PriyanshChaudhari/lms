"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profilePicUrl: string;
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

    const [userCourses, setUserCourses] = useState<{ [key: string]: any[] }>({}); // Store courses per user

    useEffect(() => {
        const fetchUserCourses = async () => {
            const userCoursesData: { [key: string]: any[] } = {};
        
            for (const user of filteredUsers) {
                try {
                    const response = await axios.post(`/api/get/allocated-courses`, { userId: user.id });
                    userCoursesData[user.id] = response.data.courses;
                } catch (error) {
                    console.error(`Error fetching courses for user ${user.id}:`, error);
                }
            }
        
            setUserCourses(userCoursesData);
        };

        fetchUserCourses();
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
                        {title !== "Admins" && <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Courses</th>}
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
                                    {userCourses[user.id]?.length > 0 ? (
                                        <ul>
                                            {userCourses[user.id].map((course: any) => (
                                                <li key={course.id}>{course.title}</li>
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

export default UserTable;