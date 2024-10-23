"use client"
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

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
        // <div className="border border-gray-300 dark:bg-[#212830] m-5 max-h-full flex justify-center items-center">
        //     <div className="w-full max-w-4xl mx-auto p-5">
        //         {/* <h1 className="text-3xl font-bold mb-4">Course {params.courseId}</h1>
        //         <p className="text-lg text-gray-700 mb-6">Description of course 1</p> */}

        //         <nav className="mb-6 border {/*border-gray-300*/} rounded-lg-xl shadow-md p-2 dark:bg-[#212830]">
        //             <ul className="flex space-x-4 list-none p-0">
        // <li
        //     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'users' ? 'bg-gray-400 text-white' : ''}`}
        //     onClick={() => setActiveSection('users')}
        // >
        //     Users
        // </li>
        // <li
        //     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'course' ? 'bg-gray-400 text-white' : ''}`}
        //     onClick={() => setActiveSection('course')}
        // >
        //     Course Category
        // </li>
        // <li
        //     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'groups' ? 'bg-gray-400 text-white' : ''}`}
        //     onClick={() => setActiveSection('groups')}
        // >
        //     Groups
        // </li>
        //             </ul>
        //         </nav>

        //         <div className="space-y-4">

        // {activeSection === 'users' && (
        //     <div className="space-y-4 dark:bg-[#212830]">
        //         <h2 className="text-xl font-semibold">User Management</h2>
        //         <div className="space-y-4 justify-between mb-4">
        //             <div className="bg-white dark:bg-[#212830] border {/*border-gray-300*/} rounded-lg-xl p-3 shadow-md h-12" onClick={handleCreateUserClick}>
        //                 <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Create User</h2>
        //             </div>

        //             <div className="bg-white dark:bg-[#212830] border {/*border-gray-300*/} rounded-lg-xl p-3 shadow-md h-12 " onClick={handleUploadUsersClick}>
        //                 <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Upload Users</h2>
        //             </div>

        //             <div className="bg-white dark:bg-[#212830] border {/*border-gray-300*/} rounded-lg-xl p-3 shadow-md h-12 " onClick={handleViewUsersClick}>
        //                 <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">View Users</h2>
        //             </div>

        //             <div className="bg-white dark:bg-[#212830] border {/*border-gray-300*/} rounded-lg-xl p-3 shadow-md h-12 " onClick={handleDeleteUsersClick}>
        //                 <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Delete Users</h2>
        //             </div>
        //         </div>
        //     </div>
        // )}

        // {activeSection === 'course' && (
        //     <div className="space-y-4 ">
        //         <h2 className="text-xl font-semibold">Course Categegory Management</h2>
        //         <div className="space-y-4 justify-between mb-4">
        //             <div className="bg-white dark:bg-[#212830] border border-gray-300 rounded-lg-xl p-3 shadow-md h-12" onClick={handleCreateCategoryClick}>
        //                 <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Add Category</h2>
        //             </div>

        //             <div className="bg-white dark:bg-[#212830] border border-gray-300 rounded-lg-xl p-3 shadow-md h-12 " onClick={handleModifyCategoryClick}>
        //                 <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Manage categories</h2>
        //             </div>
        //         </div>
        //     </div>
        // )}


        // {activeSection === 'groups' && (
        //     <div className="space-y-16">
        //         <div className="space-y-4 ">
        //             <h2 className="text-xl font-semibold">Group Management</h2>
        //             <div className="space-y-4 justify-between mb-4">
        //                 <div className="bg-white dark:bg-[#212830] border border-gray-300 rounded-lg-xl p-3 shadow-md h-12" onClick={() => { router.push(`/admin/${userId}/groups/create-group`) }}>
        //                     <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Create Group</h2>
        //                 </div>

        //                 <div className="bg-white dark:bg-[#212830] border border-gray-300 rounded-lg-xl p-3 shadow-md h-12 " onClick={() => { router.push(`/admin/${userId}/groups`) }}>
        //                     <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">View Groups</h2>
        //                 </div>

        //             </div>
        //         </div>
        //     </div>
        // )}
        //         </div>
        //     </div>
        // </div>

        <div className="min-h-screen bg-gray-50 dark:bg-transparent py-8 px-4">
            <div className="max-w-7xl mx-auto">

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
                        <div className="space-y-16 bg-gray-50 dark:bg-[#151b23]">
                            <div className="space-y-4 p-6">
                                <h2 className="text-xl font-semibold">User Management</h2>
                                <div className="space-y-4 justify-between mb-4">
                                    <div className=" dark:bg-[#212830]  rounded-lg-xl p-3 shadow-md h-12" onClick={handleCreateUserClick}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Create User</span></h2>
                                    </div>

                                    <div className="  dark:bg-[#212830] rounded-lg-xl p-3 shadow-md h-12 " onClick={handleUploadUsersClick}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Upload Users</span></h2>
                                    </div>

                                    <div className=" dark:bg-[#212830]  rounded-lg-xl p-3 shadow-md h-12 " onClick={handleViewUsersClick}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">View Users</span></h2>
                                    </div>

                                    <div className=" dark:bg-[#212830] rounded-lg-xl p-3 shadow-md h-12 " onClick={handleDeleteUsersClick}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Delete Users</span></h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'course' && (
                        <div className="space-y-16 bg-gray-50 dark:bg-[#151b23]">
                            <div className="space-y-4 p-6">
                                <h2 className="text-xl font-semibold">Course Categegory Management</h2>
                                <div className="space-y-4 justify-between mb-4">
                                    <div className=" dark:bg-[#212830]  rounded-lg-xl p-3 shadow-md h-12" onClick={handleCreateCategoryClick}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Add Category</span></h2>
                                    </div>

                                    <div className="  dark:bg-[#212830] rounded-lg-xl p-3 shadow-md h-12 " onClick={handleModifyCategoryClick}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Manage categories</span></h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeSection === 'groups' && (
                        <div className="space-y-16 bg-gray-50 dark:bg-[#151b23]">
                            <div className="space-y-4 p-6">
                                <h2 className="text-xl font-semibold">Group Management</h2>
                                <div className="space-y-4 justify-between mb-4">
                                    <div className=" dark:bg-[#212830]  rounded-lg-xl p-3 shadow-md h-12" onClick={() => { router.push(`/admin/${userId}/groups/create-group`) }}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">Create Group</span></h2>
                                    </div>

                                    <div className=" dark:bg-[#212830] rounded-lg-xl p-3 shadow-md h-12 " onClick={() => { router.push(`/admin/${userId}/groups`) }}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">→  <span className="ml-2">View Groups</span></h2>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>


    );
};

