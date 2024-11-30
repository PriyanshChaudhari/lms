import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Edit, Trash2, Plus, FilePenLine } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

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

interface content {
    id: string;
    title: string;
    description: string;
    position: number;
}

interface module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    created_at: Date
}

interface TeacherModulesComponentProps {
    moduleId: string;
    module: module;
    courseId: string;
    userId: string;
}

const TeacherModulesComponent = ({ moduleId, module, courseId, userId }: TeacherModulesComponentProps) => {
    const router = useRouter();
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ confirmText: string }>({
        confirmText: ''
    });

    const [ showdeleteConfirmation ,setShowDeleteConfirmation ] = useState<boolean>(false);

    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [courseContent, setCourseContent] = useState<content[]>([]);
    const [course, setCourse] = useState<courses | null>(null);

    useEffect(() => {
        const getCourseDetails = async () => {
            try {
                const res = await axios.post('/api/get/course-details', { courseId });
                setCourse(res.data.courseDetails);
            } catch (error) {
                console.log(error);
            }
        };
        getCourseDetails();

        const getOneModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId });
                setOneModule(res.data.module);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule();

        const getCourseContent = async () => {
            try {
                const res = await axios.post('/api/get/course-content', { moduleId });
                setCourseContent(res.data.content);
            } catch (error) {
                console.log(error);
            }
        };
        getCourseContent();
    }, [moduleId, courseId]);

    const addContent = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/create-content`);
    };

    const handleViewClick = (contentId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);
    };

    const handleEditModule = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/edit-module`);
    };

    const handleDeleteModule = async () => {
        if (deleteConfirmation.confirmText.toLowerCase() !== 'confirm') {
            alert('Deletion cancelled. Please type "confirm" to delete.');
            return;
        }

        try {
            const res = await axios.delete(`/api/delete/delete-module/${moduleId}`);
            console.log(res.data);
            setShowDeleteConfirmation(false);
            // router.push(`/teacher/${userId}/mycourse/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddAssignment = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/create-assignment`);
    };

    const sortedContent = courseContent.sort((a, b) => a.position - b.position);

    return (
        <div className="flex w-full dark:bg-transparent py-8 px-4 ">
            {/* Deletion Confirmation Modal */}
            { showdeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Confirm Module Deletion
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this module? 
                            Type "confirm" below to proceed.
                        </p>
                        <input 
                            type="text"
                            value={deleteConfirmation.confirmText}
                            onChange={(e) => setDeleteConfirmation({ 
                                confirmText: e.target.value 
                            })}
                            className="w-full px-3 py-2 border rounded-lg mb-4 dark:bg-[#151b23]"
                            placeholder="Type 'confirm' here"
                        />
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button 
                                  
                                onClick={handleDeleteModule}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex-auto max-w-7xl mx-auto">
                <div className="flex flex-col gap-4 space-y-6 ">
                    <div className='flex justify-between items-center'>
                        <span className="flex items-center gap-6 w-full">
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
                        </span>

                        {/* action buttons */}
                        <div className="">
                            <div className='flex justify-start gap-10 max-w-lg'>
                                <div data-tooltip-id="add-content-tooltip" data-tooltip-content="Add Content" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={addContent}>
                                    <Plus className="text-blue-600" />
                                </div>

                                <div data-tooltip-id="add-assignment-tooltip" data-tooltip-content="Add Assignment" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={handleAddAssignment}>
                                    <FilePenLine className="text-green-500" />
                                </div>

                                <div data-tooltip-id="edit-tooltip" data-tooltip-content="Edit Module" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={handleEditModule}>
                                    <Edit className="text-blue-500"/>
                                </div>
                                <div data-tooltip-id="delete-tooltip" data-tooltip-content="Delete Module" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={() =>  setShowDeleteConfirmation(true)}>
                                    <Trash2 className="text-red-500"/>
                                </div>
                                <Tooltip id="edit-tooltip" place="top" />
                                <Tooltip id="delete-tooltip" place="top" />
                                <Tooltip id="add-assignment-tooltip" place="top" />
                                <Tooltip id="add-content-tooltip" place="top" />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        <h2 className="text-xl font-bold my-2">Contents:</h2>
                        <div className="grid gap-4 items-center mt-2">
                            <table className="min-w-full bg-white dark:bg-gray-700">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">Title</th>
                                        <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">Description</th>
                                        <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedContent.map((content) => (
                                        <tr key={content.id}>
                                            <td className="py-2 px-4 text-center border-b border-gray-200 dark:border-gray-600">{content.title}</td>
                                            <td className="py-2 px-4 text-center border-b border-gray-200 dark:border-gray-600">{content.description}</td>
                                            <td className="py-2 px-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-600 space-x-2">
                                                <div className='bg-zinc-400 dark:bg-zinc-300 p-3 text-clip bg-opacity-20 text-sm text-gray-500 dark:text-gray-500  px-2 py-1 rounded-lg cursor-pointer' onClick={() => handleViewClick(content.id)}>View</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherModulesComponent;