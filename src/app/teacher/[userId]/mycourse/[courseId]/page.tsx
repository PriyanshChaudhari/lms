"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios';
import AddOneStudent from '@/components/Upload/AddOneStudent';
import AddOneTeacher from '@/components/Upload/AddOneTeacher';
import ExcelEnrollComponent from './ExcelEnrollComponent';
import ExcelUnEnrollComponent from './ExcelUnEnrollComponent';
import EnrollByGroupComponent from './EnrollByGroupComponent';

interface users {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}
interface courses {
    course_id: string;
    title: string;
    description: string;
    teacher_id: string;
    category: string;
}

interface modules {
    id: string;
    course_id: string;
    title: string;
    description: string;
    position: number;
}

interface assignments {
    id: string;
    title: string;
    due_date: object;
    module_id: string;
    description: string;
    total_marks: number;
}

const CourseDetails = () => {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;

    const [courses, setCourses] = useState<courses | null>(null)
    const [courseModules, setCourseModules] = useState<modules[]>([])
    const [assignments, setAssignments] = useState<assignments[]>([])
    const [participantData, setParticipantData] = useState<users[]>([]);

    const [activeSection, setActiveSection] = useState<string>('course');
    const [data, setData] = useState([
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
    ]);

    const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term

    const [addUser, setAddUser] = useState(false);  // Controls showing the add participants section
    const [showAddStudent, setShowAddStudent] = useState(false);  // Controls showing Add Student form
    const [showAddTeacher, setShowAddTeacher] = useState(false);  // Controls showing Add Teacher form

    const filteredParticipants = searchTerm === ''
        ? participantData
        : participantData.filter(
            (item) =>
                item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.last_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axios.post(`/api/get/course-details`, { courseId })
                setCourses(res.data.courseDetails)
            } catch (error) {
                console.log(error)
            }
        }
        getCourse()

        const getCourseModules = async () => {
            try {
                const res = await axios.post('/api/get/course-modules', { courseId })
                setCourseModules(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseModules()

        const getAssignments = async () => {
            try {
                const res = await axios.post('/api/get/assignments/all-assignments', { courseId });
                setAssignments(res.data.assignments);  // Set as array or empty array
                console.log(res.data.assignments || []);
            } catch (error) {
                console.log(error);
            }
        };
        getAssignments();

        const getParticipants = async () => {
            try {
                const res = await axios.post('/api/get/participants', { courseId })
                setParticipantData(res.data.participants)
                console.log(participantData)
            } catch (error) {
                console.log(error)
            }
        }
        getParticipants()
    }, [courseId])

    const formatDate = (timestamp: any) => {
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    const sortedModules = courseModules.sort((a, b) => a.position - b.position);

    const handleModuleClick = (moduleId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`);
    }

    const addModule = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules`)
    }

    const handleAssignmentClick = (assignmentId: string, moduleId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`);
    };

    const handleRemoveParticipant = async (userId: string, courseId: string) => {
        try {
            const res = await axios.delete("/api/enrollment", {
                data: { user_id: userId, course_id: courseId } // Use 'data' to pass the body in DELETE request
            });
            console.log('Participant removed:', res.data);
        } catch (error) {
            console.error('Error removing participant:', error);
        }
    };


    return (
        <div className="border border-gray-300 m-5 h-screen flex justify-center items-center">
            <div className="w-full max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{courses?.title}</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{courses?.description}</p>

                <nav className="mb-6 border border-gray-300 rounded-xl shadow-md p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
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
                            {assignments.length > 0 && (
                                <span className="ml-2 bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                                    {assignments.length}
                                </span>
                            )}
                        </li>

                        {/* <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'grades' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('grades')}
                        >
                            Grades
                        </li> */}

                        <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'participants' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('participants')}
                        >
                            Participants
                            {participantData.length > 0 && (
                                <span className="ml-2 bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                                    {participantData.length}
                                </span>
                            )}
                        </li>

                        {/* <li
                            className={` p-3 rounded-xl cursor-pointer ${activeSection === 'settings' ? 'bg-gray-400 text-white' : ''}`}
                            onClick={() => setActiveSection('settings')}
                        >
                            Settings
                        </li> */}
                    </ul>
                </nav>

                <div className="space-y-4">

                    {/*modules completed */}
                    {activeSection === 'course' && (
                        <div className="space-y-4">
                            {/* Add Module Button */}
                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                                    onClick={addModule} // Replace with your add module logic
                                >
                                    Add Module
                                </button>
                            </div>

                            {/* Modules List */}
                            {sortedModules.map((module) => (
                                <div key={module.id} className="space-y-4">
                                    <div className="border flex justify-between border-gray-300 rounded-xl p-4 shadow-md min-h-6">
                                        <h2 className="text-lg font-semibold">{module.position}</h2>
                                        <h2 className="text-lg font-semibold">{module.title}</h2>
                                        <h2 className="text-lg font-semibold">{module.description}</h2>
                                        <div
                                            className="px-3 rounded flex justify-center items-center cursor-pointer bg-gray-300 hover:bg-gray-400"
                                            onClick={() => handleModuleClick(module.id)}
                                        >
                                        GO ->
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {activeSection === 'assignments' && (
                        <div className="space-y-4">
                            {assignments.map((assignment) => (
                                <div key={assignment.id} className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-64 cursor-pointer" onClick={() => handleAssignmentClick(assignment.id, assignment.module_id)}>
                                    <h2 className="text-xl font-semibold mb-6">{assignment.title}</h2>
                                    <div className="shadow-md items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                        <p className="text-sm text-gray-600 mb-4">Description : {assignment.description}</p>
                                        <p className="text-sm text-gray-600 mb-4">Total Marks : {assignment.total_marks}</p>
                                        <p className="text-sm text-gray-600 mb-4">Module_id : {assignment.module_id}</p>

                                        <p className="text-sm text-gray-600 mb-4">Due Date : {formatDate(assignment.due_date)}</p>
                                    </div>
                                </div>
                            ))}
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

                    {/* completed */}
                    {activeSection === 'participants' && (
                        <div className="space-y-4">
                            {/* Conditional rendering based on addUser */}
                            {!addUser ? (
                                <div className="border border-gray-300 dark:text-white rounded-xl p-6 shadow-md cursor-pointer">
                                    <div className='flex justify-between mb-3 items-center'>
                                        <h1 className="text-xl font-bold mb-b">Participants</h1>
                                        <button
                                            className='bg-gray-950 dark:bg-gray-400 hover:bg-gray-700 px-4 py-2 text-white rounded'
                                            onClick={() => setAddUser(true)}  // Show form options and hide list
                                        >
                                            Add Participants
                                        </button>
                                    </div>

                                    <div className="shadow-md items-center p-5 border border-gray-100 rounded-xl">
                                        <div className="overflow-x-auto mb-4">
                                            <input
                                                type="text"
                                                placeholder="Search participants by name"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="mb-4 p-2 border border-gray-300 dark:bg-[#212830] rounded w-full"
                                            />
                                        </div>
                                        <div className="overflow-x-auto">
                                            {filteredParticipants.length === 0 ? (
                                                <p>No participants found.</p>
                                            ) : (
                                                <table className="min-w-full table-auto border-collapse border border-gray-300">
                                                    <thead>
                                                        <tr className="bg-gray-200 dark:bg-[#212830] text-gray-600 uppercase text-sm leading-normal">
                                                            <th className="py-3 px-6 text-center">Student ID</th>
                                                            <th className="py-3 px-6 text-center">First Name</th>
                                                            <th className="py-3 px-6 text-center">Last Name</th>
                                                            <th className="py-3 px-6 text-center">Email</th>
                                                            <th className="py-3 px-6 text-center">Role</th>
                                                            <th className="py-3 px-6 text-center">Remove USER</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-gray-600 dark:text-gray-300 text-sm font-normal">
                                                        {filteredParticipants.map((participant) => (
                                                            <tr key={participant.user_id} className="border-b border-gray-200 ">
                                                                <td className="py-3 px-6 text-center whitespace-nowrap">{participant.user_id}</td>
                                                                <td className="py-3 px-6 text-center">{participant.first_name}</td>
                                                                <td className="py-3 px-6 text-center">{participant.last_name}</td>
                                                                <td className="py-3 px-6 text-center">{participant.email}</td>
                                                                <td className="py-3 px-6 text-center capitalize">{participant.role}</td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => handleRemoveParticipant(participant.user_id, courseId)}
                                                                        className="py-3 px-6 text-center capitalize">
                                                                        ❌
                                                                    </button>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Enrollment section for either Student or Teacher with close button
                                <div className="border border-gray-300 dark:text-white rounded p-6 shadow-md cursor-pointer">

                                    <div className='flex justify-between mb-3 items-center'>
                                        <h1 className="text-xl font-bold mb-b">Add Participants</h1>
                                        <button
                                            className='bg-red-500 hover:bg-red-700 px-4 py-2 text-white rounded'
                                            onClick={() => setAddUser(false)}  // Hide form and show list
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        {/* Buttons to select between Student or Teacher form */}
                                        <div className="flex space-x-4">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                onClick={() => {
                                                    setShowAddStudent(true);
                                                    setShowAddTeacher(false);
                                                }}
                                            >
                                                Add Student
                                            </button>
                                            <button
                                                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                                                onClick={() => {
                                                    setShowAddStudent(false);
                                                    setShowAddTeacher(true);
                                                }}
                                            >
                                                Add Teacher
                                            </button>
                                        </div>

                                        {/* Conditionally render AddOneStudent or AddOneTeacher form based on state */}
                                        {showAddStudent && (
                                            <>
                                                {/* <div className="mt-4">
                                                    <AddOneStudent courseId={courseId} />
                                                </div> */}
                                                {/* <div className="mt-4">
                                                    <EnrollByGroupComponent/>
                                                </div> */}
                                                {/* <div>
                                                    <ExcelUnEnrollComponent/>
                                                </div> */}
                                                <div className="mt-4">
                                                    <ExcelEnrollComponent  />
                                                </div>
                                                {/* <div className="mt-4">
                                                    <ExcelUnEnrollComponent />
                                                </div> */}
                                            </>

                                        )}

                                        {showAddTeacher && (
                                            <>
                                                {/* <div className="mt-4">
                                                    <AddOneTeacher courseId={courseId} />
                                                </div> */}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}




                </div>
            </div>
        </div >
    );
}

export default CourseDetails;
