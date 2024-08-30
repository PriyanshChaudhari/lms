"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

const ViewParticipants: React.FC = () => {
    const router = useRouter();


    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Participants</h1>
                <p className="text-lg text-gray-700 dark:text-gray-500 mb-6">Description of participants</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className=" p-3 rounded-xl text-gray-500 dark:text-gray-500 cursor-pointer" onClick={() => router.push(`/student/viewsection`)}>Course 1</li>
                        <li className=" p-3 rounded-xl text-black dark:text-gray-300 cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-black dark:text-gray-300 cursor-pointer">Participants</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="dark:text-white   border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Module Text</h2>
                        <p className="text-sm text-gray-600">text</p>
                    </div>
                   
                    <div className="dark:text-white   border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Module Text</h2>
                        <p className="text-sm text-gray-600">text</p>
                    </div>

                    <div className="dark:text-white   border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Module Text</h2>
                        <p className="text-sm text-gray-600">text</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ViewParticipants;