"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CourseDetails({ params }: { params: { courseId: string } }) {
    const [activeSection, setActiveSection] = useState<string>('users');

    const router = useRouter();

    // const handleModuleClick = (moduleId: number) => {
    //     router.push(`/student/mycourse/${params.courseId}/modules/${moduleId}`);
    // };

    const handleCreateUserClick = () => {
        router.push('/admin/create-user');
    };

    const handleUploadUsersClick = () => {
        router.push('/admin/upload-users');
    };

    const handleCreateCategoryClick = () => {
        router.push('/admin/course-category/create');
    };

    const handleModifyCategoryClick = () => {
        router.push('/admin/course-category/manage');
    };

    const handleViewUsersClick = () => {
        router.push('/admin/view-users');
    };

    return (
        <div className="border border-gray-300 m-5 max-h-full flex justify-center items-center">
            <div className="w-full max-w-4xl mx-auto p-5">
                {/* <h1 className="text-3xl font-bold mb-4">Course {params.courseId}</h1>
                <p className="text-lg text-gray-700 mb-6">Description of course 1</p> */}

                <nav className="mb-6 border {/*border-gray-300*/} rounded-xl shadow-md p-2">
                    <ul className="flex space-x-4 list-none p-0">
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'users' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('users')}
                        >
                            Users
                        </li>
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'course' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('course')}
                        >
                            Course Category
                        </li>
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'groups' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('groups')}
                        >
                            Groups
                        </li>
                    </ul>
                </nav>

                <div className="space-y-4">

                    {activeSection === 'users' && (
                        <div className="space-y-4 ">
                            <h2 className="text-xl font-semibold">User Management</h2>
                            <div className="space-y-4 justify-between mb-4">
                                <div className="bg-white border {/*border-gray-300*/} rounded-xl p-3 shadow-md h-12" onClick={handleCreateUserClick}>
                                    <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Add User</h2>
                                </div>

                                <div className="bg-white border {/*border-gray-300*/} rounded-xl p-3 shadow-md h-12 " onClick={handleUploadUsersClick}>
                                    <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Upload Users</h2>
                                </div>

                                <div className="bg-white border {/*border-gray-300*/} rounded-xl p-3 shadow-md h-12 " onClick={handleViewUsersClick}>
                                    <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">View Users</h2>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'course' && (
                        <div className="space-y-4 ">
                            <h2 className="text-xl font-semibold">Course Categegory Management</h2>
                            <div className="space-y-4 justify-between mb-4">
                                <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-md h-12" onClick={handleCreateCategoryClick}>
                                    <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Add Category</h2>
                                </div>

                                <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-md h-12 " onClick={handleModifyCategoryClick}>
                                    <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Manage categories</h2>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeSection === 'groups' && (
                        <div className="space-y-16">
                            <div className="space-y-4 ">
                                <h2 className="text-xl font-semibold">Group Management</h2>
                                <div className="space-y-4 justify-between mb-4">
                                    <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-md h-12" onClick={() => { router.push('/admin/groups/create-group') }}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">Create Group</h2>
                                    </div>

                                    <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-md h-12 " onClick={() => { router.push('/admin/groups') }}>
                                        <h2 className="text-base font-semibold mb-2 cursor-pointer w-fit">View Groups</h2>
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

