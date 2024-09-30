"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profile_pic: string;
    dob: string;
}

const ViewUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/get/users');
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

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    const handleEdit = (userId: string) => {
        router.push(`/admin/edit-user?id=${userId}`);
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/delete/delete-user?id=${userId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    // Remove the user from the local state
                    setUsers(users.filter(user => user.id !== userId));
                    console.log('User deleted successfully');
                } else {
                    console.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="bg-gray-300 dark:bg-black min-h-screen flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-6xl">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300 text-center">View Users</h2>
                {users.length === 0 ? (
                    <p className="text-gray-700 dark:text-gray-300 text-center">No users available</p>
                ) : (
                    <div>
                        <div className="mb-4 flex gap-4 justify-end">
                            <span className="ml-2 text-sm text-gray-700">
                                {isEditMode ? 'Edit Mode Enabled' : 'Edit Mode Disabled'}
                            </span>
                            <button
                                onClick={() => setIsEditMode(!isEditMode)}
                                className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors ${isEditMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                            >
                                <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

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
                                    {isEditMode && (
                                        <>
                                            <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Edit User</th>
                                            <th className="px-4 py-2 text-gray-700 dark:text-gray-300">Delete User</th>
                                        </>
                                    )}
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
                                            <img src={user.profile_pic} alt="Profile Pic" className="border border-gray-300 h-7 w-7 object-cover rounded-full" />
                                        </td>
                                        {isEditMode && (
                                            <>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    <button className="bg-blue-500 text-white px-3 py-1  rounded" onClick={() => handleEdit(user.id)}>Edit</button>
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    <button className="bg-red-500 text-white px-3 py-1  rounded" onClick={() => handleDelete(user.id)}>Delete</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewUsers;