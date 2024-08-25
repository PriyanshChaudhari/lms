"use client"

import React, { Component } from 'react'
import { useRouter } from 'next/navigation'

const Mycourse: React.FC = () => {
    const router = useRouter();

    const navigateToEditCourse = (courseId: number) => {
      router.push(`/student/viewcourse/${courseId}`);
    };
        return (
            <div className="flex flex-col h-screen p-5">
  <div className="flex flex-1  flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
    <div className="w-full  p-5  rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <div className="flex w-full flex-wrap justify-center gap-5">
        <div className="border border-gray-300 rounded-xl p-5 w-full max-w-xs shadow-sm cursor-pointer" onClick={() => navigateToEditCourse(1)}>
          <h3 className="text-lg font-semibold">Course 1</h3>
          <p className="text-sm text-gray-600">Deploy your new project in one-click.</p>
          <div className="bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
        <div className="border border-gray-300 rounded-xl p-5 w-full max-w-xs shadow-sm cursor-pointer" onClick={() => navigateToEditCourse(1)}>
          <h3 className="text-lg font-semibold">Course 2</h3>
          <p className="text-sm text-gray-600">Deploy your new project in one-click.</p>
          <div className="bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
        <div className="border border-gray-300 rounded-xl p-5 w-full max-w-xs shadow-sm cursor-pointer" onClick={() => navigateToEditCourse(1)}>
          <h3 className="text-lg font-semibold">Course 3</h3>
          <p className="text-sm text-gray-600">Deploy your new project in one-click.</p>
          <div className="bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

          
        );
}

export default Mycourse;
