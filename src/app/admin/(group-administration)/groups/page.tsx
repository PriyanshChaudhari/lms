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
            <h1>Groups</h1>
            <table className='bg-red-100'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {groups.map(group => (
                        <tr key={group.id}>
                            <td onClick={() => handleClick(group.id)}>{group.group_name}</td>
                            <button onClick={() => handleEditGroup(group.id)}>Edit group</button>
                            <button onClick={() => handleDeleteGroup(group.id)}>Delete group</button>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Groups;
