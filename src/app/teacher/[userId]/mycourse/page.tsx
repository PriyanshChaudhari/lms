// pages/student/dashboard/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CourseCard from "@/components/Teacher/CourseCard";

interface courses {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    teacher_id: string;
    category: string;
}

const MyCourse: React.FC = () => {
    const [courses, setCourses] = useState<courses[]>([]);
    const params = useParams();
    const userId = params.userId;
    const router = useRouter()

    useEffect(() => {
        const getTeacherCourses = async () => {
            try {
                const res = await axios.get(`/api/teacher/${userId}/dashboard`);
                if (res.data.success) {
                    setCourses(res.data.data);
                } else {
                    console.error("No courses found");
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        if (userId) {
            getTeacherCourses();
        }
    }, [userId]);

    const handleClick = (courseId: string) => {
        router.push(`/teacher/${userId}/mycourse/${courseId}`);
    };

    const handleEditCourse = (courseId: string) => {
        // console.log(`/teacher/${userId}/mycourse/${courseId}/edit-course`)
        router.push(`/teacher/${userId}/mycourse/${courseId}/edit-course`)
    }

    const handleDeleteCourse = async (courseId: string) => {
        try {
            const res = await axios.delete(`/api/delete/delete-course/${courseId}`);
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
                                <div className="flex-col gap-8 mb-10">
                                    <div className="text-2xl font-bold ">My Courses</div>
                                    <button className="bg-blue-500 hover:bg-blue-600 rounded text-xs p-2 text-white mt-2" onClick={createCourse}>Add New Course</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-5 justify-items-center">


                                    {courses.map((course) => (
                                        <div key={course.id} className="border border-gray-300 dark:text-white  hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded p-6 w-full max-w-xs shadow-sm cursor-pointer">
                                            <img src={`${course.thumbnail}`} className="rounded mb-4"></img>
                                            <h3 className="text-lg font-semibold mb-2 underline" onClick={() => handleClick(course.id)}>{course.title}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                                            <div className="flex justify-between gap-6">
                                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-xs" onClick={() => handleEditCourse(course.id)}>Edit Course</button>
                                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-xs" onClick={() => handleDeleteCourse(course.id)}>Delete Course</button>
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

export default MyCourse;
