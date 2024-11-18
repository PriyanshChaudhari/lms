"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import AddOneMemberComponent from './AddOneMemberComponent';
import ExcelMemberComponent from './ExcelMemberComponent';
import { TiUserDelete } from 'react-icons/ti';

interface User {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Group {
  id: string;
  group_name: string;
}

const Group = () => {
  const params = useParams();
  const groupId = params.groupId as string;

  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isManageUserVisible, setIsManageUserVisible] = useState(false);
  const [isAddOneMember, setIsAddOneMember] = useState(false);
  const [isExcelUpload, setIsExcelUpload] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<Group>({});

  const getGroups = async () => {
    try {
      const res = await axios.get(`/api/groups/${groupId}`); // Added leading slash to the API path
      setGroup(res.data.group); // Make sure `groups` key exists in the response
      setLoading(false)
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
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

    getGroups();
    getGroupMembers();
  }, [groupId]);

  const handleRemoveUser = async (userId: string) => {
    try {
      const res = await axios.post('/api/groups/remove-member', { groupId, userId });
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

  const handleCloseAddOneMember = () => {
    setIsAddOneMember(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-[#212830] flex justify-center items-center h-screen">
      <div className=" w-full max-w-4xl mx-auto p-6  bg-white dark:bg-[#151b23]  rounded-lg-lg shadow-md">
        <div className="flex gap-4 justify-center items-center mb-6">
          {!loading && <h1 className="text-2xl font-semibold text-center ">{group.group_name}</h1>}
          <div>
            <button
              onClick={() => setIsManageUserVisible(!isManageUserVisible)}
              className={`${isManageUserVisible ? 'hidden' : 'bg-blue-600 hover:bg-blue-700'
                } text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-200`}
            >
              {isManageUserVisible ? 'Close' : 'Manage Members'}
            </button>
          </div>
        </div>
        <div className="text-center mb-4">
          <div>


            {isManageUserVisible && (

              <div className="mt-4 flex gap-4 justify-center ">
                <button
                  onClick={() => {
                    setIsAddOneMember(true);
                    setIsExcelUpload(false);
                  }}
                  className="w-fit bg-green-600 text-sm text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 "
                >
                  Add Members (Manually)
                </button>
                <button
                  onClick={() => {
                    setIsAddOneMember(false);
                    setIsExcelUpload(true);
                  }}
                  className="w-fit bg-orange-600 text-sm text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition duration-200 "
                >
                  Add Members (Excel File)
                </button>
                <button
                  onClick={() => setIsManageUserVisible(!isManageUserVisible)}
                  className="bg-red-600 text-sm text-white font-semibold w-fit  py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 "
                >
                  Cancel
                </button>
              </div>

            )}
          </div>

          <div>
            {(isManageUserVisible && isAddOneMember) && <AddOneMemberComponent onClose={handleCloseAddOneMember} />}
            {(isManageUserVisible && isExcelUpload) && <ExcelMemberComponent onClose={() => setIsExcelUpload(false)} />}
          </div>
        </div>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <table className="min-w-full text-center rounded-lg border border-gray-300 rounded-lg-lg">
          <thead>
            <tr>
              <th className="border  px-4 py-2 border-b font-semibold">User ID</th>
              <th className="border px-4 py-2 border-b font-semibold">First Name</th>
              <th className="border px-4 py-2 border-b font-semibold">Last Name</th>
              <th className="border px-4 py-2 border-b font-semibold">Email ID</th>
              <th className="border px-4 py-2 border-b font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td className="px-4 border py-2 border-b">{user.userId}</td>
                <td className="px-4 border py-2 border-b">{user.first_name}</td>
                <td className="px-4 border py-2 border-b">{user.last_name}</td>
                <td className="px-4 border py-2 border-b">{user.email}</td>
                {/* <td className="px-4 border py-2 border-b">
                  <button
                    onClick={() => handleRemoveUser(user.userId)}
                    className="bg-red-600 text-white font-semibold py-1 px-4 rounded-lg-md hover:bg-red-700 transition duration-200"
                  >
                    Remove
                  </button> */}
                {/* </td> */}
                <td className="border px-4 py-2 border-b text-center">
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 py-2 px-5 rounded-[9px] transition-all duration-200 ease-in-out transform focus:outline-none"
                      onClick={() => handleRemoveUser(user.userId)}
                    >
                      Remove
                      <TiUserDelete className="text-white text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Group;