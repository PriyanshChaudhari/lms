"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import ContentsComponent from "./ContentsComponent";

interface module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  created_at: Date
}

interface content {
  id: string;
  title: string;
  description: string;
  content_type: string;
  attachments: string[];
  created_at: Date;
}

interface ModulesComponentProps {
  userId: string;
  courseId: string;
  moduleId: string;
  module: module
}

export default function ModulesComponent({
  moduleId, module, courseId, userId
}: ModulesComponentProps) {
  const [courseContent, setCourseContent] = useState<content[]>([]);
  const [showAllContent, setShowAllContent] = useState(false);

  // Toggle visibility for all content
  const toggleAllContentVisibility = () => {
    setShowAllContent((prev) => !prev); // Toggle global visibility
  };

  useEffect(() => {
    const getCourseContent = async () => {
      try {
        const res = await axios.post("/api/get/course-content", { moduleId });
        setCourseContent(res.data.content);
      } catch (error) {
        console.log(error);
      }
    };
    getCourseContent();
  }, [moduleId]);


  const sortedContent = courseContent.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateA - dateB; // Ascending order (earliest to latest)
  });

  return (
    <div className="flex w-full dark:bg-transparent mt-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-6 w-full">
          <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
          </span>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {module.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {module.description}
            </p>
          </div>
        </div>
        <div className=''>
          <div>
            <div className="grid gap-4 items-center mt-2">
              <div className="mb-4 flex justify-end">
                <button
                  onClick={toggleAllContentVisibility}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  {showAllContent ? "Hide All Content" : "Show All Content"}
                </button>
              </div>
            </div>
            <table className="min-w-full bg-white dark:bg-gray-700">

              <tbody>
                {showAllContent &&
                  sortedContent.map((content) => (
                    <tr key={content.id}>
                      <td colSpan={4} className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="">
                          <ContentsComponent
                            contentId={content.id}
                            content={content}
                            moduleId={moduleId}
                            courseId={courseId}
                            userId={userId}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                {!showAllContent && (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Click &quot;Show All Content&quot; to display the module contents.
                  </p>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
