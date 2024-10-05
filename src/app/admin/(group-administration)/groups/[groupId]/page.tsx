"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import AddUserComponent from './AddUserComponent';

interface users {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
}

const Group = () => {
  const params = useParams();
  const groupId = params.groupId as string;

  const [users, setUsers] = useState<users[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);

  useEffect(() => {
    // Fetch group members
    const getGroupMembers = async () => {
      try {
        const res = await axios.get(`/api/groups/${groupId}/members`);
        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          setErrorMessage('Failed to fetch group members');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching group members');
      }
    };

    getGroupMembers();
  }, [groupId]);

  // Handle removing a user
  const handleRemoveUser = async (userId: string) => {
    try {
      const res = await axios.post('/api/groups/remove-user', { groupId, userId });
      if (res.data.success) {
        setSuccessMessage('User removed successfully');
        setUsers(users.filter(user => user.userId !== userId));
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to remove user');
      }
    } catch (error) {
      setErrorMessage('An error occurred while removing the user');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Group Management</h1>
      <div className="text-center mb-4">
        <button
          onClick={() => setIsAddUserVisible(!isAddUserVisible)}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isAddUserVisible ? 'Cancel' : 'Add User'}
        </button>
        {isAddUserVisible && (
        <AddUserComponent />
      )}
      </div>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      {/* Display group members */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b font-semibold text-left">User ID</th>
            <th className="px-4 py-2 border-b font-semibold text-left">First Name</th>
            <th className="px-4 py-2 border-b font-semibold text-left">Last Name</th>
            <th className="px-4 py-2 border-b font-semibold text-left">Email ID</th>
            <th className="px-4 py-2 border-b font-semibold text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td className="px-4 py-2 border-b">{user.userId}</td>
              <td className="px-4 py-2 border-b">{user.first_name}</td>
              <td className="px-4 py-2 border-b">{user.last_name}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleRemoveUser(user.userId)}
                  className="bg-red-600 text-white font-semibold py-1 px-4 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Group;
