"use client"
import React from "react";
import { useRouter } from "next/navigation";

const CourseCard = ({ courses, userId }) => {
    const router = useRouter()
    // const handleClick = (course_id) => {
    //     router.push(`/teacher/${userId}/mycourse/${course_id}`);
    // };

    const editCourse = (course_id) => {
        router.push(`/teacher/${userId}/mycourse/${course_id}`);
    }
    const createCourse = () => {
        router.push(`/teacher/${userId}/mycourse`)
    }
    return (
        <div className="flex flex-col h-screen p-5">
            <div className="flex flex-1  flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
                <div className="w-full  p-5  rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
                    <div className="flex justify-center gap-6 mb-6">
                        <h1 className="text-2xl font-bold ">My Courses</h1>
                        <button className="bg-blue-500 hover:bg-blue-600 rounded text-sm p-2 text-white" onClick={createCourse}>Add</button>
                    </div>
                    <div className="flex w-full flex-wrap justify-center gap-5">
                        {courses.map((course) => (
                            <div key={course.course_id} className="border border-gray-300 dark:text-white dark:hover:bg-[#1a1a1a] rounded-xl p-5 w-full max-w-xs shadow-sm cursor-pointer">
                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                <p className="text-sm text-gray-600">{course.description}</p>
                                <div className="bg-gray-200 rounded-full h-2 my-3">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
                                </div>

                                <button className="bg-blue-500 hover:bg-blue-600 rounded text-sm p-2 text-white" onClick={() => editCourse(course.id)}>EDIT</button>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;

