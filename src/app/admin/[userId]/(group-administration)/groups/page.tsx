"use client"
import axios from 'axios';
import { group } from 'console';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Group {
    id: string;
    group_name: string;
}

const Groups = () => {
    const params = useParams();
    const userId = params.userId as string;
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
        <div className="flex justify-content items-center  h-screen ">
            <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-6">Group Management</h1>
            <div className="text-center mb-4">
                <button
                    onClick={handleCreateGroup}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Create Group
                </button>
            </div>


            {/* Display group members */}
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                    <tr className="text-center">
                        <th className="px-4 py-2 border-b font-semibold ">Name</th>
                        <th className="px-4 py-2 border-b font-semibold ">Edit Group</th>
                        <th className="px-4 py-2 border-b font-semibold ">Delete Group</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id} className="text-center">
                            <td onClick={() => handleClick(group.id)} className="px-4 py-2 border-b underline">{group.group_name}</td>
                            <td className="px-4 py-2 border-b"><button onClick={() => handleEditGroup(group.id)}>Edit group</button></td> 
                            <td className="px-4 py-2 border-b"><button className='bg-red-500 hover:bg-red-600 text-sm text-white p-1 rounded' onClick={() => handleDeleteGroup(group.id)}>Delete</button></td> 
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
        </div>
    );
};

export default Groups;