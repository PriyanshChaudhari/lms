"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const EditCourse: React.FC = () => {

    const router = useRouter();

    return (
        <div className="border border-gray-300 m-5 py-12">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Assignments</h1>
                <p className="text-lg text-gray-700 mb-6">Description of course 1</p>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer"   onClick={() => router.push(`/student/viewassignment`)}>
                        <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                        <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                            <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                            <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                            <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-72 cursor-pointer"   onClick={() => router.push(`/student/viewassignment`)}>
                        <h2 className="text-xl font-semibold mb-6">Assignment Title</h2>
                        <div className="shadow-md  items-center p-5 border border-gray-100 rounded-xl max-w-lg">
                            <p className="text-sm text-gray-600 mb-4">Courses: Course 1</p>
                            <p className="text-sm text-gray-600 mb-4">Description: Assignment Description</p>
                            <p className="text-sm text-gray-600 mb-4">Deadline: 25/08/2024</p>
                        </div>
                    </div>


                </div>
            </div>
            
        </div>

    );
};

export default EditCourse;
