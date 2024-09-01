"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { BsSun, BsMoon } from 'react-icons/bs'
import LogoutButton from '@/components/ui/logoutButton'
import { ModeToggle } from '../Theme/toggleTheme'
import { useRouter } from 'next/navigation'

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  }

  // const toggleDarkMode = () => {
  //   setIsDarkMode(prevMode => {
  //     const newMode = !prevMode;
  //     if (newMode) {
  //       document.body.classList.add('dark');
  //     } else {
  //       document.body.classList.remove('dark');
  //     }
  //     return newMode;
  //   });
  // };

  return (
    <nav className="dark:bg-gray-800 p-4  bg-gray-100 text-black dark:text-white w-full z-10 top-0 font-rubik" style={{ cursor: 'default' }}>
      <div className="mx-auto text-center flex w-5/6 justify-between font-bold text-black dark:text-white">

        <div className="text-3xl space-x-1 flex items-center sm:text-2xl font-extrabold">
          Moodle
        </div>

        <div className="hidden sm:flex lg:space-x-10 items-center gap-6 text-md font-semibold">
          <Link href="/student/dashboard" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200" >Dashboard</Link>
          <Link href="#about" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200">About</Link>
          <Link href="#contact" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200">Contact</Link>
          <Link href="#notifications" className="hover:text-gray-500 dark:hover:text-gray-300 text-black dark:text-gray-200">Notifications</Link>
          {/* <Link
            href="#"
            onClick={toggleDarkMode}

            className={`transition ease-in-out duration-300 rounded-md  ${isDarkMode ? 'text-gray-200' : 'text-black'}`}
          >
            {isDarkMode ? <BsSun className='text-xl' /> : <BsMoon className='text-xl' />}
          </Link> */}
          <ModeToggle />
          <LogoutButton />
        </div>

        <div className="sm:hidden">
          <button onClick={toggleMobileMenu} className="text-3xl focus:outline-none">
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`sm:hidden fixed top-0 z-50 left-0 w-full h-full dark:bg-gray-800 dark:text-white text-black bg-gray-100 text-center ${isMobileMenuOpen ? 'flex flex-col items-center justify-center' : 'hidden'}`}>
          <button onClick={closeMobileMenu} className="text-3xl absolute top-10 right-10 focus:outline-none text-black dark:text-white">
            ✕
          </button>
          <ul className="font-medium text-2xl space-y-4">
            <li>
              <Link href="#dashboard" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>Dashboard</Link>
            </li>
            <li>
              <Link href="#about" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>About</Link>
            </li>
            <li>
              <Link href="#contact" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>Contact</Link>
            </li>
            <li >
              <Link href="#notifications" className="block p-4 text-center text-black dark:text-gray-200" onClick={closeMobileMenu}>Notifications</Link>
            </li>
            <li className=' flex justify-center'>
              {/* <Link
                href="#"
                onClick={toggleDarkMode}

                className={`transition ease-in-out duration-300 rounded-md  ${isDarkMode ? 'text-gray-200' : 'text-black'}`}
              >
                {isDarkMode ? <BsSun className='text-xl' /> : <BsMoon className='text-xl' />}
              </Link> */}
              <ModeToggle />

            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
