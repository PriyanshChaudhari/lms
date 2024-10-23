"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const [isUserSectionOpen, setUserSectionOpen] = useState(false);
  const [isCourseSectionOpen, setCourseSectionOpen] = useState(false);
  const [isGroupSectionOpen, setGroupSectionOpen] = useState(false);
  const [isUserSectionVisible, setUserSectionVisible] = useState(false);
  const [isCourseSectionVisible, setCourseSectionVisible] = useState(false);
  const [isGroupSectionVisible, setGroupSectionVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const toggleUserSection = () => {
    setUserSectionOpen(!isUserSectionOpen);
    setUserSectionVisible(!isUserSectionVisible);
    setActiveSection('user');
  };

  const toggleDashboardSection = () => {
    setActiveSection('dashboard');
    setUserSectionOpen(false);
    setCourseSectionOpen(false);
    setGroupSectionOpen(false);
    setUserSectionVisible(false);
    setCourseSectionVisible(false);
    setGroupSectionVisible(false);
  };

  const toggleCourseSection = () => {
    setCourseSectionOpen(!isCourseSectionOpen);
    setCourseSectionVisible(!isCourseSectionVisible);
    setActiveSection('course');
  };

  const toggleGroupSection = () => {
    setGroupSectionOpen(!isGroupSectionOpen);
    setGroupSectionVisible(!isGroupSectionVisible);
    setActiveSection('group');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div>
        <aside className="hidden sm:block w-1/4 lg:w-1/6 bg-gray-100 dark:bg-[#151b23] p-4 h-full fixed z-50">
          <div className="flex flex-col gap-6 h-[85vh] bg-white dark:bg-[#212830] border border-gray-300 dark:border-gray-700 p-4">
            <Link
              href={`/admin/${userId}/dashboard`}
              onClick={toggleDashboardSection}
              className={`${activeSection === 'dashboard'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200'
                } p-2 rounded-lg-md`}
            >
              Dashboard
            </Link>
            <button
              onClick={toggleUserSection}
              className={`${activeSection === 'user'
                ? 'bg-blue-500 text-white text-left'
                : 'hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 text-left'
                } p-2 rounded-lg-md`}
            >
              Users
            </button>
            {isUserSectionOpen && (
              <div className="flex flex-col gap-2">
                <Link
                  href={`/admin/${userId}/create-user`}
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-[#151b23] rounded-lg bg-gray-300 text-sm"
                >
                  Create User
                </Link>
                <Link
                  href={`/admin/${userId}/upload-users`}
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-[#151b23] rounded-lg bg-gray-300 text-sm"
                >
                  Upload User Data
                </Link>
                <Link
                  href={`/admin/${userId}/view-users`}
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-[#151b23] rounded-lg bg-gray-300 text-sm"
                >
                  View Users
                </Link>
              </div>
            )}
            <button
              onClick={toggleCourseSection}
              className={`${activeSection === 'course'
                ? 'bg-blue-500 text-white text-left'
                : 'hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 text-left'
                } p-2 rounded-lg-md`}
            >
              Course Category
            </button>
            {isCourseSectionOpen && (
              <div className="flex flex-col gap-2">
                <Link
                  href={`/admin/${userId}/course-category/create`}
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-[#151b23] rounded-lg bg-gray-300 text-sm"
                >
                  Add Category
                </Link>
                <Link
                  href={`/admin/${userId}/course-category/manage`}
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-[#151b23] rounded-lg bg-gray-300 text-sm"
                >
                  Manage Category
                </Link>
              </div>
            )}
            <button
              onClick={toggleGroupSection}
              className={`${activeSection === 'group'
                ? 'bg-blue-500 text-white text-left'
                : 'hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 text-left'
                } p-2 rounded-lg-md`}
            >
              Groups
            </button>
            {isGroupSectionOpen && (
              <div className="flex flex-col gap-2">
                <Link
                  href={`/admin/${userId}/groups/create-group`}
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-[#151b23] rounded-lg bg-gray-300 text-sm"
                >
                  Create Group
                </Link>
                <Link
                  href={`/admin/${userId}/groups`}
                  className="hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-gray-700 dark:hover:text-gray-300 text-black dark:text-gray-200 p-2 dark:bg-[#151b23] rounded-lg bg-gray-300 text-sm"
                >
                  View Groups
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-40 left-0 bg-white dark:bg-[#151b23] border border-gray-300 rounded-lg-e-full">
        <button onClick={toggleMobileMenu} className="text-xl m-3 focus:outline-none">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className={`fixed top-18 left-0 w-64 h-full bg-gray-100 dark:bg-[#151b23] text-black dark:text-white transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-50 overflow-y-auto`}>
          <button onClick={closeMobileMenu} className="text-3xl absolute top-4 right-4 focus:outline-none text-black dark:text-white">
            ✕
          </button>
          <ul className="font-medium text-center space-y-4 mt-12 ">
            <li>
              <Link href={`/admin/${userId}/dashboard`} className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                Dashboard
              </Link>
            </li>
            <li>
              <button onClick={toggleUserSection} className="p-4  text-black dark:text-gray-200">
                Users
              </button>
              {isUserSectionOpen && (
                <ul className="pl-4 text-xs pr-4 ">
                  <li>
                    <Link href={`/admin/${userId}/create-user`} className="block p-4 text-center text-black dark:bg-[#212830] mb-2 mx-2 rounded-lg dark:text-gray-200" onClick={closeMobileMenu}>
                      Create User
                    </Link>
                  </li>
                  <li>
                    <Link href={`/admin/${userId}/upload-users`} className="block p-4 text-center text-black dark:bg-[#212830] mb-2 mx-2 rounded-lg dark:text-gray-200" onClick={closeMobileMenu}>
                      Upload Users Data
                    </Link>
                  </li>
                  <li>
                    <Link href={`/admin/${userId}/view-users`} className="block p-4 text-center text-black dark:bg-[#212830] mb-2 mx-2 rounded-lg dark:text-gray-200" onClick={closeMobileMenu}>
                      View Users
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={toggleCourseSection} className="p-4 text-center text-black dark:text-gray-200">
                Course Category
              </button>
              {isCourseSectionOpen && (
                <ul className="pl-4 text-xs pr-4">
                  <li>
                    <Link href={`/admin/${userId}/course-category/create`} className="block p-4 text-center dark:bg-[#212830] mb-2 mx-2 rounded-lg text-black dark:text-gray-200" onClick={closeMobileMenu}>
                      Add Courses Category
                    </Link>
                  </li>
                  <li>
                    <Link href={`/admin/${userId}/course-category/manage`} className="block p-4 text-center dark:bg-[#212830] mb-2 mx-2 rounded-lg text-black dark:text-gray-200" onClick={closeMobileMenu}>
                      Manage Category
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button onClick={toggleGroupSection} className="p-4 text-center text-black dark:text-gray-200">
                Groups
              </button>
              {isGroupSectionOpen && (
                <ul className="pl-4 text-xs pr-4">
                  <li>
                    <Link href={`/admin/${userId}/groups/create-group`} className="block p-4 dark:bg-[#212830] mb-2 mx-2 rounded-lg text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                      Create Group
                    </Link>
                  </li>
                  <li>
                    <Link href={`/admin/${userId}/groups`} className="block p-4 dark:bg-[#212830] mb-2 mx-2 rounded-lg text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>
                      View Groups
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;