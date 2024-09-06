"use client";
import { useState, useEffect } from 'react';

interface User {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    role: string,
    profile_pic: string,
    dob: string
}

const ViewUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/get/students');
            const data = await response.json();
            setUsers(data);
            console.log(data);

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const formatDate = (timestamp:any) => {
        if (!timestamp) return "N/A"; // Fallback if timestamp is not provided
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    return (
        <div className="bg-gray-300 dark:bg-black min-h-screen flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300 text-center">View Users</h2>
                {users.length === 0 ? (
                    <p className="text-gray-700 dark:text-gray-300 text-center">No users available</p>
                ) : (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">User ID</th>
                                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">First Name</th>
                                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Last Name</th>
                                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Email</th>
                                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Role</th>
                                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Date of Birth</th>
                                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Profile Picture</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="border px-4 py-2 text-gray-700 dark:text-gray-300">{user.id}</td>
                                    <td className="border px-4 py-2 text-gray-700 dark:text-gray-300">{user.first_name}</td>
                                    <td className="border px-4 py-2 text-gray-700 dark:text-gray-300">{user.last_name}</td>
                                    <td className="border px-4 py-2 text-gray-700 dark:text-gray-300">{user.email}</td>
                                    <td className="border px-4 py-2 text-gray-700 dark:text-gray-300">{user.role}</td>
                                    <td className="border px-4 py-2 text-gray-700 dark:text-gray-300">{formatDate(user.dob)}</td>
                                    <td className="border px-4 py-2 text-gray-700 dark:text-gray-300">
                                        <img src={user.profile_pic} alt="Profile Pic" className="object-cover rounded-full" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewUsers;
