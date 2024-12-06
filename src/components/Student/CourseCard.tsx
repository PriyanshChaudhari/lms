"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SkeletonCourseCard from "../Skeleton/SkeletonCourseCard";
import Image from "next/image";

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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter()

    const handleClick = (course_id: string) => {
        router.push(`/student/${userId}/mycourse/${course_id}`);
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (

        <div className="min-h-screen bg-gray-50 dark:bg-transparent p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-start items-center gap-8 mb-8">
                    <h1 className=" text-3xl font-bold text-gray-900 dark:text-white">
                        My Courses
                    </h1>


                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sm:w-1/2 w-full px-4 py-2 border border-gray-200 dark:border-gray-700  rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
                    />


                </div>

                {filteredCourses.length === 0 && searchTerm.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonCourseCard key={index} />
                        ))}
                    </div>
                ) : filteredCourses.length === 0 && searchTerm.length > 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        No courses found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <div
                                key={course.course_id}
                                className="bg-white dark:bg-[#151b23] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                            >
                                <div className="aspect-video relative overflow-hidden mb-2">
                                    {/* <img
                                        src={course.coursePicUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                    /> */}
                                    <Image
                                        src={course.coursePicUrl}
                                        alt="Course image"
                                        className="rounded-lg mb-4 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        width='400' // Specify the width
                                        height='400'// Specify the height
                                        priority // Optional: for images important for LCP
                                    />
                                </div>

                                <div className="">
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

                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;

