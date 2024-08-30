"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function courseDetails({ params }: { params: { courseId: string } }) {
    const [activeSection, setActiveSection] = useState<string>('course');
    const [data, setData] = useState([
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
    ]);
    const router = useRouter();
    
    const handleAssignmentClick = (assignmentId: number, moduleId?: number) => {
        if (moduleId) {
            router.push(`/student/mycourse/${params.courseId}/modules/${moduleId}/assignments/${assignmentId}`);
        } else {
        router.push(`/student/mycourse/${params.courseId}/assignments/${assignmentId}`);
        }
    };

    const handleModuleClick = (moduleId: number) => {
        router.push(`/student/mycourse/${params.courseId}/modules/${moduleId}`);
    };
    
    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Course {params.courseId}</h1>
                <p className="text-lg text-gray-700 mb-6">Description of course 1</p>

                <nav className="mb-6 border border-gray-300 rounded-xl shadow-md p-2">
                    <ul className="flex justify-between space-x-4 list-none p-0">
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'course' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('course')}
                        >
                            Course
                        </li>
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'assignments' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('assignments')}
                        >
                            Assignments
                        </li>
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'grades' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('grades')}
                        >
                            Grades
                        </li>
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'participants' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('participants')}
                        >
                            Participants
                        </li>
                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'settings' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('settings')}
                        >
                            Settings
                        </li>
                    </ul>
                </nav>

                <div className="space-y-4">
                    {activeSection === 'course' && (
                        <div className="space-y-4 ">
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleModuleClick(1)}>
                                <h2 className="text-xl font-semibold mb-2">Module One</h2>
                                <p className="text-sm text-gray-600">The React Framework - created and maintained by @vercel.</p>
                            </div>
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleModuleClick(2)}>
                                <h2 className="text-xl font-semibold mb-2">Module Two</h2>
                                <p className="text-sm text-gray-600">Advanced concepts of React.</p>
                            </div>
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleModuleClick(3)}>
                                <h2 className="text-xl font-semibold mb-2">Module Three</h2>
                                <p className="text-sm text-gray-600">Advanced concepts of React.</p>
                            </div>
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer " onClick={() => handleModuleClick(4)}>
                                <h2 className="text-xl font-semibold mb-2">Module Four</h2>
                                <p className="text-sm text-gray-600">Advanced concepts of React.</p>
                            </div>
                        </div>
                    )}
                    {activeSection === 'assignments' && (
                        <div className="space-y-4 ">
                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleAssignmentClick(1)}>
                                <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                                <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                    <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                                    <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                                    <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => handleAssignmentClick(2)}>
                                <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                                <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                    <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                                    <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                                    <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                                </div>
                            </div>


                        </div>
                    )}
                    {activeSection === 'grades' && (
                        <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border-b">Grade</th>
                              <th className="py-2 px-4 border-b">Range</th>
                              <th className="py-2 px-4 border-b">Email</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, index) => (
                              <tr key={index}>
                                <td className="py-2 px-4 border-b">{item.grade}</td>
                                <td className="py-2 px-4 border-b">{item.range}</td>
                                <td className="py-2 px-4 border-b">{item.email}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {activeSection === 'participants' && (
                        <div className="space-y-4 ">
                        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => router.push(`/student/viewparticipants`)}>
                            <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                            <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                                <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                                <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer" onClick={() => router.push(`/student/viewparticipants`)}>
                            <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                            <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                                <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                                <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                            </div>
                        </div>


                    </div>
                    )}
                    {activeSection === 'settings' && (
                        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72">
                            <h2 className="text-xl font-semibold mb-2">Settings</h2>
                            <p className="text-sm text-gray-600">Settings and preferences for this course.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

