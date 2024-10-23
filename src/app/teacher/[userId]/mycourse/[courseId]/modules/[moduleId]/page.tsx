"use client"

import React, { useEffect, useId, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';

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

export default function ViewModule() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const courseId = params.courseId as string;
    const moduleId = params.moduleId as string;

    const [oneModule, setOneModule] = useState<modules | null>(null);
    const [courseContent, setCourseContent] = useState<content[]>([])
    const [course, setCourse] = useState<courses | null>(null)

    useEffect(() => {
        const getCourseDetails = async () => {
            try {
                const res = await axios.post('/api/get/course-details', { courseId })
                setCourse(res.data.courseDetails)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseDetails()

        const getOneModule = async () => {
            try {
                const res = await axios.post('/api/get/one-module', { moduleId })
                // console.log(res.data.module)
                setOneModule(res.data.module);
            } catch (error) {
                console.error("Error fetching course module: ", error);
            }
        };
        getOneModule()

        const getCourseContent = async () => {
            try {
                const res = await axios.post('/api/get/course-content', { moduleId })
                setCourseContent(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        getCourseContent()
    }, [moduleId, courseId]);

    const addContent = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/`);
    }

    const handleContentClick = (contentId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`);
    }

    const sortedContent = courseContent.sort((a, b) => a.position - b.position);

    const handleEditModule = () => {
        router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/edit-module`)
    }

    const handleDeleteModule = async () => {
        try {
            const res = await axios.delete(`/api/delete/delete-module/${moduleId}`);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
        router.push(`/teacher/${userId}/mycourse/${courseId}`)
    }


    return (
        // <div className="border border-gray-300 m-5 h-screen flex justify-center items-center">
        //     <div className="w-full max-w-4xl mx-auto">
        //         <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
        //         <p className="text-lg text-gray-700 mb-6">{course?.description}</p>
        //         <nav className="mb-6 p-2">
        //             <ul className="flex justify-start space-x-4 list-none p-0">
                        // <li className=" p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{course?.title}</li>
                        // <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">/</li>
                        // <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">{oneModule?.title}</li>
        //             </ul>
        //         </nav>

        //         <div className="space-y-4 my-2">
                    // <div className=" border border-gray-300 rounded-lg-xl p-6 shadow-md h-26">
                    //     <h2 className="text-xl font-semibold mb-4">{oneModule?.title}</h2>
                    //     <p className="text-sm text-gray-600 mb-4">{oneModule?.description}</p>

                    //     <div className='flex justify-start gap-10 max-w-lg'>
                    //         <button
                    //             className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    //             onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`)} // Replace with your add module logic
                    //         >
                    //             Assignments
                    //         </button>

                    //         <button
                    //             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    //             onClick={handleEditModule} // Replace with your add module logic
                    //         >
                    //             Edit Module
                    //         </button>
                    //         <button
                    //             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    //             onClick={handleDeleteModule} // Replace with your add module logic
                    //         >
                    //             Delete Module
                    //         </button>
                    //     </div>
                    // </div>

                    // <button
                    //     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    //     onClick={addContent} // Replace with your add module logic
                    // >
                    //     Add Content
                    // </button>

        //             <div>
        //                 {sortedContent.map((content) => (
        //                     <div key={content.id} className="space-y-4">
        //                         <div
        //                             className="bg-white border flex justify-between border-gray-300 rounded-lg-xl p-4 shadow-md min-h-6 ">
        //                             <h2 className="text-xl font-semibold">{content.position}</h2>
        //                             <h2 className="text-xl font-semibold">{content.title}</h2>
        //                             <h2 className="text-xl font-semibold">{content.description}</h2>
        //                             <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300  hover:bg-gray-200' onClick={() => handleContentClick(content.id)} > GO -> </div>
        //                         </div>

        //                     </div>
        //                 ))}
        //             </div>

        //         </div>

        //     </div>
        // </div >

<div className="min-h-screen bg-gray-50 dark:bg-transparent py-8 px-4">
<div className="max-w-7xl mx-auto">

    <div className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {course?.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{course?.description}</p>
    </div>


    <nav className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm mb-8">
        <ul className="flex p-2 gap-2">
        <li className=" p-3 rounded-lg-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}`)}>{course?.title}</li>
                        <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">/</li>
                        <li className=" p-3 rounded-lg-xl text-black dark:text-white cursor-pointer">{oneModule?.title}</li>
        </ul>
    </nav>

    <div className="space-y-6">


        <div>

            <div className="grid gap-4 ">
                <div
                    key={module.id}
                    className="bg-white dark:bg-[#151b23] rounded-lg-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                    
                        <h2 className="text-xl font-semibold mb-4">{oneModule?.title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{oneModule?.description}</p>

                        <div className='flex justify-start gap-10 max-w-lg'>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => router.push(`/teacher/${userId}/mycourse/${courseId}/modules/${moduleId}/assignments`)} // Replace with your add module logic
                            >
                                Assignments
                            </button>

                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={handleEditModule} // Replace with your add module logic
                            >
                                Edit Module
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={handleDeleteModule} // Replace with your add module logic
                            >
                                Delete Module
                            </button>
                        </div>
                    </div>
                    <div className="max-w-md">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={addContent} // Replace with your add module logic
                    >
                        Add Content
                    </button>
                    </div>

                <div>
                    <div className="flex items-center justify-between p-6">
                        {sortedContent.map((content) => (
                            <div key={content.id} className="space-y-4">
                                <div
                                    className="bg-white border flex justify-between border-gray-300 rounded-lg-xl p-4 shadow-md min-h-6 ">
                                    <h2 className="text-xl font-semibold">{content.title}</h2>
                                    <h2 className="text-xl font-semibold">{content.description}</h2>
                                    <h2 className="text-xl font-semibold">{content.position}</h2>
                                    <div className='px-3 rounded-lg-xl cursor-pointer bg-gray-300  hover:bg-gray-200' onClick={() => handleContentClick(content.id)} > GO -> </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
</div>
    );
}
