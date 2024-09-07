"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
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

  return (
    <>
      {/* Desktop Sidebar */}
      <div >
      <aside className="hidden sm:block w-1/4 lg:w-1/6 bg-gray-100 dark:bg-gray-800 p-4 h-full fixed z-50">
        {/* <div className="flex flex-col gap-6">
          <Link href="/admin/create-user" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200">
           Enroll User
          </Link>
          <Link href="/admin/upload-users" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200">
           Upload Users Data
          </Link>
          <Link href="/admin/courses/course-category" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200">
            Courses Category
          </Link>
          <Link href="#notifications" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200">
            Notifications
          </Link>
      
        </div> */}
        <div className="flex flex-col gap-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4">
          <Link href="/admin/create-user" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md bg-blue-500 text-white">
            Enroll User
          </Link>
          <Link href="/admin/upload-users" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            Upload User Data
          </Link>
          <Link href="/admin/courses/course-category" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
            Course Category
          </Link>
          <Link href="#notifications" className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 rounded-md">
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
        <div className="md:hidden fixed top-0 z-50 left-0 w-full h-full dark:bg-gray-800 dark:text-white text-black bg-gray-100 text-center flex flex-col items-center justify-center">
          <button onClick={closeMobileMenu} className="text-3xl absolute top-10 right-10 focus:outline-none text-black dark:text-white">
            ✕
          </button>
          <ul className="font-medium text-2xl space-y-4">
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
