// pages/student/dashboard/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";

// interface courses {
//     course_id: string;
//     title: string;
//     description: string;
//     teacher_id: string;
//     category: string;
// }

const MyCourse: React.FC = () => {
    // const [courses, setCourses] = useState<courses[]>([]);
    // const params = useParams();
    // const userId = params.userId;
    // const router = useRouter()

    // useEffect(() => {
    //     const getTeacherCourses = async () => {
    //         try {
    //             const res = await axios.post("/api/get/allocated-courses", { userId });
    //             setCourses(res.data.courses);
    //             console.log(res.data.courses)
    //         }
    //         catch (error) {
    //             console.error("Error fetching courses:", error);
    //         }
    //     };

    //     if (userId) {
    //         getTeacherCourses();
    //     }
    // }, [userId]);

    // const handleClick = (courseId: string) => {
    //     router.push(`/teacher/${userId}/mycourse/${courseId}`);
    // };

    // const handleEditCourse = (courseId: string) => {
    //     router.push(`/teacher/${userId}/mycourse/${courseId}/edit-course`)
    // }

    // const handleDeleteCourse = async (courseId: string) => {
    //     try {
    //         const res = await axios.delete(`/api/delete/delete-course/${courseId}`);
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error)
    //     }
    //     router.push(`/teacher/${userId}/mycourse`)
    // }

    // const createCourse = () => {
    //     router.push(`/teacher/${userId}/mycourse/create-courses`)
    // }

    return (
        <div className="flex flex-col lg:h-screen h-full p-5">

            {/* <div className="flex flex-1 gap-10 flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
                <div className="w-full md:w-2/3 p-5 border border-gray-300 rounded-lg-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
                    Dashboard
                    <div className="flex flex-col h-screen p-5">
                        <div className="flex flex-1  flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
                            <div className="w-full  p-5  rounded-lg-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
                                <h1 className="text-2xl font-bold mb-6">My Courses</h1>
                                <div className="flex w-full flex-wrap justify-center gap-5">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg-xl hover:bg-blue-600" onClick={createCourse}>ADD</button>

                                    {courses?.map((course) => (
                                        <div key={course.course_id} className="border border-gray-300 dark:text-white  hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-lg-xl p-5 w-full max-w-xs shadow-sm cursor-pointer" onClick={() => handleClick(course.course_id)}>
                                            <h3 className="text-lg font-semibold">{course.title}</h3>
                                            <p className="text-sm text-gray-600">{course.description}</p>
                                            <div className="bg-gray-200 rounded-lg-full h-2 my-3">
                                                <div className="bg-blue-500 h-full rounded-lg-full" style={{ width: '50%' }}></div>
                                            </div>

                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg-xl hover:bg-blue-600" onClick={() => handleEditCourse(course.course_id)}>Edit Course</button>
                                            <br />
                                            <br />
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg-xl hover:bg-blue-600" onClick={() => handleDeleteCourse(course.course_id)}>Delete Course</button>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default MyCourse;
