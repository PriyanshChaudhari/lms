"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { usePathname,useParams } from 'next/navigation';
import axios from 'axios'
import LoginButton from '@/components/ui/loginButton'


const Navbar: React.FC = () => {
  const params = useParams();
  const userId = params.userId as string;
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>('User');
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/auth/logout')
      window.location.replace('/login')
    }
    catch (error) {
      console.log(error);
    }
  };

  const isLoginPage = pathname === '/' || pathname === '/login';

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

  useEffect(() => {
    
    const fetchProfileName = async () => {
      try {
        // const userId = sessionStorage.getItem('userId');
        const res = await axios.get(`/api/get/one-user?userId=${userId}`); // Adjust the endpoint as needed
        setUserName(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
      
    };

    fetchProfileName();

    const fetchProfilePic = async () => {

      try {
        // const userId = sessionStorage.getItem('userId');
        const res = await axios.get(`/api/get/one-user?userId=${userId}`); // Adjust the endpoint as needed
        setProfilePicUrl(res.data);

        console.log(res.data);
      } catch (error) {
        console.log(error);
      }

    };

    fetchProfilePic();

    
  }, []);

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
                <p className='hidden sm:block'>Hi! {`${userName.first_name}`}</p>
                <div
                  className="border border-gray-500 text-xs h-8 w-8 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img src={profilePicUrl} alt="pfp" className="h-full w-full rounded-full object-cover" />
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl shadow-lg">
                  <ul className="list-none p-2">
                    {/* <li className="p-2 text-sm hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer"><Link href='/admin/dashboard'>Dashboard</Link></li> */}
                    {/* <li className="p-2 text-sm hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer">Profile</li> */}
                    <li className="text-sm cursor-pointer">
                      <button className='text-red-500 hover:text-red-600 p-2 rounded-xl' onClick={handleLogout}>Log Out</button>
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
