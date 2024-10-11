"use client"
import { useState, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';

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


    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const createPassword = (userId: string, firstName: string):string => {
        const userIdPart = userId.slice(-5);
        const firstNamePart = firstName.slice(0, 3);
        let password = `${userIdPart}${firstNamePart}`;
        
        return password;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        createPassword(user.userId, user.firstName);

        if (!user.userId || !user.firstName || !user.lastName || !user.email || !user.role) {
            let missingFields = [];
            if (!user.userId) missingFields.push('User ID');
            if (!user.firstName) missingFields.push('First Name');
            if (!user.lastName) missingFields.push('Last Name');
            if (!user.email) missingFields.push('Email');
            if (!user.role) missingFields.push('Role');
            alert('Please fill in all the required fields\n Missing fields: ' + missingFields.join(', '));
            return;
        } else {
            try {
                const userWithPassword = { ...user, password: createPassword(user.userId, user.firstName) };
                console.log("user: ", userWithPassword);
                const response = await fetch('/api/auth/create-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userWithPassword)
                });

                if (response.ok) {
                    console.log('User created successfully');
                    router.push('/admin/dashboard');
                } else {
                    const data = await response.json();
                    setError(data.error || 'Error creating user'); // Set error message
                }
            } catch (error) {
                setError('Something went wrong. Please try again later.');
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="bg-gray-300 dark:bg-black min-h-screen flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-xl">
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-black dark:text-gray-300 text-center">Add User</h2>
                </div>

                {/* Error message display */}
                {error && (
                    <div className="mb-4 text-red-500 font-semibold text-center">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="userId" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={user.userId}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white capitalize"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={user.lastName}
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
                        onChange={handleChange}
                        value={user.role}
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-white"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CreateUser;
