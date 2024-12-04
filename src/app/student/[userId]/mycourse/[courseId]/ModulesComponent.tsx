"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Eye, Download } from "lucide-react";
import { Tooltip } from "react-tooltip";

interface contents {
  id: string;
  title: string;
  description: string;
  position: number;
}

interface ModulesComponentProps {
  userId: string;
  courseId: string;
  moduleId: string;
}

export default function ModulesComponent({
  userId,
  courseId,
  moduleId,
}: ModulesComponentProps) {
  const router = useRouter();
  const params = useParams();
  const [courseContent, setCourseContent] = useState<contents[]>([]);

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

  const handleViewClick = (contentId: string) => {
    router.push(
      `/student/${userId}/mycourse/${courseId}/modules/${moduleId}/content/${contentId}`
    );
  };

  const handleDownloadClick = (contentId: string) => {
    console.log(`Download content with ID: ${contentId}`);
  };

  const sortedContent = courseContent.sort((a, b) => a.position - b.position);

  return (
    <div className="flex w-full dark:bg-transparent mt-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {sortedContent.map((content) => (
            <div
              key={content.id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 "
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                  <span className="text-xl font-semibold">{"C"}</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {content.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <div
                  data-tooltip-id="view-content-tooltip"
                  data-tooltip-content="View Content"
                  className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                  onClick={() => handleViewClick(content.id)}
                >
                  <Eye className="text-blue-600" />
                </div>

                <div
                  data-tooltip-id="download-content-tooltip"
                  data-tooltip-content="Download Content"
                  className="p-2 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow"
                  onClick={() => handleDownloadClick(content.id)}
                >
                  <Download className="text-green-500" />
                </div>

                <Tooltip id="view-content-tooltip" place="top" />
                <Tooltip id="download-content-tooltip" place="top" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
