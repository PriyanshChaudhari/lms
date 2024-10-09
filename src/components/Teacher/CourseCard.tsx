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
    thumbnail: string
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
        <div className="flex flex-col p-5">
            <div className="flex flex-1 gap-10 flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
                <div className="w-full flex flex-col justify-center items-center  max-h-[calc(100vh-2rem)]">
                    <div className="flex flex-col h-screen p-5">
                        <div className="flex flex-1  flex-wrap md:flex-nowrap items-start justify-center">
                            <div className="w-full  p-5  rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
                                <div className="flex items-center gap-8 mb-10">
                                    <div className="text-2xl font-bold ">My Courses</div>
                                    <button className="bg-blue-500 hover:bg-blue-600 rounded text-xs p-2 text-white mt-2" onClick={createCourse}>Add New Course</button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-5 justify-items-center">


                                    {courses.map((course) => (
                                        <div key={course.course_id} className="border border-gray-300 dark:text-white  hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-xl p-5 w-full max-w-xs shadow-sm cursor-pointer">
                                            <img src={`${course.thumbnail}`} className="rounded mb-4"></img>
                                            <h3 className="text-lg font-semibold mb-2 underline" onClick={() => handleClick(course.course_id)}>{course.title}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                                            <div className="flex justify-between gap-6">
                                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-xs" onClick={() => handleEditCourse(course.course_id)}>Edit Course</button>
                                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-xs" onClick={() => handleDeleteCourse(course.course_id)}>Delete Course</button>
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
};

export default CourseCard;

