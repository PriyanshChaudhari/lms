"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  const [isUserSectionOpen, setUserSectionOpen] = useState(false);
  const [isCourseSectionOpen, setCourseSectionOpen] = useState(false);
  const [isUserSectionVisible, setUserSectionVisible] = useState(false);
  const [isCourseSectionVisible, setCourseSectionVisible] = useState(false);

  const toggleUserSection = () => {
    setUserSectionOpen(!isUserSectionOpen);
    setUserSectionVisible(!isUserSectionVisible);
  };

  const toggleCourseSection = () => {
    setCourseSectionOpen(!isCourseSectionOpen);
    setCourseSectionVisible(!isCourseSectionVisible);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div >
        <aside className="hidden sm:block w-1/4 lg:w-1/6 bg-gray-100 dark:bg-gray-800 p-4 h-full fixed z-50">
          <div className="flex flex-col gap-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4">
            <button
              onClick={toggleUserSection}
              className={`${isUserSectionVisible ? 'bg-blue-500 text-white text-left' : 'hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 text-left'
                } p-2 rounded-md`}
            >
              Users
            </button>

            {isUserSectionOpen && (
              <div className="flex flex-col gap-2">
                <Link
                  href="/admin/create-user"
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-gray-800 rounded bg-gray-300 text-sm"
                >
                  Create User
                </Link>
                <Link
                  href="/admin/upload-users"
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-gray-800 rounded bg-gray-300 text-sm"
                >
                  Upload User Data
                </Link>
                <Link
                  href="/admin/courses/view-users"
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-gray-800 rounded bg-gray-300 text-sm"
                >
                  View Users
                </Link>
              </div>
            )}
             <button
              onClick={toggleCourseSection}
              className={`${isCourseSectionVisible ? 'bg-blue-500 text-white text-left' : 'hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 text-left'
                } p-2 rounded-md`}
            >
              Course
            </button>
            {isCourseSectionOpen && (
              <div className="flex flex-col gap-2  ">
                <Link
                  href="/admin/courses/course-category"
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-gray-800 rounded bg-gray-300 text-sm"
                >
                  Add Category
                </Link>
                <Link
                  href="/admin/course-category/manage"
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-gray-800 rounded bg-gray-300 text-sm"
                >
                  Manage Category
                </Link>

              </div>
            )}

            <Link
              href="#dashboard"
              className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="#notifications"
              className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md"
            >
              Notifications
            </Link>

          </div>

        </aside>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-40 left-0 bg-white dark:bg-gray-800 border border-gray-300 rounded-e-full">
        <button onClick={toggleMobileMenu} className="text-xl m-3 focus:outline-none">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className={`fixed top-18 left-0 w-64 h-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}>
          <button onClick={closeMobileMenu} className="text-3xl absolute top-4 right-4 focus:outline-none text-black dark:text-white">
            ✕
          </button>
          <ul className="font-medium space-y-4 mt-12">
            <li>
              <Link
                href="/admin/courses/view-users"
                className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md"
              >
                View Users
              </Link>
            </li>
            <li>
              <Link href="/admin/create-user" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                Enroll User
              </Link>
            </li>
            <li>
              <Link href="/admin/upload-users" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                Upload Users Data
              </Link>
            </li>
            <li>
              <Link href="/admin/courses/course-category" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                Courses Category
              </Link>
            </li>


            <li>
              <Link href="/admin/course-category/manage" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                Manage Category
              </Link>
            </li>
            <li>
              <Link href="#dashboard" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="#notifications" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                Notifications
              </Link>
            </li>

          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
