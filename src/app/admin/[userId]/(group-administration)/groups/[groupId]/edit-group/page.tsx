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
    const userId = params.userId as string;
    const groupId = params.groupId;
    const [group, setGroup] = useState<Group>({ group_name: '' });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000); // 5 seconds delay

        // Cleanup the timer when the component unmounts or re-renders
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (group.group_name.trim() === "") {
            setErrorMessage("Please Enter Valid Group Name.")
            setLoading(false)
            return;
        }
        else {
            try {
                const res = await axios.put(`/api/groups/${groupId}`, { group_name: group.group_name });

                if (res.data.success) {
                    setShowMessage(false);
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
        }


    };

    const closeShowMessage = () => {
        router.push(`/admin/${userId}/groups`);
        setShowMessage(false);
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-[#212830] rounded-lg-lg shadow-md">
             {showMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Group Updated Sucessfully
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            group edited sucessfully.
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
            <h1 className="text-2xl font-semibold text-black dark:text-gray-300 mb-4">Edit Group</h1>

            {errorMessage && <p className="text-red-500 text-left mb-4">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="group_name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Group Name:
                    </label>
                    <input
                        type="text"
                        id="group_name"
                        name="group_name"
                        value={group.group_name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg-md hover:bg-blue-700 transition duration-200 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Updating...' : 'Update Group'}
                </button>
            </form>
        </div>
    );
};

export default EditGroup;
