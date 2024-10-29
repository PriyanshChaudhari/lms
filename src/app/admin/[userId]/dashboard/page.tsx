"use client"
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Calendar from '../calender/page';

export default function CourseDetails() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const [activeSection, setActiveSection] = useState<string>('users');

    const handleCreateUserClick = () => {
        router.push(`/admin/${userId}/create-user`);
    };

    const handleUploadUsersClick = () => {
        router.push(`/admin/${userId}/upload-users`);
    };

    const handleCreateCategoryClick = () => {
        router.push(`/admin/${userId}/course-category/create`);
    };

    const handleModifyCategoryClick = () => {
        router.push(`/admin/${userId}/course-category/manage`);
    };

    const handleViewUsersClick = () => {
        router.push(`/admin/${userId}/view-users`);
    };

    const handleDeleteUsersClick = () => {
        router.push(`/admin/${userId}/delete-users`);
    };

    return (


        <div className="flex flex-col lg:flex-row   mx-auto">
            <div className="w-full min-h-screen bg-gray-50 dark:bg-transparent p-8">
                <div className="w-full max-w-7xl mx-auto">

                    <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm p-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Admin Dashboard
                        </h1>

                    </div>


                    <nav className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm mb-8">
                        <ul className="flex p-2 gap-2 font-medium">
                            <li
                                className={` p-3 rounded-lg-xl cursor-pointer 
                 ${activeSection === 'users'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setActiveSection('users')}
                            >
                                Users
                            </li>
                            <li
                                className={` p-3 rounded-lg-xl cursor-pointer
             ${activeSection === 'course'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setActiveSection('course')}
                            >
                                Course Category
                            </li>
                            <li
                                className={` p-3 rounded-lg-xl cursor-pointer 
                 ${activeSection === 'groups'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setActiveSection('groups')}
                            >
                                Groups
                            </li>
                        </ul>
                    </nav>

                    <div className="space-y-6">

                        {activeSection === 'users' && (
                            <div className="space-y-16 bg-white dark:bg-[#151b23]">
                                <div className="space-y-4 p-6">
                                    <h2 className="text-xl font-semibold">User Management</h2>
                                    <div className="space-y-4 justify-between mb-4">
                                        <div className=" dark:bg-[#212830] bg-gray-50  rounded-lg-xl p-3 shadow-md h-12" onClick={handleCreateUserClick}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Create User</span></h2>
                                        </div>

                                        <div className="  dark:bg-[#212830] bg-gray-50 rounded-lg-xl p-3 shadow-md h-12 " onClick={handleUploadUsersClick}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Upload Users</span></h2>
                                        </div>

                                        <div className=" dark:bg-[#212830] bg-gray-50  rounded-lg-xl p-3 shadow-md h-12 " onClick={handleViewUsersClick}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">View Users</span></h2>
                                        </div>

                                        <div className=" dark:bg-[#212830] bg-gray-50 rounded-lg-xl p-3 shadow-md h-12 " onClick={handleDeleteUsersClick}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Delete Users</span></h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'course' && (
                            <div className="space-y-16 bg-white dark:bg-[#151b23]">
                                <div className="space-y-4 p-6">
                                    <h2 className="text-xl font-semibold">Course Categegory Management</h2>
                                    <div className="space-y-4 justify-between mb-4">
                                        <div className=" dark:bg-[#212830] bg-gray-50  rounded-lg-xl p-3 shadow-md h-12" onClick={handleCreateCategoryClick}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Add Category</span></h2>
                                        </div>

                                        <div className="  dark:bg-[#212830] bg-gray-50 rounded-lg-xl p-3 shadow-md h-12 " onClick={handleModifyCategoryClick}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Manage categories</span></h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeSection === 'groups' && (
                            <div className="space-y-16 bg-white dark:bg-[#151b23]">
                                <div className="space-y-4 p-6">
                                    <h2 className="text-xl font-semibold">Group Management</h2>
                                    <div className="space-y-4 justify-between mb-4">
                                        <div className=" dark:bg-[#212830] bg-gray-50  rounded-lg-xl p-3 shadow-md h-12" onClick={() => { router.push(`/admin/${userId}/groups/create-group`) }}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Create Group</span></h2>
                                        </div>

                                        <div className=" dark:bg-[#212830] bg-gray-50 rounded-lg-xl p-3 shadow-md h-12 " onClick={() => { router.push(`/admin/${userId}/groups`) }}>
                                            <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">View Groups</span></h2>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>
                <div className="lg:w-96 bg-gray-100 dark:bg-[#151b23] rounded-lg shadow-md  h-screen sticky top-8">
                    <Calendar />
                </div>
            </div>



            );
};

