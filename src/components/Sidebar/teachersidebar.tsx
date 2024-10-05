"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface Module {
  id: string;
  description: string;
  position: number;
}

interface Course {
  course_id: string;
  title: string;
}

const Sidebar: React.FC = () => {
  const [isCoursesVisible, setCoursesVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSectionVisible, setSectionVisible] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<{ [courseId: string]: Module[] }>({});
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      // Replace with your actual API endpoint for courses
      const response = await axios.post('/api/get/allocated-courses', { userId });
      setCourses(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    if (modules[courseId]) return; // If modules are already fetched, don't fetch again

    try {
      setIsLoadingModules(true);
      // Replace with your actual API endpoint for modules
      const response = await axios.post(`/api/get/course-modules`, { courseId });
      // Sort modules by position before setting state
      const sortedModules = response.data.content.sort((a: any, b: any) => a.position - b.position);
      console.log(response.data.content[0].id);
      setModules(prevModules => ({
        ...prevModules,
        [courseId]: sortedModules
      }));
      setError(null);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to fetch modules. Please try again later.');
    } finally {
      setIsLoadingModules(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleCoursesVisibility = () => {
    setCoursesVisible(!isCoursesVisible);
    setSectionVisible(!isSectionVisible);
  };

  const handleCourseClick = (courseId: string) => {
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    } else {
      setSelectedCourseId(courseId);
      fetchModules(courseId);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:block w-1/4 lg:w-1/6 bg-gray-100 dark:bg-gray-800 p-4 h-full fixed z-50">
        <div className="flex flex-col gap-4 h-[85vh] bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4">
          <Link href={`/teacher/${userId}/dashboard`} className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            Dashboard
          </Link>
          <button
            onClick={toggleCoursesVisibility}
            className={`${isSectionVisible ? 'bg-blue-500 text-white text-left' : 'hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 text-left'
              } p-2 rounded-md`}
          >
            My Courses
          </button>
          {isCoursesVisible && (
            <div>
              {isLoadingCourses ? (
                <p>Loading courses...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ul className="list-disc">
                  {courses.map((course) => (
                    <li
                      key={course.course_id}
                      className="text-black list-none py-1 dark:text-gray-200 cursor-pointer bg-gray-300 dark:bg-gray-700 rounded p-3 my-2"
                    >
                      <Link href={`/teacher/${userId}/mycourse/${course.course_id}`}>
                        <span onClick={() => handleCourseClick(course.course_id)}>
                          <strong>{course.title}</strong>
                        </span>
                      </Link>

                      {selectedCourseId === course.course_id && (
                        <div className="mt-2 p-2 bg-gray-300 dark:bg-gray-700 rounded">
                          {isLoadingModules ? (
                            <p>Loading modules...</p>
                          ) : modules[course.course_id] ? (
                            <ul className="list-disc pl-4">
                              {modules[course.course_id].map((module) => (
                                <Link key={module.id} href={`/teacher/${userId}/mycourse/${course.course_id}/modules/${module.id}`}>
                                  <li className="py-1 text-sm text-black dark:text-white block cursor-pointer">
                                    {module.position}. {module.description}
                                  </li>
                                </Link>
                              ))}
                            </ul>
                          ) : (
                            <p>No modules found for this course.</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-40 left-0 bg-white dark:bg-gray-800 border border-gray-300 rounded-e-full">
        <button onClick={toggleMobileMenu} className="text-xl m-3 focus:outline-none">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Sidebar Content */}
      <div className={`fixed top-18 left-0 w-64 h-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}>
        <button onClick={closeMobileMenu} className="text-3xl absolute top-4 right-4 focus:outline-none text-black dark:text-white">
          ✕
        </button>
        <div className="flex flex-col gap-6 p-4 mt-12">
          <Link href={`/teacher/${userId}/dashboard`} className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
            Dashboard
          </Link>
          <Link href={`/teacher/${userId}/mycourse`} className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
            My Courses
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;