"use client"
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Course {
    course_id: string;
    title: string;
    description: string;
    teacher_id: string;
    category: string;
    coursePicUrl: string;
}

interface CourseCardProps {
    courses: Course[];  // An array of courses
    userId: string;     // A string for userId
}

const CourseCard: React.FC<CourseCardProps> = ({ courses, userId }) => {
    const router = useRouter()

    const handleClick = (course_id: string) => {
        router.push(`/teacher/${userId}/mycourse/${course_id}`);
    };

    const handleEditCourse = (course_id: string) => {
        // console.log(`/teacher/${userId}/mycourse/${courseId}/edit-course`)
        router.push(`/teacher/${userId}/mycourse/${course_id}/edit-course`)
    }

    const handleDeleteCourse = async (course_id: string) => {
        try {
            const res = await axios.delete(`/api/delete/delete-course/${course_id}`);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
        router.push(`/teacher/${userId}/mycourse`)
    }

    const createCourse = () => {
        router.push(`/teacher/${userId}/mycourse/create-courses`)
    }

    return (
        // <div className="flex flex-col p-5">
        //     <div className="flex flex-1 gap-10 flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
        //         <div className="w-full flex flex-col justify-center items-center  max-h-[calc(100vh-2rem)]">
        //             <div className="flex flex-col h-screen p-5">
        //                 <div className="flex flex-1  flex-wrap md:flex-nowrap items-start justify-center">
        //                     <div className="w-full  p-5  rounded-lg-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
        //                         <div className="flex items-center gap-8 mb-10">
        //                             <div className="text-2xl font-bold ">My Courses</div>
        //                             <button className="bg-blue-500 hover:bg-blue-600 rounded-lg text-xs p-2 text-white mt-2" onClick={createCourse}>Add New Course</button>
        //                         </div>

        //                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-5 justify-items-center">


        //                             {courses.map((course) => (
        //                                 <div key={course.course_id} className="border border-gray-300 dark:text-white  hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-lg-xl p-5 w-full max-w-xs shadow-sm cursor-pointer">
        //                                     <img src={`${course.coursePicUrl}`} alt="img" className="rounded-lg mb-4"></img>
        //                                     <h3 className="text-lg font-semibold mb-2 underline" onClick={() => handleClick(course.course_id)}>{course.title}</h3>
        //                                     <p className="text-sm text-gray-600 mb-4">{course.description}</p>

        //                                     <div className="flex justify-between gap-6">
        //                                         <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-xs" onClick={() => handleEditCourse(course.course_id)}>Edit Course</button>
        //                                         <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-xs" onClick={() => handleDeleteCourse(course.course_id)}>Delete Course</button>
        //                                     </div>
        //                                 </div>
        //                             ))}

        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className="min-h-screen bg-gray-50 dark:bg-transparent p-8">
            <div className="max-w-7xl mx-auto">
                
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Courses
                    </h1>
                    <button
                        onClick={createCourse}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                        <span className="text-lg">+</span>
                        Add New Course
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.course_id}
                            className="bg-white dark:bg-[#151b23] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="aspect-video relative overflow-hidden p-6">
                                <img
                                    src={course.coursePicUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-6">
                                <h2
                                    className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate"
                                    onClick={() => handleClick(course.course_id)}
                                >
                                    {course.title}
                                </h2>

                                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 text-sm">
                                    {course.description}
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 text-sm"
                                        onClick={() => handleClick(course.course_id)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200 text-sm"
                                        onClick={() => handleEditCourse(course.course_id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors duration-200 text-sm"
                                        onClick={() => handleDeleteCourse(course.course_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default CourseCard;

