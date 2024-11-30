"use client"
import axios from 'axios';
import { group } from 'console';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { TiGroup } from "react-icons/ti";

interface Group {
    id: string;
    group_name: string;
}

const Groups = () => {
    const params = useParams();
    const userId = params.userId as string;
    const [groups, setGroups] = useState<Group[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);


    const getGroups = async () => {
        try {
            const res = await axios.get('/api/groups'); // Added leading slash to the API path
            setGroups(res.data.groups); // Make sure `groups` key exists in the response
            setLoading(false)
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        getGroups();
    }, [])

    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredGroups = searchTerm === ''
        ? groups
        : groups.filter(
            (item) =>
                item.group_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleClick = (groupId: string) => {
        router.push(`/admin/${userId}/groups/${groupId}`)
    }
    const handleCreateGroup = () => {
        router.push(`/admin/${userId}/groups/create-group`)
    }

    const handleEditGroup = (groupId: string) => {
        router.push(`/admin/${userId}/groups/${groupId}/edit-group`)
    }

    const handleDeleteGroup = async (groupId: string) => {
        try {
            const res = await axios.delete(`/api/groups/${groupId}`);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
        router.push(`/admin/${userId}/groups`)
    }

    return (
        <div className="bg-gray-50  dark:bg-[#212830] flex justify-content items-center  h-screen ">
            <div className="w-full max-w-6xl mx-auto p-6  bg-white dark:bg-[#151b23] rounded-lg-lg shadow-md">
                <div className="mb-6 flex justify-center gap-4 items-center">
                    <h1 className="text-2xl font-semibold text-center ">Group Management</h1>
                    {/* <div className="text-center ">
                        <button
                            onClick={handleCreateGroup}
                            className="text-sm bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Create Group
                        </button>
                    </div> */}
                </div>
                <input
                    type="text"
                    placeholder="Search Groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-300 outline-none dark:bg-[#151b23]"
                />
                {loading ?
                    (<div>Loading..</div>) : (
                        <table className="min-w-full border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="text-center">
                                    <th className="border px-4 py-2 border-b font-semibold dark:text-gray-300">Name</th>
                                    <th className="border px-4 py-2 border-b font-semibold dark:text-gray-300">View Group</th>
                                    <th className="border px-4 py-2 border-b font-semibold dark:text-gray-300">Edit Group</th>
                                    <th className="border px-4 py-2 border-b font-semibold dark:text-gray-300">Delete Group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGroups.map((group) => (
                                    <tr key={group.id}>
                                        <td

                                            className="border px-4 py-2 border-b text-center"
                                        >
                                            {group.group_name}
                                        </td>
                                        <td className="border px-4 py-2 border-b text-center">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2 py-2 px-5 transition-all duration-200 ease-in-out transform focus:outline-none"
                                                    onClick={() => handleClick(group.id)}
                                                >
                                                    View
                                                    <TiGroup className="text-white text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 border-b text-center">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 py-2 px-5 transition-all duration-200 ease-in-out transform focus:outline-none"
                                                    onClick={() => handleEditGroup(group.id)}
                                                >
                                                    Edit
                                                    <MdModeEdit className="text-white text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2 border-b text-center">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 py-2 px-5 transition-all duration-200 ease-in-out transform focus:outline-none"
                                                    onClick={() => handleDeleteGroup(group.id)}
                                                >
                                                    Delete
                                                    <MdDeleteForever className="text-white text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
            </div>
        </div>
    );
};

export default Groups;
