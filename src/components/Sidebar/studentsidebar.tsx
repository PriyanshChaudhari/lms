"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import axios from "axios";
import Calendar from "../Calender/calender";

interface Module {
  id: string;
  description: string;
  title: string;
  position: number;
}

interface Course {
  course_id: string;
  title: string;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path;
  
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
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCalender, setCalender] = useState(false);

  const handleCloseCalender = () => {
    setCalender(false);
    setActiveSection('dashboard');
    
  };

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
    setActiveSection('courses');
    setCalender(false)
  };

  const toggleDashboardVisibility = () => {
    setActiveSection('dashboard');
    setCoursesVisible(false);
    setCalender(false)
  }


  const toggleCalenderSection = () => {
    setCalender(true);
    setCoursesVisible(false);
    setActiveSection('calender');
  }

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
    <aside className="hidden sm:block w-64 bg-gray-100 dark:bg-[#151b23] dark:bg-[] shadow-lg h-screen fixed z-40">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Portal</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link 
            href={`/student/${userId}/dashboard`}
            onClick={toggleDashboardVisibility}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
              activeSection === 'dashboard'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </Link>

          {/* <button
              onClick={toggleCalenderSection}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${activeSection === 'calender'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">📅</span>
                <span>Events</span>
              </div>
            </button> */}

          <button
            onClick={toggleCoursesVisibility}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
              activeSection === 'courses'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">📚</span>
              <span>My Courses</span>
            </div>
            <span className="text-sm">{isCoursesVisible ? '▼' : '▶'}</span>
          </button>

          {/* Courses List */}
          {isCoursesVisible && (
            <div className=" space-y-2">
              {isLoadingCourses ? (
                <div className="p-4 text-gray-500 dark:text-gray-400">Loading courses...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : (
                <ul className="space-y-2">
                  {courses.map((course) => (
                    <li key={course.course_id} className="rounded-lg overflow-hidden bg-white dark:bg-[#212830]">
                      <Link href={`/student/${userId}/mycourse/${course.course_id}`}>
                        <div 
                          onClick={() => handleCourseClick(course.course_id)}
                          className="p-3 border-b border-gray-200 dark:border-gray-600 flex justify-between transition-colors duration-200 rounded-lg"
                        >
                          <span className="text-gray-800 hover:underline dark:text-gray-200 font-medium">
                            {course.title}
                          </span>
                          <span className="text-sm">{selectedCourseId ? '▼' : '▶'}</span>
                        </div>
                      </Link>

                      {/* Modules List */}
                      {selectedCourseId === course.course_id && (
                        <div className="mt-1 ">
                          {isLoadingModules ? (
                            <div className="p-2 text-gray-500 dark:text-gray-400">Loading modules...</div>
                          ) : modules[course.course_id] ? (
                            <ul className="space-y-1 p-2">
                              {modules[course.course_id].map((module) => (
                                <Link 
                                  key={module.id}
                                  href={`/student/${userId}/mycourse/${course.course_id}?section=modules#${module.id}`}
                                >
                                  <li className="p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100  dark:hover:bg-gray-700 rounded ">
                                    {module.position}→ {module.title}
                                  </li>
                                </Link>
                              ))}
                            </ul>
                          ) : (
                            <div className="p-2 text-gray-500 dark:text-gray-400">No modules found</div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </nav>
        {(isCalender) && <Calendar onClose={handleCloseCalender} />}
      </div>
    </aside>

    {/* Mobile Toggle Button */}
    <button 
      onClick={toggleMobileMenu}
      className="md:hidden fixed top-3 right-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-[#151b23]"
    >
      <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
    </button>

    {/* Mobile Sidebar */}
    <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
      isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className={`w-64 h-full bg-gray-100 dark:bg-[#151b23] transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Menu</h2>
          <button onClick={closeMobileMenu} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          <Link 
            href={`/student/${userId}/dashboard`}
            className="block p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          <Link 
            href={`/student/${userId}/mycourse`}
            className="block p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            onClick={closeMobileMenu}
          >
            My Courses
          </Link>
        </div>
      </div>
    </div>
  </>
    
  );
};

export default Sidebar;