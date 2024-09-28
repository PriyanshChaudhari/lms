// pages/student/dashboard/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CourseCard from "@/components/Student/CourseCard";

interface courses {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  category: string;
}

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<courses[]>([]);
  const params = useParams();
  const userId = params.userId;

  useEffect(() => {
    const getStudentCourses = async () => {
      try {
        const res = await axios.post("/api/get/allocated-courses", { userId });
        setCourses(res.data.data);
        // console.log(res.data.data)
      }
      catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (userId) {
      getStudentCourses();
    }
  }, [userId]);

  return (
    <div className="flex flex-col lg:h-screen h-full p-5">

      <div className="flex flex-1 gap-10 flex-wrap md:flex-nowrap items-start justify-center border border-gray-300 p-5">
        <div className="w-full md:w-2/3 rounded-lg flex flex-col justify-center items-center h-full max-h-[calc(100vh-2rem)]">
          <CourseCard courses={courses} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
