"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserSectionOpen, setUserSectionOpen] = useState(false);
  const [isCourseSectionOpen, setCourseSectionOpen] = useState(false);
  const [isGroupSectionOpen, setGroupSectionOpen] = useState(false);
  const [isUserSectionVisible, setUserSectionVisible] = useState(false);
  const [isCourseSectionVisible, setCourseSectionVisible] = useState(false);
  const [isGroupSectionVisible, setGroupSectionVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
      <aside className="hidden sm:block w-64 bg-gray-100 dark:bg-[#151b23]  shadow-lg h-screen fixed z-50">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Portal</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link
              href={`/admin/${userId}/dashboard`}
              onClick={toggleDashboardSection}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                activeSection === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </Link>

            {/* Users Section */}
            <div className="space-y-1">
              <button
                onClick={toggleUserSection}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                  activeSection === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">👤</span>
                  <span>Users</span>
                </div>
                <span className="text-sm">{isUserSectionOpen ? '▼' : '▶'}</span>
              </button>

              {isUserSectionOpen && (
                <div className="space-y-1 bg-white dark:bg-gray-800 p-2">
                  <Link
                    href={`/admin/${userId}/create-user`}
                    className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  transition-colors duration-200"
                  >
                   → Create User
                  </Link>
                  <Link
                    href={`/admin/${userId}/upload-users`}
                    className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  transition-colors duration-200"
                  >
                   → Upload User Data
                  </Link>
                  <Link
                    href={`/admin/${userId}/view-users`}
                    className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  transition-colors duration-200"
                  >
                   → View Users
                  </Link>
                </div>
              )}
            </div>

            {/* Course Category Section */}
            <div className="space-y-1 ">
              <button
                onClick={toggleCourseSection}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                  activeSection === 'course'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📚</span>
                  <span>Course Category</span>
                </div>
                <span className="text-sm">{isCourseSectionOpen ? '▼' : '▶'}</span>
              </button>

              {isCourseSectionOpen && (
                <div className=" space-y-1 bg-white dark:bg-gray-800 p-2">
                  <Link
                    href={`/admin/${userId}/course-category/create`}
                    className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  transition-colors duration-200"
                  >
                   → Add Category
                  </Link>
                  <Link
                    href={`/admin/${userId}/course-category/manage`}
                    className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  transition-colors duration-200"
                  >
                   → Manage Category
                  </Link>
                </div>
              )}
            </div>

            {/* Groups Section */}
            <div className="space-y-1">
              <button
                onClick={toggleGroupSection}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                  activeSection === 'group'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">👥</span>
                  <span>Groups</span>
                </div>
                <span className="text-sm">{isGroupSectionOpen ? '▼' : '▶'}</span>
              </button>

              {isGroupSectionOpen && (
                <div className=" space-y-1 bg-white dark:bg-gray-800 p-2">
                  <Link
                    href={`/admin/${userId}/groups/create-group`}
                    className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  transition-colors duration-200"
                  >
                   → Create Group
                  </Link>
                  <Link
                    href={`/admin/${userId}/groups`}
                    className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded  transition-colors duration-200"
                  >
                   → View Groups
                  </Link>
                </div>
              )}
            </div>

            
          </nav>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed right-4 top-3 z-50 p-2 rounded-lg bg-gray-100 dark:bg-[#151b23]"
      >
        <span className="text-xl text-gray-600 dark:text-gray-300">
          {isMobileMenuOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Mobile Sidebar Overlay */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Mobile Sidebar Content */}
        <div className={`w-64 h-full bg-gray-100 dark:bg-[#151b23] transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Menu</h2>
            <button 
              onClick={closeMobileMenu}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <nav className="p-4 space-y-4">
            <Link
              href={`/admin/${userId}/dashboard`}
              className="block p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>

            <div className="space-y-2">
              <button
                onClick={toggleUserSection}
                className="w-full text-left p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Users {isUserSectionOpen ? '▼' : '▶'}
              </button>
              {isUserSectionOpen && (
                <div className="pl-4 space-y-2">
                  <Link
                    href={`/admin/${userId}/create-user`}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Create User
                  </Link>
                  <Link
                    href={`/admin/${userId}/upload-users`}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Upload User Data
                  </Link>
                  <Link
                    href={`/admin/${userId}/view-users`}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    View Users
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={toggleCourseSection}
                className="w-full text-left p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Course Category {isCourseSectionOpen ? '▼' : '▶'}
              </button>
              {isCourseSectionOpen && (
                <div className="pl-4 space-y-2">
                  <Link
                    href={`/admin/${userId}/course-category/create`}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Add Category
                  </Link>
                  <Link
                    href={`/admin/${userId}/course-category/manage`}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Manage Category
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={toggleGroupSection}
                className="w-full text-left p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Groups {isGroupSectionOpen ? '▼' : '▶'}
              </button>
              {isGroupSectionOpen && (
                <div className="pl-4 space-y-2">
                  <Link
                    href={`/admin/${userId}/groups/create-group`}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Create Group
                  </Link>
                  <Link
                    href={`/admin/${userId}/groups`}
                    className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    View Groups
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;