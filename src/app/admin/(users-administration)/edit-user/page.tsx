"use client"
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    profile_pic: string;
    dob: string;
}

const EditUser = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');

    const [user, setUser] = useState<User>({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        profile_pic: "",
        dob: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        if (!userId) {
            setError("No user ID provided");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/get/users?id=${searchParams.get('id')}`);    
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            if (data && typeof data === 'object') {
                if (Array.isArray(data)) {
                    const foundUser = data.find(user => user.id === userId); // Use 'find' to get the matching user
                    if (foundUser) {
                        setUser(foundUser);
                    } else {
                        setError('User not found');
                    }
                }
                console.log('User data:', user);
            } else {
                throw new Error('Invalid user data received');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setError('Failed to load user data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };


    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.id || !user.first_name || !user.last_name || !user.email) {
            setError('Please fill in all the required fields');
            return;
        }

        try {
            const response = await fetch('/api/put/update-user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                console.log('User updated successfully');
                router.push('/admin/dashboard');
            } else {
                const data = await response.json();
                setError(data.error || 'Error updating user');
            }
        } catch (error) {
            setError('Something went wrong. Please try again later.');
            console.error('Error:', error);
        }
    };

    if (isLoading) {
        return <div className="text-center mt-8">Loading user data...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-300 dark:bg-black min-h-screen flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-xl">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300 text-center">Edit User</h2>
                </div>

                {error && (
                    <div className="mb-4 text-red-500 font-semibold text-center">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="id" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">User ID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={user.id}
                        readOnly
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white bg-gray-100 dark:bg-gray-600"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="first_name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">First Name:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={user.first_name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white capitalize"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="last_name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Last Name:</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={user.last_name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white capitalize"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Role:</label>
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="dob" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Date of Birth:</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formatDate(user.dob)}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="profile_pic" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Profile Picture URL:</label>
                    <input
                        type="text"
                        id="profile_pic"
                        name="profile_pic"
                        value={user.profile_pic}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Update User
                </button>
            </form>
        </div>
    );
}

export default EditUser;