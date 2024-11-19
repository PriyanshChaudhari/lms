"use client"
import React, { useState } from "react";
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
    courses: Course[];
    userId: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ courses, userId }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter()

    const handleClick = (course_id: string) => {
        router.push(`/teacher/${userId}/mycourse/${course_id}`);
    };

    const handleEditCourse = (course_id: string) => {
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

    // Filter courses based on search term
    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-transparent p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Courses
                    </h1>

                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sm:w-1/2 w-full px-4 py-2 border border-gray-200 dark:border-gray-700  rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
                    />
                    
                    <button
                        onClick={createCourse}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                        <span className="text-lg">+ </span>
                        Add New Course
                    </button>
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        No courses found matching your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <div
                                key={course.course_id}
                                className="bg-white dark:bg-[#151b23] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                            >
                                <div className="aspect-video relative overflow-hidden mb-2">
                                    <img
                                        src={course.coursePicUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
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
                )}
            </div>
        </div>
    );
};

export default CourseCard;