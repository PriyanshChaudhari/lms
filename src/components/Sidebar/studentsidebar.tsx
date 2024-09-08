
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

// Define course data
const course1 = {
  id: 1,
  name: "React Basics",
  description: "Learn the fundamentals of React, including components, props, and state management.",
};

const course2 = {
  id: 2,
  name: "React Hooks",
  description: "Explore React Hooks, including useState, useEffect, and custom hooks.",
};

const course3 = {
  id: 3,
  name: "React Context",
  description: "Learn how to use React Context for global state management.",
};

// Add more courses as needed
const showCourse = [course1, course2, course3];

const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCoursesVisible, setCoursesVisible] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<typeof course1 | null>(null);

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

  const handleCourseClick = (course: typeof course1) => {
    setExpandedCourse(expandedCourse === course ? null : course);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:block w-1/4 lg:w-1/6 bg-gray-100 dark:bg-gray-800 p-4 h-full fixed z-50">
        <div className="flex flex-col gap-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4">
          <button
            onClick={toggleCoursesVisibility}
            className="hover:bg-slate-300 text-left dark:hover:bg-slate-600 text-black dark:text-gray-200 p-2 rounded-md bg-blue-500 text-white"
          >
            My Courses
          </button>
          {isCoursesVisible && (
            <div>
              <ul className="list-disc">
                {showCourse.map((course) => (
                  <li key={course.id} className="text-black list-none py-1 dark:text-gray-200 cursor-pointer">
                    
                    <Link href={`/student/mycourse/${course.id}`}>
                      <strong>{course.name}</strong>
                        <p className="bg-gray-300 dark:bg-gray-400 mt-2 p-2">{course.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <hr />
          <Link href="#about" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            About
          </Link>
          <hr />
          <Link href="#contact" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            Contact
          </Link>
          <hr />
          <Link href="#notifications" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            Notifications
          </Link>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-40 left-0 bg-white dark:bg-gray-800 border border-gray-300 rounded-e-full">
        <button onClick={toggleMobileMenu} className="text-xl m-3 focus:outline-none">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-12 left-0 w-64 h-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}>
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
