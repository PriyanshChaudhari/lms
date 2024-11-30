"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TableSkeleton from './TableSkeleton';
import { FaUserEdit } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import UserTable from './UserTable';

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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>("All");
    const [showMessage, setShowMessage] = useState(false);
    

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
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000); // 5 seconds delay

        // Cleanup the timer when the component unmounts or re-renders
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    const teachers = users.filter((user) => user.role === 'Teacher');
    const admins = users.filter((user) => user.role === 'Admin');
    const students = users.filter((user) => user.role === 'Student');

    const filteredUsers = users.filter((user) => {
        const matchesSearchTerm =
            user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = selectedRole === "All" || user.role === selectedRole;

        return matchesSearchTerm && matchesRole;
    });

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
                    setShowMessage(true);
                } else {
                    console.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const closeShowMessage = () => {
        router.push(`/admin/${userId}/view-users`);
        setShowMessage(false);
    }


    return (
        <div className="bg-gray-50 dark:dark:bg-[#212830] min-h-screen flex items-center justify-center p-6">
            {showMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            User Deleted Sucessfully
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            user removed sucessfully.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={closeShowMessage}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                                Cancel (Closing in 5 seconds)
                            </button>

                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white dark:bg-[#151b23] p-8 rounded-lg-lg shadow-md w-full max-w-6xl">
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300 text-center">View Users</h2>
                {loading ? (
                    <TableSkeleton rows={5} columns={6} isEditMode={isEditMode} />
                    // <div>Loading....</div>
                ) : (

                    <div>
                        {/* Edit Mode Toggle */}
                        <div className="flex justify-end items-center mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700 dark:text-gray-200">
                                    {isEditMode ? 'Edit Mode Enabled' : 'Edit Mode Disabled'}
                                </span>
                                <button
                                    onClick={() => setIsEditMode(!isEditMode)}
                                    className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors ${isEditMode ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEditMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                            <input
                                type="text"
                                placeholder="Search participants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-2/3 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-200 dark:bg-[#151b23] text-gray-700 dark:text-gray-200 outline-none bg-gray-100"
                            />
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23] text-gray-700 dark:text-gray-200 bg-gray-100 font-semibold"
                            >
                                <option value="All">All Roles</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
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
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.id}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.first_name}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.last_name}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.email}</td>
                                        <td className="border px-4 py-2 text-center text-gray-700 dark:text-gray-300">{user.role}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <img
                                                src={user?.profilePicUrl}
                                                alt="Profile Pic"
                                                className="border border-gray-300 h-7 w-7 object-cover rounded-full mx-auto"
                                            />
                                        </td>
                                        {isEditMode && (
                                            <>
                                                <td className="border px-4 py-2 text-center">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 py-2 px-5 rounded-lg transition-all duration-200 ease-in-out"
                                                        onClick={() => handleEdit(user.id)}
                                                    >
                                                        Edit
                                                        <FaUserEdit className="text-white text-lg" />
                                                    </button>
                                                </td>
                                                <td className="border px-4 py-2 text-center">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 py-2 px-5 rounded-lg transition-all duration-200 ease-in-out"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        Delete
                                                        <TiUserDelete className="text-white text-xl" />
                                                    </button>
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

            {/* <UserTable
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
            /> */}

        </div >
    );
};

export default ViewUsers;