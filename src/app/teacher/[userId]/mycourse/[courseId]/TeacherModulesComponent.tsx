import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Edit, Trash2, Plus, FilePenLine } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import TeacherContentComponent from './TeacherContentComponent';

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
}

interface content {
    id: string;
    title: string;
    description: string;
    content_type: string;
    attachments: string[];
    created_at: Date;
}

interface module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    created_at: Date;
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

    const [courseContent, setCourseContent] = useState<content[]>([]);
    const [showdeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const [showAllContent, setShowAllContent] = useState(false);

    // Toggle visibility for all content
    const toggleAllContentVisibility = () => {
        setShowAllContent((prev) => !prev); // Toggle global visibility
    };

    useEffect(() => {
        const getCourseContent = async () => {
            try {
                const res = await axios.post('/api/get/course-content', { moduleId });
                setCourseContent(res.data.content);
            } catch (error) {
                console.log(error);
            }
        };
        getCourseContent();


    }, [moduleId]);

    const addContent = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/create-content`);
    };

    // const handleViewClick = (contentId: string) => {
    //     router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);
    // };

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
            window.location.href = `/teacher/${userId}/mycourse/${courseId}`;
            // router.push(`/teacher/${userId}/mycourse/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddAssignment = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/create-assignment`);
    };

    const sortedContent = courseContent.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateA - dateB; // Ascending order (earliest to latest)
    });

    return (
        <div className="flex w-full dark:bg-transparent py-8 px-4 ">
            {/* Deletion Confirmation Modal */}
            {showdeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Confirm Module Deletion
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this module?
                            Type &quot;confirm&quot; below to proceed.
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
                                    <Edit className="text-blue-500" />
                                </div>
                                <div data-tooltip-id="delete-tooltip" data-tooltip-content="Delete Module" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={() => setShowDeleteConfirmation(true)}>
                                    <Trash2 className="text-red-500" />
                                </div>
                                <Tooltip id="edit-tooltip" place="top" />
                                <Tooltip id="delete-tooltip" place="top" />
                                <Tooltip id="add-assignment-tooltip" place="top" />
                                <Tooltip id="add-content-tooltip" place="top" />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        <div className="grid gap-4 items-center mt-2">
                            <div className="flex justify-end">
                                <button
                                    onClick={toggleAllContentVisibility}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    {showAllContent ? "Hide All Content" : "Show All Content"}
                                </button>
                            </div>
                            <table className="min-w-full bg-white dark:bg-gray-700">
                                <tbody>
                                    {showAllContent &&
                                        sortedContent.map((content) => (
                                            <tr key={content.id}>
                                                <td colSpan={4} className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                                                    <div className="flex flex-col items-center justify-between p-6">
                                                        <TeacherContentComponent
                                                            contentId={content.id}
                                                            content={content}
                                                            moduleId={moduleId}
                                                            courseId={courseId}
                                                            userId={userId}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    {!showAllContent && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center">
                                            Click &quot;Show All Content&quot; to display the module contents.
                                        </p>
                                    )}
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