"use client";
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Group {
    group_name: string;
}

const EditGroup = () => {
    const router = useRouter();
    const params = useParams();
    const groupId = params.groupId;
    const [group, setGroup] = useState<Group>({ group_name: '' });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch the existing group details for editing
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axios.get(`/api/groups/${groupId}`);
                setGroup({ group_name: res.data.group.group_name });
            } catch (error) {
                console.error('Failed to fetch group:', error);
                setErrorMessage('Failed to load group details.');
            }
        };

        if (groupId) {
            fetchGroup();
        }
    }, [groupId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroup({ ...group, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.put(`/api/groups/${groupId}`, { group_name: group.group_name });

            if (res.data.success) {
                router.push('/admin/groups');
            } else {
                console.error('Group update failed:', res.data.message);
                setErrorMessage('Failed to update group. Please try again.');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred while updating the group.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-4">Edit Group</h1>
            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="group_name" className="block text-sm font-medium text-gray-700 mb-1">
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
                    {loading ? 'Updating...' : 'Update Group'}
                </button>
            </form>
        </div>
    );
};

export default EditGroup;
