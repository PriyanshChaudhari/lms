"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { usePathname, useParams, useRouter } from 'next/navigation';
import axios from 'axios'
import LoginButton from '@/components/ui/loginButton'

interface User {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profilePicUrl: string;
}

const Navbar: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const firebaseStorageId = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  const DefaultProfilePic = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorageId}/o/default-profile-pic.png?alt=media`;
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>(DefaultProfilePic);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      sessionStorage.clear(); // Clear session storage on logout
      setProfilePicUrl(DefaultProfilePic); // Reset profile pic state
      window.location.replace('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToProfile = () => {
    window.location.replace('/profile');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isLoginPage = pathname === '/' || pathname === '/login';

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/get/one-user?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        const data = await response.json();
        setUser(data.userData);
        if (data.userData.profilePicUrl) {
          setProfilePicUrl(data.userData.profilePicUrl);
        } else {
          setProfilePicUrl(DefaultProfilePic);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setProfilePicUrl(DefaultProfilePic);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const navigateToDashboard = () => {
    router.push('/dashboard');

    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
    else if (user?.role === 'student') {
      const studentId = user.userId;
      router.push(`/student/${studentId}/dashboard`);
    }
    else if (user?.role === 'teacher') {
      const teacherId = user.userId;
      router.push(`/teacher/${teacherId}/dashboard`);
    }

  };

  return (
    <nav className="dark:bg-gray-800 p-4 w-full bg-gray-100 text-black dark:text-white  z-10 top-0 sticky font-rubik" style={{ cursor: 'default' }}>
      <div className="mx-auto text-center flex w-5/6 justify-between font-bold text-black dark:text-white">
        <div className="text-3xl space-x-1 flex items-center sm:text-2xl font-extrabold">
          LMS
        </div>

        <div className=" flex lg:space-x-10 items-center gap-6 text-md font-semibold">
          <button onClick={toggleTheme} className="transition ease-in-out duration-300 rounded-md text-black dark:text-gray-200">
            {theme === 'dark' ? <SunIcon className='text-2xl' /> : <MoonIcon className='text-3xl' />}
          </button>
          {isLoginPage ? (
            pathname === '/login' ? null : <LoginButton /> // Don't show LoginButton on the '/login' page
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div className='flex gap-6 items-center'>
                <p className='hidden sm:block'>{`${getGreeting()},  ${user?.first_name || 'User'}`}</p>
                <div
                  className="border border-gray-500 text-xs h-8 w-8 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img src={profilePicUrl || DefaultProfilePic} className="h-full w-full rounded-full object-cover" />
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl shadow-lg">
                  <ul className="list-none p-2">
                    <li className="p-2 text-sm bg-gray-50 dark:bg-gray-700 rounded mb-2 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer" onClick={navigateToDashboard}>Dashboard</li>
                    <li className="p-2 text-sm bg-gray-50 dark:bg-gray-700 mb-2 rounded hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer" onClick={navigateToProfile}>Profile</li>
                    <li className="text-sm bg-gray-50 dark:bg-gray-700 rounded cursor-pointer">
                      <button className='text-red-500  hover:text-red-600 p-2 rounded-xl' onClick={handleLogout}>Log Out</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
