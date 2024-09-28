"use client"
import React from "react";
import { useRouter } from "next/navigation";

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
        router.push(`/student/${userId}/mycourse/${course_id}`);
    };

    return (
        // <div className="flex flex-col h-screen p-5">
        //     <div className="w-full flex flex-1  flex-wrap md:flex-nowrap items-start justify-center">
        //         <div className="w-full  p-5  rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
        //             <div className="flex-col gap-8 mb-10">
        //                 <div className="text-2xl font-bold ">My Courses</div>
        //             </div>
        //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-5 justify-items-center">

        //                 {courses.map((course) => (
        //                     <div key={course.course_id} className="border border-gray-300 dark:text-white  hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded p-5 w-full max-w-xs shadow-sm cursor-pointer">
        //                         <img src={`${course.thumbnail}`} className="rounded mb-4"></img>
        //                         <h2 onClick={() => handleClick(course.course_id)} className="text-lg font-semibold hover:underline">{course.title}</h2>
        //                         <p className="text-sm text-gray-600">{course.description}</p>

        //                     </div>
        //                 ))}

        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className="flex flex-col h-screen p-5">
            <div className="flex flex-1  flex-wrap md:flex-nowrap items-start justify-center">
                <div className="w-full  p-5  rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
                    <div className="flex-col gap-8 mb-10">
                        <div className="text-2xl font-bold ">My Courses</div>
                        
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-5 justify-items-center">


                        {courses.map((course) => (
                            <div key={course.course_id} className="border border-gray-300 dark:text-white  hover:bg-slate-100 dark:hover:bg-[#1a1a1a] rounded-xl p-5 w-full max-w-xs shadow-sm cursor-pointer">
                                <img src={`${course.thumbnail}`} className="rounded mb-4"></img>
                                <h3 className="text-lg font-semibold mb-2 underline" onClick={() => handleClick(course.course_id)}>{course.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;

