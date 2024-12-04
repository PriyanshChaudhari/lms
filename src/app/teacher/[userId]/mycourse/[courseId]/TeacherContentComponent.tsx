import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Edit, Trash2, Eye, Download } from 'lucide-react';
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
}

interface content {
    id: string;
    title: string;
    description: string;
    content_type: string
}

interface module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    created_at: Date
}

interface TeacherContentsComponentProps {
    moduleId: string;
    contentId: string;
    content: content;
    courseId: string;
    userId: string;
}

const TeacherContentComponent = ({ contentId, content, moduleId, courseId, userId }: TeacherContentsComponentProps) => {
    const router = useRouter();
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ confirmText: string }>({
        confirmText: ''
    });

    const [courseContent, setCourseContent] = useState<content[]>([]);
    const [showdeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

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

    const handleDownloadContent = () => {
        // Add your download content logic here
        console.log("Download content");
    };

    const handleViewContent = () => {
        // Add your download content logic here
        console.log("View content");
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);

    };

    const handleEditContent = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}/edit-content`);
    };

    const handleDeleteContent = async () => {
        if (deleteConfirmation.confirmText.toLowerCase() !== 'confirm') {
            alert('Deletion cancelled. Please type "confirm" to delete.');
            return;
        }

        try {
            const res = await axios.delete(`/api/delete/delete-content/${contentId}`, { data: { courseId, moduleId } });
            console.log(res.data);
            setShowDeleteConfirmation(false);
            // router.push(`/teacher/${userId}/mycourse/${courseId}`);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="flex w-full dark:bg-transparent  ">
            {/* Deletion Confirmation Modal */}
            {showdeleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Confirm Content Deletion
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this content?
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

                                onClick={handleDeleteContent}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full  max-w-7xl mx-auto ">
                <div className="flex flex-col gap-6">
                    <div key={content.id} className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                <span className="text-xl font-semibold">{"C"}</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {content.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {content.description}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <div
                                data-tooltip-id="view-content-tooltip"
                                data-tooltip-content="View Content"
                                className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                                onClick={handleViewContent}
                            >
                                <Eye className="text-blue-600" />
                            </div>

                            <div
                                data-tooltip-id="download-content-tooltip"
                                data-tooltip-content="Download Content"
                                className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                                onClick={handleDownloadContent}
                            >
                                <Download className="text-green-500" />
                            </div>

                            <div
                                data-tooltip-id="edit-tooltip"
                                data-tooltip-content="Edit Content"
                                className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                                onClick={handleEditContent}
                            >
                                <Edit className="text-blue-500" />
                            </div>

                            <div
                                data-tooltip-id="delete-tooltip"
                                data-tooltip-content="Delete Content"
                                className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                                onClick={() => setShowDeleteConfirmation(true)}
                            >
                                <Trash2 className="text-red-500" />
                            </div>
                            <Tooltip id="edit-tooltip" place="top" />
                            <Tooltip id="delete-tooltip" place="top" />
                            <Tooltip id="download-content-tooltip" place="top" />
                            <Tooltip id="view-content-tooltip" place="top" />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default TeacherContentComponent;