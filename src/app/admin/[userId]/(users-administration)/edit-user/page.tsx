"use client"
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import axios from 'axios';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

const EditUser = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const userId = params.userId as string;

    const [user, setUser] = useState<User>({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);

    const fetchUser = async () => {
        if (!id) {
            setError("No user ID provided");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/get/one-user?userId=${id}`)
            console.log("response of get one user", response)

            const data = await response.data;
            if (data && typeof data === 'object') {
                setUser(data.userData); // Directly set the user data
                setUser((prevUser) => ({
                    ...prevUser,
                    id: data.userData.userId, // Update the user ID
                }));
                console.log('User data:', data);
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
    }, [id]);

   useEffect(() => {
    if (showMessage) {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000);

        return () => clearTimeout(timer); // Cleanup the timer
    }
}, [showMessage]);

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

        if (user.id.trim() === "" || user.first_name.trim() === "" || user.last_name.trim() === "" || user.email.trim() === "" || user.role.trim() === "") {
            setError('Please Fill All Required Fields.');
            return;
        }
        else {
            try {
                console.log(user)
                const response = await axios.put(`/api/put/update-user/${id}`, user);
                console.log("response of update user", response)

                if (response.status === 200) {
                    console.log('User updated successfully');
                    
                    setShowMessage(true);
                } else {
                    setError(response.data.error || 'Error updating user');
                }
            } catch (error) {
                setError('Something went wrong. Please try again later.');
                console.error('Error:', error);
            }
        }
    };

    const closeShowMessage = () => {
        router.push(`/admin/${userId}/view-users`);
        setShowMessage(false);
    }

    if (isLoading) {
        return <div className="text-center mt-8">Loading user data...</div>;
    }

    // if (error) {
    //     return <div className="text-center mt-8 text-red-500">{error}</div>;
    // }

    return (
        <div className="bg-gray-300 dark:dark:bg-[#212830] min-h-screen flex items-center justify-center p-6">
             {showMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            User Updated Sucessfully
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            user renewed sucessfully.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={closeShowMessage}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                               Close (Closing in 5 seconds)
                            </button>

                        </div>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#151b23] p-8 rounded-lg-lg shadow-md w-full max-w-xl">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300">Edit User</h2>
                </div>

                {error && (
                    <div className="mb-4 text-red-500 font-semibold text-left">
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
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white bg-gray-100"
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
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white capitalize"
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
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white capitalize"
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
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Role:</label>
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg-md hover:bg-blue-600 transition duration-300"
                >
                    Update User
                </button>
            </form>
        </div>
    );
}

export default EditUser;