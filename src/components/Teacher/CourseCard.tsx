"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import SkeletonCourseCard from "../Skeleton/SkeletonCourseCard";

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
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ courseId: string | null, confirmText: string }>({
        courseId: null,
        confirmText: ''
    });
    const router = useRouter()

    const handleClick = (course_id: string) => {
        router.push(`/teacher/${userId}/mycourse/${course_id}`);
    };

    const handleEditCourse = (course_id: string) => {
        router.push(`/teacher/${userId}/mycourse/${course_id}/edit-course`)
    }

    const handleDeleteCourse = async () => {
        if (!deleteConfirmation.courseId) return;

        if (deleteConfirmation.confirmText.toLowerCase() !== 'confirm') {
            alert('Deletion cancelled. Please type "confirm" to delete.');
            return;
        }
        else {
            try {
                const res = await axios.delete(`/api/delete/delete-course/${deleteConfirmation.courseId}`);
                setDeleteConfirmation({ courseId: null, confirmText: '' });
                window.location.href = `/teacher/${userId}/dashboard`;

            } catch (error) {
                console.log(error)
                // Reset delete confirmation state even if there's an error
                setDeleteConfirmation({ courseId: null, confirmText: '' });
            }
        }



    }

    const initiateDeleteCourse = (course_id: string) => {
        setDeleteConfirmation({ courseId: course_id, confirmText: '' });
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
            {/* Deletion Confirmation Modal */}
            {deleteConfirmation.courseId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e2631] p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Confirm Course Deletion
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this course?
                            Type "confirm" below to proceed.
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmation.confirmText}
                            onChange={(e) => setDeleteConfirmation(prev => ({
                                ...prev,
                                confirmText: e.target.value
                            }))}
                            className="w-full px-3 py-2 border rounded-lg mb-4 dark:bg-[#151b23]"
                            placeholder="Type 'confirm' here"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirmation({ courseId: null, confirmText: '' })}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        className="sm:w-1/2 w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#151b23]"
                    />

                    <button
                        onClick={createCourse}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                        <span className="text-lg">+ </span>
                        Add New Course
                    </button>
                </div>

                {filteredCourses.length === 0 && searchTerm.length === 0 ? (
                    // <div className="text-center text-gray-500 dark:text-gray-400">
                    //     Courses Loading...
                    // </div>
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
                                    <img
                                        src={course.coursePicUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* <Image
                                        src={course.coursePicUrl}
                                        alt="Course image"
                                        className="rounded-lg mb-4 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                        width='200' // Specify the width
                                        height='200'// Specify the height
                                        priority // Optional: for images important for LCP
                                    /> */}
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
                                            onClick={() => initiateDeleteCourse(course.course_id)}
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