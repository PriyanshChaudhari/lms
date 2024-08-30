// pages/student/dashboard/dashboard.tsx
"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Mycourse from '@/app/student/mycourse/page';

const Dashboard: React.FC = () => {
  const router = useRouter();

  //   const navigateToEditCourse = (courseId: number) => {
  //     router.push(`/student/viewcourse/${courseId}`);
  //   }
  return (
    <div className="flex flex-col lg:h-screen h-full p-5">
      <div className="flex flex-1 gap-10 flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
        <div className="w-full md:w-2/3 p-5 border border-gray-300 rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
          <Mycourse/>
        </div>
        <div className="w-full md:w-1/3 p-5 border border-gray-300 rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
          <h1 className="text-2xl font-bold mb-6">Today</h1>
          <div className="flex flex-wrap gap-5">
            <div className="border border-gray-300 rounded-xl p-5 w-full max-w-xs shadow-sm">
              <h3 className="text-lg font-semibold">@nextjs</h3>
              <p className="text-sm text-gray-600">today's event</p>
            </div>
            <div className="border border-gray-300 rounded-xl p-5 w-full max-w-xs shadow-sm">
              <h3 className="text-lg font-semibold">@nextjs</h3>
              <p className="text-sm text-gray-600">today's event</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
