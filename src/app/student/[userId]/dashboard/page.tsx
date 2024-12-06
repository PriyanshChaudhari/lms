// pages/student/dashboard/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CourseCard from "@/components/Student/CourseCard";


interface courses {
  course_id: string;
  title: string;
  description: string;
  teacher_id: string;
  category: string;
  coursePicUrl: string
}

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<courses[]>([]);
  const params = useParams();
  const userId = params.userId as string;

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
    <CourseCard courses={courses} userId={userId} />
  );
};

export default Dashboard;
