"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const AddOneMemberComponent = () => {
    const params = useParams();
    const groupId = params.groupId as string;

    const [user, setUser] = useState({ groupId: groupId, userId: '' });
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle user input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    // Handle adding a user
    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/groups/add-user', user);

            if (res.data.success) {
                setSuccessMessage('User added successfully');
                setErrorMessage('');
                setUser({
                    userId: '',
                    groupId: groupId
                });
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred while adding the user');
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-6">Group Management</h1>

            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

            {/* Add User Form */}
            <form onSubmit={handleAddUser} className="mb-6">
                <div className="mb-4">
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                        Add User by Id
                    </label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={user.userId}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Add User
                </button>
            </form>

        </div>
    );
};

export default AddOneMemberComponent;