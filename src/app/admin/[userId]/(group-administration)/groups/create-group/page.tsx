"use client";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface Group {
    group_name: string;
}

const CreateGroup = () => {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const [group, setGroup] = useState<Group>({ group_name: '' });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroup({ ...group, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Set loading state

        try {
            const res = await axios.post('/api/groups/create-group', { group_name: group.group_name });

            if (res.data.success) {
                router.push(`/admin/${userId}/groups`);
            } else {
                console.error('Group creation failed:', res.data.message);
                setErrorMessage('Failed to create group. Please try again.');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred while updating the group.');
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-4">Create Group</h1>
            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="group_name" className=" block text-sm font-medium text-gray-700 mb-1">
                        Group Name
                    </label>
                    <input
                        type="text"
                        id="group_name"
                        name="group_name"
                        value={group.group_name}
                        onChange={handleChange}
                        required
                        
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating...' : 'Create Group'}
                </button>
            </form>
        </div>
    );
};

export default CreateGroup;
