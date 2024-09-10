"use client"
import React from "react";
import { useRouter } from "next/navigation";

interface Course {
    course_id: string;
    title: string;
    description: string;
    teacher_id: string;
    category: string;
}

interface CourseCardProps {
    courses: Course[];  // An array of courses
    userId: string;     // A string for userId
}

const CourseCard: React.FC<CourseCardProps> = ({ courses, userId }) => {
    const router = useRouter()

    const handleClick = (course_id: string) => {
        router.push(`/student/${userId}/mycourse/${course_id}`);
    };

    return (
        <div className="flex flex-col h-screen p-5">
            <div className="flex flex-1  flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
                <div className="w-full  p-5  rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
                    <h1 className="text-2xl font-bold mb-6">My Courses</h1>
                    <div className="flex w-full flex-wrap justify-center gap-5">

                        {courses.map((course) => (
                            <div key={course.course_id} className="border border-gray-300 dark:text-white  hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-xl p-5 w-full max-w-xs shadow-sm cursor-pointer">
                                <h2 onClick={() => handleClick(course.course_id)} className="text-lg font-semibold hover:underline">{course.title}</h2>
                                <p className="text-sm text-gray-600">{course.description}</p>

                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;

