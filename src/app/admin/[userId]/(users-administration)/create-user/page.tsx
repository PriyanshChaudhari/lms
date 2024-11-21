"use client"
import { useState, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

const CreateUser = () => {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;

    const [user, setUser] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "student",
    });

    const [error, setError] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000); // 5 seconds delay

        // Cleanup the timer when the component unmounts or re-renders
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user.userId.trim() === "" || user.firstName.trim() === "" || user.lastName.trim() === "" || user.email.trim() === "" || user.role.trim() === "") {
            setError("Please Fill All Required Fields.")
            return;
        } else {
            try {
                const response = await axios.post('/api/auth/create-user', user);

                // Check if the response status indicates success
                if (response.status === 201) {
                    console.log('User created successfully');
                    setShowMessage(true);
                } else {
                    setError(response.data.error || 'Error creating user'); // Set error message if response status is not 201
                }
            } catch (error: any) {
                if (error.response) {
                    // If the error has a response, log it and show the API-specific error message
                    console.error('Error from API:', error.response.data);
                    setError(error.response.data.error || 'Failed to create user. Please check the input and try again.');
                } else {
                    // Generic fallback error message
                    setError('Something went wrong. Please try again later.');
                    console.error('Error:', error);
                }
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
                            User Enrolled Sucessfully
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            user added sucessfully.
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
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#151b23] p-8 rounded-lg-lg shadow-md w-full max-w-xl">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300">Add User</h2>
                </div>

                {/* Error message display */}
                {error && (
                    <div className="mb-4 text-red-500 font-semibold text-left">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="userId" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        required
                        value={user.userId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={user.firstName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white capitalize"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={user.lastName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white capitalize"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={user.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Role:</label>
                    <select
                        name="role"
                        onChange={handleChange}
                        value={user.role}
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
                    className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg-md hover:bg-red-600 transition duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CreateUser;
