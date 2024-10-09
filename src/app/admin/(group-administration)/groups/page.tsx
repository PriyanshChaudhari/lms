"use client"
import axios from 'axios';
import { group } from 'console';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Group {
    id: string;
    group_name: string;
}

const Groups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const router = useRouter();

    const getGroups = async () => {
        try {
            const res = await axios.get('/api/groups'); // Added leading slash to the API path
            setGroups(res.data.groups); // Make sure `groups` key exists in the response
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        getGroups();
    }, [])


    const handleClick = (groupId: string) => {
        router.push(`/admin/groups/${groupId}`)
    }
    const handleCreateGroup = () => {
        router.push('/admin/groups/create-group')
    }

    const handleEditGroup = (groupId: string) => {
        router.push(`/admin/groups/${groupId}/edit-group`)
    }

    const handleDeleteGroup = async (groupId: string) => {
        try {
            const res = await axios.delete(`/api/groups/${groupId}`);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
        router.push(`/admin/groups`)
    }

    return (
        <div>
            <button onClick={handleCreateGroup} className='bg-blue-500 hover:bg-blue-600 m-2 p-2'>Create Group</button>
            <h1 className='text-2xl font-semibold'>Groups</h1>
            <table className="min-w-96 bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-6 py-3 border-b text-gray-700 font-bold text-left">Group Name</th>
                        <th className="px-6 py-3 border-b"></th>
                        <th className="px-6 py-3 border-b"></th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-6 py-4 border-b text-gray-700  cursor-pointer hover:underline hover:text-gray-800 hover:font-semibold" onClick={() => handleClick(group.id)}>
                                {group.group_name}
                            </td>
                            <td className="px-6 py-4 border-b">
                                <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700 transition duration-200" onClick={() => handleEditGroup(group.id)}>
                                    Edit group
                                </button>
                            </td>
                            <td className="px-6 py-4 border-b">
                                <button className="bg-red-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-red-700 transition duration-200" onClick={() => handleDeleteGroup(group.id)}>
                                    Delete group
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Groups;
