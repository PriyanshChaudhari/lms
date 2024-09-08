"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

// Define course data with modules
// Define course data with module IDs
const course1 = {
  id: 1,
  name: "Course 1",
  modules: [
    { id: 1, name: "Module 1" },
    { id: 2, name: "Module 2" },
    { id: 3, name: "Module 3" },
    { id: 4, name: "Module 4" }
  ],
};

const course2 = {
  id: 2,
  name: "Course 2",
  modules: [
    { id: 1, name: "Module 1" },
    { id: 2, name: "Module 2" },
    { id: 3, name: "Module 3" },
    { id: 4, name: "Module 4" }
  ],
};

const course3 = {
  id: 3,
  name: "Course 3",
  modules: [
    { id: 1, name: "Module 1" },
    { id: 2, name: "Module 2" },
    { id: 3, name: "Module 3" },
    { id: 4, name: "Module 4" }
  ],
};

const showCourse = [course1, course2, course3];


const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isCoursesVisible, setCoursesVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleCoursesVisibility = () => {
    setCoursesVisible(!isCoursesVisible);
  };

  const handleCourseClick = (courseId: number) => {
    setSelectedCourseId(selectedCourseId === courseId ? null : courseId); // Toggle course selection
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:block w-1/4 lg:w-1/6 bg-gray-100 dark:bg-gray-800 p-4 h-full fixed z-50">
        <div className="flex flex-col gap-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4">
          <button
            onClick={toggleCoursesVisibility}
            className="hover:bg-blue-400 text-left dark:hover:bg-slate-600  dark:text-gray-200 p-2 rounded-md bg-blue-500 text-white"
          >
            My Courses
          </button>
          {isCoursesVisible && (
            <div>
              <ul className="list-disc">
                {showCourse.map((course) => (
                  <li
                    key={course.id}
                    className="text-black list-none py-1 dark:text-gray-200 cursor-pointer bg-gray-300 dark:bg-gray-700 rounded p-3 my-2"
                  >
                    {/* Wrap in Link for redirection */}
                    <Link href={`/student/mycourse/${course.id}`}>
                      <span onClick={() => handleCourseClick(course.id)}>
                        <strong>{course.id}. {course.name}</strong>
                      </span>
                    </Link>

                    {/* Conditionally render the course description and modules */}
                    {selectedCourseId === course.id && (
                      <div className="mt-2 p-2 bg-gray-300 dark:bg-gray-700 rounded">
                        <ul className="list-disc pl-4 ">
                          {course.modules.map((module) => (
                            <Link key={module.id} href={`/student/mycourse/${course.id}/modules/${module.id}`}>
                              <li className="py-1 text-sm text-black dark:text-white block cursor-pointer">
                                {module.id}. {module.name}
                              </li>
                            </Link>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                  
                ))}
                
              </ul>

            </div>
          )}
          <Link href="#dashboard" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            Dashboard
          </Link>
          <Link href="#notifications" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            Notificstions
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-40 left-0 bg-white dark:bg-gray-800 border border-gray-300 rounded-e-full">
        <button onClick={toggleMobileMenu} className="text-xl m-3 focus:outline-none">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-18 left-0 w-64 h-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}>
        <button onClick={closeMobileMenu} className="text-3xl absolute top-4 right-4 focus:outline-none text-black dark:text-white">
          ✕
        </button>
        <div className="flex flex-col gap-6 p-4 mt-12">
          <Link href="/student/mycourse" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
            My Courses
          </Link>
          <Link href="#about" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
            About
          </Link>
          <Link href="#contact" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
            Contact
          </Link>
          <Link href="#notifications" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
            Notifications
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
