// pages/student/dashboard/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CourseCard from "@/components/Student/CourseCard";

const Dashboard: React.FC = () => {
  const params = useParams()
  const userId = params.userId;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const courseAllocation = async () => {
      try {
        const res = await axios.post("/api/get/allocated-courses", { userId });
        setCourses(res.data.courses);
        console.log(res.data.courses);
      } catch (error) {
        console.log(error);
      }
    };
    courseAllocation();

  }, [userId]);

  return (
    <div className="flex flex-col lg:h-screen h-full p-5">
      <div className="flex flex-1 gap-10 flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
        <div className="w-full md:w-2/3 p-5 border border-gray-300 rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
          <CourseCard courses={courses} userId={userId} />
        </div>

        {/* <div className="w-full md:w-1/3 p-5 border border-gray-300 rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
          {userId}
          <h1 className="text-2xl font-bold mb-6">Today</h1>
          <div className="flex flex-wrap gap-5">
            <div className="border border-gray-300 rounded-xl p-5 w-full max-w-xs shadow-sm">
              <h3 className="text-lg font-semibold">@nextjs</h3>
              <p className="text-sm text-gray-600">todays event</p>
            </div>
            <div className="border border-gray-300 rounded-xl p-5 w-full max-w-xs shadow-sm">
              <h3 className="text-lg font-semibold">@nextjs</h3>
              <p className="text-sm text-gray-600">todays event</p>
            </div>
          </div> */}
      </div>
    </div >
  );
};

export default Dashboard;
