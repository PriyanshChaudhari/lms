"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios';
import GradesTable from './GradesComponent';
import StudentGrades from './GradesComponent';

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
    const [addUser, setAddUser] = useState(false);

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
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}`);
    }

    const handleAssignmentClick = (assignmentId: string, moduleId: string) => {
        router.push(`/student/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/${assignmentId}`);
    };

    return (

        // <div className="border border-gray-300 m-5">
        //     <div className="max-w-4xl mx-auto p-5">
        //         <h1 className="text-3xl font-bold mb-4">{courses?.title}</h1>
        //         <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{courses?.description}</p>

        //         <nav className="mb-6 border border-gray-300 rounded-lg-xl shadow-md p-2">
        //             <ul className="flex justify-start space-x-4 list-none p-0">
        //                 <li
        //                     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'course' ? 'bg-gray-400 text-white' : ''}`}
        //                     onClick={() => setActiveSection('course')}
        //                 >
        //                     Course
        //                 </li>

        //                 <li
        //                     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'assignments' ? 'bg-gray-400 text-white' : ''}`}
        //                     onClick={() => setActiveSection('assignments')}
        //                 >
        //                     Assignments
        //                     {assignments.length > 0 && (
        //                         <span className="ml-2 bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg-full">
        //                             {assignments.length}
        //                         </span>
        //                     )}
        //                 </li>

        //                 {/* <li
        //                     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'grades' ? 'bg-gray-400 text-white' : ''}`}
        //                     onClick={() => setActiveSection('grades')}
        //                 >
        //                     Grades
        //                 </li> */}

        //                 <li
        //                     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'participants' ? 'bg-gray-400 text-white' : ''}`}
        //                     onClick={() => setActiveSection('participants')}
        //                 >
        //                     Participants
        //                     {participantData.length > 0 && (
        //                         <span className="ml-2 bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg-full">
        //                             {participantData.length}
        //                         </span>
        //                     )}

        //                 </li>


        //                 {/* <li
        //                     className={` p-3 rounded-lg-xl cursor-pointer ${activeSection === 'settings' ? 'bg-gray-400 text-white' : ''}`}
        //                     onClick={() => setActiveSection('settings')}
        //                 >
        //                     Settings
        //                 </li> */}
        //             </ul>
        //         </nav>

        //         <div className="space-y-4">

        //             {/*all modules of courses */}
        //             {activeSection === 'course' && (
        //                 <div className="space-y-4">
        //                     {/* Modules List */}
        //                     {sortedModules.map((module) => (
        //                         <div key={module.id} className="space-y-4">
        //                             <div className="bg-white border flex justify-between border-gray-300  rounded-lg-xl p-4 shadow-md min-h-6">
        //                                 <h2 className="text-xl font-semibold">{module.title}</h2>
        //                                 <h2 className="text-xl font-semibold">{module.description}</h2>
        //                                 <h2 className="text-xl font-semibold">{module.position}</h2>
        //                                 <div
        //                                     className="px-3 rounded-lg-xl cursor-pointer bg-gray-300 hover:bg-gray-200"
        //                                     onClick={() => handleModuleClick(module.id)}
        //                                 >
        //                                 GO ->
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     ))}
        //                 </div>
        //             )}

        //             {/* assignment of all modules */}
        //             {activeSection === 'assignments' && (
        //                 <div className="space-y-4">
        //                     {assignments.map((assignment) => (
        //                         <div key={assignment.id} className="bg-white border border-gray-300 rounded-lg-xl p-6 shadow-md h-64 cursor-pointer" onClick={() => handleAssignmentClick(assignment.id,assignment.module_id)}>
        //                             <h2 className="text-xl font-semibold mb-6">{assignment.title}</h2>
        //                             <div className="shadow-md items-center p-5 border border-gray-100 rounded-lg-xl max-w-lg">
        //                                 <p className="text-sm text-gray-600 mb-4">Description : {assignment.description}</p>
        //                                 <p className="text-sm text-gray-600 mb-4">Total Marks : {assignment.total_marks}</p>

        //                                 <p className="text-sm text-gray-600 mb-4">Due Date : {formatDate(assignment.due_date)}</p>
        //                             </div>
        //                         </div>
        //                     ))}
        //                 </div>
        //             )}


        //             {activeSection === 'grades' && (
        //                 <div className="overflow-x-auto">
        //                     <table className="min-w-full bg-white border border-gray-300">
        //                         <thead>
        //                             <tr>
        //                                 <th className="py-2 px-4 border-b">Grade</th>
        //                                 <th className="py-2 px-4 border-b">Range</th>
        //                                 <th className="py-2 px-4 border-b">Email</th>
        //                             </tr>
        //                         </thead>
        //                         <tbody>
        //                             {data.map((item, index) => (
        //                                 <tr key={index}>
        //                                     <td className="py-2 px-4 border-b">{item.grade}</td>
        //                                     <td className="py-2 px-4 border-b">{item.range}</td>
        //                                     <td className="py-2 px-4 border-b">{item.email}</td>
        //                                 </tr>
        //                             ))}
        //                         </tbody>
        //                     </table>
        //                 </div>
        //             )}

        //             {/* completed */}
        //             {activeSection === 'participants' && (
        //                 <div className="space-y-4">
        //                     <div className="border border-gray-300 dark:text-white rounded-lg-xl p-6 shadow-md cursor-pointer">
        //                         {/* <h2 className="text-xl font-semibold mb-6">Course Participants</h2>  */}
        //                         <h1 className="text-xl font-bold mb-b">Participants</h1>
        //                         <div className="shadow-md items-center p-5 border border-gray-100 rounded-lg-xl">
        //                             <div className="overflow-x-auto mb-4">
        //                                 <input
        //                                     type="text"
        //                                     placeholder="Search participants by name"
        //                                     value={searchTerm}
        //                                     onChange={(e) => setSearchTerm(e.target.value)}
        //                                     className="mb-4 p-2 border border-gray-300 dark:bg-[#212830] rounded-lg w-full"
        //                                 />
        //                             </div>
        //                             <div className="overflow-x-auto">
        //                                 {filteredParticipants.length === 0 ? (
        //                                     <p>No participants found.</p>
        //                                 ) : (
        //                                     <table className="min-w-full table-auto border-collapse border border-gray-300">
        //                                         <thead>
        //                                             <tr className="bg-gray-200 dark:bg-[#151b23] text-gray-600 uppercase text-sm leading-normal">
        //                                                 <th className="py-3 px-6 text-center">Student ID</th>
        //                                                 <th className="py-3 px-6 text-center">First Name</th>
        //                                                 <th className="py-3 px-6 text-center">Last Name</th>
        //                                                 <th className="py-3 px-6 text-center">Email</th>
        //                                                 <th className="py-3 px-6 text-center">Role</th>
        //                                             </tr>
        //                                         </thead>
        //                                         <tbody className="text-gray-600 dark:text-gray-100 text-sm font-normal">
        //                                             {filteredParticipants.map((participant) => (
        //                                                 <tr key={participant.user_id} className="border-b border-gray-200 ">
        //                                                     <td className="py-3 px-6 text-center whitespace-nowrap">{participant.user_id}</td>
        //                                                     <td className="py-3 px-6 text-center">{participant.first_name}</td>
        //                                                     <td className="py-3 px-6 text-center">{participant.last_name}</td>
        //                                                     <td className="py-3 px-6 text-center">{participant.email}</td>
        //                                                     <td className="py-3 px-6 text-center">{participant.role}</td>
        //                                                 </tr>
        //                                             ))}
        //                                         </tbody>
        //                                     </table>
        //                                 )}
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             )}

        //         </div>
        //     </div>
        // </div >

        <div className="min-h-screen bg-gray-50 dark:bg-transparent py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
                <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {courses?.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">{courses?.description}</p>
                </div>

                
                <nav className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm mb-8">
                    <ul className="flex p-2 gap-2">
                        {['course', 'assignments', 'grades', 'participants'].map((section) => (
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
                                    {(section === 'assignments' && assignments.length > 0) && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-lg-full">
                                            {assignments.length}
                                        </span>
                                    )}
                                    {(section === 'participants' && participantData.length > 0) && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-lg-full">
                                            {participantData.length}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="space-y-6">
                    
                    {activeSection === 'course' && (
                        <div>
                            <div className="flex justify-end mb-6">

                            </div>
                            <div className="grid gap-4">
                                {sortedModules.map((module) => (
                                    <div
                                        key={module.id}
                                        className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between p-6">
                                            <span className="flex items-center gap-6">
                                                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                                    {module.position}
                                                </span>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                        {module.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        {module.description}
                                                    </p>
                                                </div>
                                            </span>
                                            <button
                                                onClick={() => handleModuleClick(module.id)}
                                                className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg-lg transition-colors"
                                            >
                                                View Module →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    
                    {activeSection === 'assignments' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {assignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    onClick={() => handleAssignmentClick(assignment.id, assignment.module_id)}
                                    className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        {assignment.title}
                                    </h3>
                                    <div className="space-y-4">
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {assignment.description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg-lg">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Total Marks
                                                </p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {assignment.total_marks}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg-lg">
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
                            ))}
                        </div>
                    )}

                    
                    {activeSection === 'grades' && (
                    <StudentGrades courseId={courseId} studentId={userId} />
                )}

                    
                    {activeSection === 'participants' && (
                        <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Participants
                                    </h2>

                                </div>


                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search participants..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full mb-6 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
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

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredParticipants.map((participant) => (
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

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;
