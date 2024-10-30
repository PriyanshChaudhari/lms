// // pages/student/dashboard/dashboard.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import CourseCard from "@/components/Teacher/CourseCard";
// import MyCourse from "../mycourse/page";

// interface courses {
//   id: string;
//   title: string;
//   description: string;
//   teacher_id: string;
//   category: string;
// }

// const Dashboard: React.FC = () => {
//   const [courses, setCourses] = useState<courses[]>([]);
//   const params = useParams();
//   const userId = params.userId;

//   // useEffect(() => {
//   //   const getTeacherCourses = async () => {
//   //     try {
//   //       const res = await axios.get(`/api/teacher/${userId}/dashboard`);
//   //       if (res.data.success) {
//   //         setCourses(res.data.data);
//   //       } else {
//   //         console.error("No courses found");
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching courses:", error);
//   //     }
//   //   };

//   //   if (userId) {
//   //     getTeacherCourses();
//   //   }
//   // }, [userId]);

//   return (
//     <MyCourse/>
//       );
// };

//       export default Dashboard;


// pages/student/dashboard/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CourseCard from "@/components/Teacher/CourseCard";

interface courses {
  course_id: string;
  title: string;
  description: string;
  teacher_id: string;
  category: string;
  thumbnail: string
}

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<courses[]>([]);
  const params = useParams();
  const userId = params.userId as string;

  useEffect(() => {
    const getTeacherCourses = async () => {
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
      getTeacherCourses();
    }
  }, [userId]);

  return (
    
      <CourseCard courses={courses} userId={userId} />
      

  );
};

export default Dashboard;
