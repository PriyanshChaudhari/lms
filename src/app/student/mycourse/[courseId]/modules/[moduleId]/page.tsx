"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

export default function ViewModule({ params }: { params: { courseId: string } }) {
    const router = useRouter();

    return (
        <div className="border border-gray-300 m-5">
            <div className="max-w-4xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-4">Module 1</h1>
                <p className="text-lg text-gray-700 mb-6">Description of module 1</p>
                <nav className="mb-6 p-2">
                    <ul className="flex justify-start space-x-4 list-none p-0">
                        <li className=" p-3 rounded-xl text-gray-500 cursor-pointer" onClick={() => router.push(`/student/mycourse/${params.courseId}`)}>Course {params.courseId}</li>
                        <li className=" p-3 rounded-xl text-black cursor-pointer">/</li>
                        <li className=" p-3 rounded-xl text-black cursor-pointer">Module 1</li>
                    </ul>
                </nav>
                <div className="space-y-4 ">
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Module Text</h2>
                        <p className="text-sm text-gray-600">text</p>
                    </div>
                   
                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Module Text</h2>
                        <p className="text-sm text-gray-600">text</p>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md h-26">
                        <h2 className="text-xl font-semibold mb-2">Module Text</h2>
                        <p className="text-sm text-gray-600">text</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
