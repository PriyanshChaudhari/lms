"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TableSkeleton from './TableSkeleton';
import { FaUserEdit } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profilePicUrl: string;
}

const ViewUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/get/users');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
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

    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredParticipants = searchTerm === ''
        ? users
        : users.filter(
            (item) =>
                item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.includes(searchTerm)
        );

    const handleEdit = (id: string) => {
        router.push(`/admin/${userId}/edit-user?id=${id}`);
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
        <div className="bg-gray-50 dark:dark:bg-[#212830] min-h-screen flex items-center justify-center p-6">
            <div className="bg-white dark:bg-[#151b23] p-8 rounded-lg-lg shadow-md w-full max-w-6xl">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300 text-center">View Users</h2>
                {loading ? (
                    <TableSkeleton rows={5} columns={6} isEditMode={isEditMode} />
                    // <div>Loading....</div>
                ) : (
                    <div>
                        <div className="mb-4 flex gap-4 justify-end">
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
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
                                    <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">User ID</th>
                                    <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">First Name</th>
                                    <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Last Name</th>
                                    <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Email</th>
                                    <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Role</th>
                                    <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Profile Picture</th>
                                    {isEditMode && (
                                        <>
                                            <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Edit User</th>
                                            <th className="border px-4 py-2 text-gray-700 dark:text-gray-300">Delete User</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.id}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.first_name}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.last_name}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.email}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.role}</td>
                                        <td className="border px-4 py-2  text-gray-700 dark:text-gray-300">
                                            <img src={user?.profilePicUrl} alt="Profile Pic" className="border border-gray-300 h-7 w-7 object-cover rounded-full mx-auto" />
                                        </td>
                                        {isEditMode && (
                                            <>
                                                {/* <td className="px-4 py-2 border border-gray-300">
                                                    <button className="text-blue-500 bg-transparent px-3 py-1  rounded-lg" onClick={() => handleEdit(user.id)}>Edit</button>
                                                </td> */}
                                                <td className="border px-4 py-2 border-b text-center">
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 py-2 px-5 rounded-[9px] transition-all duration-200 ease-in-out transform focus:outline-none"
                                                            onClick={() => handleEdit(user.id)}
                                                        >
                                                            Edit
                                                            <FaUserEdit className="text-white text-lg" />
                                                        </button>
                                                    </div>
                                                </td>
                                                {/* <td className="px-4 py-2 border border-gray-300">
                                                    <button className="text-red-500 bg-transparent px-3 py-1  rounded-lg" onClick={() => handleDelete(user.id)}>Delete</button>
                                                </td> */}
                                                <td className="border px-4 py-2 border-b text-center">
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 py-2 px-5 rounded-[9px] transition-all duration-200 ease-in-out transform focus:outline-none"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            Delete
                                                            <TiUserDelete className="text-white text-xl" />
                                                        </button>
                                                    </div>
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