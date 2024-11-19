import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Edit, Trash2, Plus, FilePlus, ClipboardPlus, FilePen, FilePenLine } from 'lucide-react';
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
    const params = useParams();
    // const userId = params.userId as string;
    // const courseId = params.courseId as string;
    // const moduleId = params.moduleId as string;

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
        try {
            const res = await axios.delete(`/api/delete/delete-module/${moduleId}`);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
        router.push(`/teacher/${userId}/mycourse/${courseId}`);
    };

    const handleAddAssignment = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments/create-assignment`);
    };

    const sortedContent = courseContent.sort((a, b) => a.position - b.position);

    return (
        <div className="flex w-full dark:bg-transparent py-8 px-4 ">
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
                                {/* <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                        onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`)}
                                    >
                                        Assignments
                                    </button> */}


                                
                                <div data-tooltip-id="add-content-tooltip" data-tooltip-content="Add Content" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={addContent}>
                                    <Plus className="text-blue-600" />
                                </div>

                                <div data-tooltip-id="add-assignment-tooltip" data-tooltip-content="Add Assignment" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={handleAddAssignment}>
                                    <FilePenLine className="text-green-500" />
                                </div>

                                <div data-tooltip-id="edit-tooltip" data-tooltip-content="Edit Module" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={handleEditModule}>
                                    <Edit className="text-blue-500"/>
                                </div>
                                <div data-tooltip-id="delete-tooltip" data-tooltip-content="Delete Module" className='p-3 cursor-pointer  bg-white dark:bg-[#151b23] shadow-sm hover:shadow-md transition-shadow' onClick={handleDeleteModule}>
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
                        {/* <div className="max-w-md">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                                        onClick={addContent}
                                    >
                                        <span className="text-lg">+</span>
                                        Add Content
                                    </button>
                                </div> */}
                        <div className="grid gap-4 items-center mt-2">
                            {/* {sortedContent.map((content) => (
                                        <div key={content.id} className="space-y-4">
                                            <div className="bg-white border flex justify-between border-gray-300 rounded-lg-xl p-4 shadow-md min-h-6">
                                                <h2 className="text-xl font-semibold">{content.title}</h2>
                                                <h2 className="text-xl font-semibold">{content.description}</h2>
                                                <h2 className="text-xl font-semibold">{content.position}</h2>
                                                <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300 hover:bg-gray-200' onClick={() => handleContentClick(content.id)}>GO -&gt; </div>
                                            </div>
                                        </div>
                                    ))} */}

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
                                                {/* <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300 hover:bg-gray-200' onClick={() => handleDownloadClick(content.id)}>Download</div> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default TeacherModulesComponent;