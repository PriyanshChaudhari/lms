"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation'
import axios from 'axios';
import AddOneStudent from '@/components/Upload/AddOneStudent';
import AddOneTeacher from '@/components/Upload/AddOneTeacher';
import ExcelEnrollComponent from './ExcelEnrollComponent';
import EnrollByGroupComponent from './EnrollByGroupComponent';
import GradesTable from './GradesComponent';
import UploadGrades from './UploadGrades';
import UploadGradesDialog from './UploadGradesDialog';
import TeacherModulesComponent from './TeacherModulesComponent';
import { Plus } from 'lucide-react';

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
    created_at: Date
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
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [courses, setCourses] = useState<courses | null>(null)
    const [courseModules, setCourseModules] = useState<modules[]>([])
    const [assignments, setAssignments] = useState<assignments[]>([])
    const [participantData, setParticipantData] = useState<users[]>([]);

    const [activeSection, setActiveSection] = useState<string>('modules');

    const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term

    const [addUser, setAddUser] = useState(false);  // Controls showing the add participants section
    const [showAddStudent, setShowAddStudent] = useState(true);  // Controls showing Add Student form
    const [showAddTeacher, setShowAddTeacher] = useState(false);  // Controls showing Add Teacher form

    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const filteredParticipants = searchTerm === ''
        ? participantData
        : participantData.filter(
            (item) =>
                item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.user_id.includes(searchTerm)
        );
    useEffect(() => {
        // const section = searchParams.get('section');
        // if (section) {
        //     setActiveSection(section);
        // }

        const getActiveSection = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const section = urlParams.get('section');
            if (section) {
                setActiveSection(section);
            }
        };

        const scrollToModule = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.getElementById(hash.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        getActiveSection();
        scrollToModule();

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
    }, [courseId, searchParams])

    const formatDate = (timestamp: any) => {
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString(); // Format the date as a readable string
    };

    const sortedModules = courseModules.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA; // Ascending order (earliest to latest)
    });

    const handleModuleClick = (moduleId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}`);
    }

    const addModule = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/create-module`)
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-transparent py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Course Header */}
                <div className="bg-white dark:bg-[#151b23] rounded-lg shadow-sm p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {courses?.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">{courses?.description}</p>
                </div>

                {/* Navigation */}
                <nav className="bg-white dark:bg-[#151b23] rounded-lg shadow-sm mb-8">
                    <ul className="flex p-2 gap-2">
                        {['modules', 'assignments', 'grades', 'participants'].map((section) => (
                            <li key={section}>
                                <button
                                    onClick={() => setActiveSection(section)}
                                    className={`px-4 py-2 rounded-lg-md font-medium transition-colors
                                        ${activeSection === section
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                    {(section === 'assignments' && assignments.length >= 0) && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
                                            {assignments.length}
                                        </span>
                                    )}
                                    {(section === 'participants' && participantData.length > 0) && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
                                            {participantData.length}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="space-y-6">
                    {/* Module Section */}
                    {activeSection === 'modules' && (
                        <div>
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={addModule}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium gap-1 transition-colors duration-200"
                                ><Plus
                                        className="text-white  cursor-pointer"
                                    />
                                    Add Module
                                </button>
                            </div>
                            <div className="grid gap-4">
                                {sortedModules.map((module) => (
                                    <div
                                        key={module.id}
                                        id={module.id}
                                        className="bg-white dark:bg-[#151b23] rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
                                    >
                                        <div className="flex flex-col items-center justify-between p-6">
                                            {/* <span className="flex items-center gap-6 w-full">
                                                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                                    
                                                </span>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                        {module.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        {module.description}
                                                    </p>
                                                </div>
                                            </span> */}
                                            <TeacherModulesComponent moduleId={module.id} module={module} courseId={courseId} userId={userId} />
                                            {/* <button
                                                onClick={() => handleModuleClick(module.id)}
                                                className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                View Module →
                                            </button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assignments Section */}
                    {activeSection === 'assignments' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {assignments.length > 0 ? (
                                assignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        onClick={() => handleAssignmentClick(assignment.id, assignment.module_id)}
                                        className="bg-white dark:bg-[#151b23] rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
                                    >
                                        <div className="flex justify-between">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                                {assignment.title}
                                            </h3>
                                            <div >
                                                <span className="bg-zinc-300 dark:bg-gray-700 p-3 text-clip bg-opacity-20 text-sm text-gray-500 dark:text-gray-400  px-2 py-1 rounded-lg">
                                                    View
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {assignment.description}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Total Marks
                                                    </p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {assignment.total_marks}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Due Date
                                                    </p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {formatDate(assignment.due_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                                        No assignments available.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Grades Section */}
                    {activeSection === 'grades' && (
                        <div>
                            {/* <button
                                onClick={openModal}
                                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Upload Grades
                            </button> */}
                            <UploadGradesDialog courseId={courseId} />
                            <GradesTable courseId={courseId} teacherId={userId} />
                        </div>
                    )}

                    {/* Participants Section */}
                    {activeSection === 'participants' && (
                        <div className="bg-white dark:bg-[#151b23] rounded-lg shadow-sm">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Participants
                                    </h2>
                                    {!addUser ? (
                                        <button
                                            onClick={() => setAddUser(true)}
                                            className="flex bg-blue-500 gap-1 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                                        >
                                            <Plus
                                                className="text-white cursor-pointer"
                                            />Add Participants
                                        </button>

                                    ) : (
                                        <button
                                            onClick={() => setAddUser(false)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>

                                {!addUser ? (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Search participants..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
                                        />
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                                                        <th className="p-4 font-semibold text-gray-900 dark:text-white">ID</th>
                                                        <th className="p-4 font-semibold text-gray-900 dark:text-white">First Name</th>
                                                        <th className="p-4 font-semibold text-gray-900 dark:text-white">Last Name</th>
                                                        <th className="p-4 font-semibold text-gray-900 dark:text-white">Email</th>
                                                        <th className="p-4 font-semibold text-gray-900 dark:text-white">Role</th>
                                                        <th className="p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredParticipants.length > 0 ? (
                                                        filteredParticipants.map((participant) => (
                                                            <tr
                                                                key={participant.user_id}
                                                                className="border-t border-gray-100 dark:border-gray-700"
                                                            >
                                                                <td className="p-4 text-gray-700 dark:text-gray-300">
                                                                    {participant.user_id}
                                                                </td>
                                                                <td className="p-4 text-gray-700 dark:text-gray-300">
                                                                    {participant.first_name}
                                                                </td>
                                                                <td className="p-4 text-gray-700 dark:text-gray-300">
                                                                    {participant.last_name}
                                                                </td>
                                                                <td className="p-4 text-gray-700 dark:text-gray-300">
                                                                    {participant.email}
                                                                </td>
                                                                <td className="p-4 text-gray-700 dark:text-gray-300 capitalize">
                                                                    {participant.role}
                                                                </td>
                                                                <td className="p-4">
                                                                    <button
                                                                        onClick={() => handleRemoveParticipant(participant.user_id, courseId)}
                                                                        className="text-red-500 hover:text-red-600"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr className="col-span-5 text-center">
                                                            <td></td>
                                                            <td></td>
                                                            <td className=" text-gray-600 dark:text-gray-400 text-center text-lg">
                                                                No specific participant available.
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setShowAddStudent(true);
                                                    setShowAddTeacher(false);
                                                }}
                                                className={`px-4 py-2 rounded-lg transition-colors ${showAddStudent
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                Add Student
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowAddStudent(false);
                                                    setShowAddTeacher(true);
                                                }}
                                                className={`px-4 py-2 rounded-lg transition-colors ${showAddTeacher
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                Add Teacher
                                            </button>
                                        </div>
                                        {showAddStudent && <AddOneStudent courseId={courseId} />}
                                        {showAddTeacher && <AddOneTeacher courseId={courseId} />}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseDetails;