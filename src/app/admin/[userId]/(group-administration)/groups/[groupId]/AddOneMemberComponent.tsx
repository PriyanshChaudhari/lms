"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface AddOneMemberComponentProps {
    onClose: () => void;
}

const AddOneMemberComponent: React.FC<AddOneMemberComponentProps> = ({ onClose }) => {
    const params = useParams();
    const groupId = params.groupId as string;
    const userId = params.userId as string;

    const [user, setUser] = useState({ groupId: groupId, userId: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/groups/add-member', user);

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
        <div className="fixed inset-0 flex items-center justify-center dark:bg-[#212830] bg-opacity-50">
            <div className="relative w-full max-w-md mx-auto p-6 bg-white dark:bg-[#151b23] rounded-lg-lg shadow-md lg:left-32 md:left-32">
                <h1 className="text-2xl font-semibold text-center mb-6">Add Group Member</h1>

                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

                <form onSubmit={handleAddUser} className="mb-6">
                    <div className="mb-4">
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                            Add User by Id
                        </label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={user.userId}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                        />
                    </div>
                    <div className="flex gap-2 justify-center">
                        <button
                            type="submit"
                            className="w-1/2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Add User
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOneMemberComponent;