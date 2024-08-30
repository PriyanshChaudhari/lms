"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

const ViewAssignments: React.FC = () => {
    const router = useRouter();


    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Assignment 1</h1>
                <p className="text-lg text-gray-700 dark:text-gray-500 mb-6">Description of course 1</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className=" p-3 rounded-xl text-gray-500 dark:text-gray-500 cursor-pointer" onClick={() => router.push(`/student/viewsection`)}>Course 1</li>
                        <li className=" p-3 rounded-xl text-black dark:text-gray-300 cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-gray-500 dark:text-gray-500 cursor-pointer" onClick={() => router.push(`/student/viewmodule`)}>Module 1</li>
                        <li className=" p-3 rounded-xl text-black dark:text-gray-300 cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-black dark:text-gray-300 cursor-pointer">Assignment 1</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="dark:text-white   border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Assignment Description</h2>
                        <p className="text-sm text-gray-600">Opened: 30 OCT</p>
                        <p className="text-sm text-gray-600">Due date: 30 OCT</p>
                    </div>
                    <div>
                        <button className="bg-black dark:bg-gray-400 dark:hover:bg-gray-500 hover:bg-[#1a1a1a] text-white rounded-xl p-3 my-5" onClick={() => router.push(`/student/assignmentsubmission`)}>Add Submission</button>
                    </div>
                    <div className="dark:text-white   border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Assignment Description</h2>
                        <p className="text-sm text-gray-600">Opened: 30 OCT</p>
                        <p className="text-sm text-gray-600">Due date: 30 OCT</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ViewAssignments;