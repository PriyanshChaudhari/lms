"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios';

const CourseDetails = () => {
    const [activeSection, setActiveSection] = useState<string>('course');
    const [data, setData] = useState([
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
        { grade: 'Succelens99@yahoo.com', range: '$316.00', email: 'Succelens99@yahoo.com' },
    ]);

    const [participantData, setParticipantData] = useState([]);

    const [selectedLetter, setSelectedLetter] = useState<string>('All');

    const filteredParticipants = selectedLetter === 'All'
        ? participantData
        : participantData.filter(
            (item) => item.first_name.startsWith(selectedLetter)
        );

    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;

    const [courses, setCourses] = useState({})
    const [courseModules, setCourseModules] = useState([])
    const [assignments, setAssignments] = useState([])

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
                const res = await axios.post('/api/get/assignments', { courseId });
                setAssignments(res.data);  // Set as array or empty array
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

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    const sortedModules = courseModules.sort((a, b) => a.position - b.position);

    const handleAssignmentClick = (assignmentId: number, moduleId?: number) => {
        if (moduleId) {
            router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`);
        } else {
            router.push(`/teacher/${userId}/mycourse/${courseId}/assignments/${assignmentId}`);
        }
    };

    const handleModuleClick = (moduleId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`);
    }

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">{courses.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{courses.description}</p>

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

                    {/*modules completed */}
                    {activeSection === 'course' && (
                        sortedModules.map((module) => (
                            <div key={module.id} className="space-y-4">
                                <div
                                    className="bg-white border flex justify-between border-gray-300 rounded-xl p-4 shadow-md min-h-6 ">
                                    <h2 className="text-xl font-semibold">{module.title}</h2>
                                    <h2 className="text-xl font-semibold">{module.description}</h2>
                                    <h2 className="text-xl font-semibold">{module.position}</h2>
                                    <div className='px-3 rounded-xl cursor-pointer bg-gray-300  hover:bg-gray-200' onClick={() => handleModuleClick(module.id)} > GO -> </div>
                                </div>

                            </div>
                        ))
                    )}

                    {activeSection === 'assignments' && (
                        <div className="space-y-4">
                            {assignments.map((assignment) => (
                                <div key={assignment.id} className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-64 cursor-pointer" onClick={() => handleAssignmentClick(assignment.id)}>
                                    <h2 className="text-xl font-semibold mb-6">{assignment.title}</h2>
                                    <div className="shadow-md items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                                        <p className="text-sm text-gray-600 mb-4">Description : {assignment.description}</p>
                                        <p className="text-sm text-gray-600 mb-4">Total Marks : {assignment.total_marks}</p>

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
                            <div className="border border-gray-300 dark:text-white rounded-xl p-6 shadow-md cursor-pointer">
                                {/* <h2 className="text-xl font-semibold mb-6">Course Participants</h2>  */}
                                <h1 className="text-xl font-bold mb-b">Participants</h1>
                                <div className="shadow-md items-center p-5 border border-gray-100 rounded-xl">
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full border border-gray-300">
                                            <tbody>
                                                <tr className="mt-4">
                                                    <td className="p-1.5 border border-gray-300 text-sm">Filter by Name</td>
                                                    {['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
                                                        <td
                                                            key={letter}
                                                            className={`p-1.5 border border-gray-300 cursor-pointer text-sm ${selectedLetter === letter ? 'font-bold' : ''}`}
                                                            onClick={() => setSelectedLetter(letter)}
                                                        >
                                                            {letter}
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* <ul>
                                        {filteredParticipants.map((participant) => (
                                            <li key={participant.student_id} className="mb-2">
                                                {participant.first_name} {participant.last_name} ({participant.email})

                                            </li>
                                        ))}
                                    </ul> */}
                                    <div className="overflow-x-auto">
                                        {filteredParticipants.length === 0 ? (
                                            <p>No participants found.</p>
                                        ) : (
                                            <table className="min-w-full table-auto border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                        <th className="py-3 px-6 text-left">Student ID</th>
                                                        <th className="py-3 px-6 text-left">First Name</th>
                                                        <th className="py-3 px-6 text-left">Last Name</th>
                                                        <th className="py-3 px-6 text-left">Email</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-600 text-sm font-light">
                                                    {filteredParticipants.map((participant) => (
                                                        <tr key={participant.student_id} className="border-b border-gray-200 hover:bg-gray-100">
                                                            <td className="py-3 px-6 text-left whitespace-nowrap">{participant.student_id}</td>
                                                            <td className="py-3 px-6 text-left">{participant.first_name}</td>
                                                            <td className="py-3 px-6 text-left">{participant.last_name}</td>
                                                            <td className="py-3 px-6 text-left">{participant.email}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}

export default CourseDetails;
