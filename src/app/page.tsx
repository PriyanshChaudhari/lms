import Navbar from "@/components/Navbar/navbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from 'next/link'
import Image from "next/image";
import LMS from "../assets/lms-mainpage.jpg";

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   {/* <Switch>Dark</Switch> */}
    //   <div className="container border-2 border-amber-500 min-h-screen" >LMS</div>
    // </main>

    <div className="flex flex-col min-h-screen">

      <main className="container mx-auto flex-grow p-4">
        {/* Hero Section */}
        <section
          className="bg-cover bg-center text-black dark:text-gray-100 p-16 text-center"
        // style={{ backgroundImage: `url(${LMS})` }} // Add your own image or use a URL
        >
          <h2 className="text-5xl font-bold mb-4">Welcome to LMS Portal</h2>
          <p className="text-xl mb-8">
            Your one-stop solution for online learning and course management.
          </p>
          <Link className="hover:bg-[#1a1a1a] dark:bg-[#212830] dark:bg-slate-200 dark:text-black font-semibold text-white px-8 py-4 rounded-lg-full shadow-md " href='/login'>
            Get Started
          </Link>
        </section>

        {/* Features Section */}
        <section className="p-8">
          <h3 className="text-3xl font-bold mb-4 text-center">Our Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg text-center">
              <div className="mb-4">
              </div>
              <h4 className="text-2xl font-semibold mb-2">Easy Course Management</h4>
              <p>Manage your courses easily with intuitive tools.</p>
            </div>
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg text-center">
              <div className="mb-4">
              </div>
              <h4 className="text-2xl font-semibold mb-2">Hassle free Lessons access</h4>
              <p>Students can easily access multimedia and lessons.</p>
            </div>
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg text-center">
              <div className="mb-4">
              </div>
              <h4 className="text-2xl font-semibold mb-2">24/7 Support</h4>
              <p>Get help whenever you need it, any time of the day.</p>
            </div>
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg text-center">
              <div className="mb-4">
              </div>
              <h4 className="text-2xl font-semibold mb-2">Grading Feature in courses</h4>
              <p>Allow teachers to grade and review the students in respective courses.</p>
            </div>

            {/* Easy File or Content Upload */}
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg text-center">
              <div className="mb-4">
              </div>
              <h4 className="text-2xl font-semibold mb-2">Easy File & Content Upload</h4>
              <p>Upload files and content effortlessly for your courses.</p>
            </div>

            {/* Easy Student Enrollment */}
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg text-center">
              <div className="mb-4">
              </div>
              <h4 className="text-2xl font-semibold mb-2">Easy Student Enrollment</h4>
              <p>Enroll students quickly with a streamlined process.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="p-8 bg-gray-100 dark:dark:bg-[#212830] ml-8 mr-8">
          <h3 className="text-3xl font-bold mb-6 text-center">What Organisations Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg-lg shadow-lg">
              <div className="flex items-center mb-4">
                <h4 className="text-xl font-semibold">Organisation 1</h4>
              </div>
              <p>"LMS is a great tool for online education delivery"</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg-lg shadow-lg">
              <div className="flex items-center mb-4">
                <h4 className="text-xl font-semibold">Organisation 2</h4>
              </div>
              <p>"The courses are well-structured and easy to follow."</p>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg-lg shadow-lg">
              <div className="flex items-center mb-4">
                <h4 className="text-xl font-semibold">Organisation 3</h4>
              </div>
              <p>"The courses are well-structured and easy to follow."</p>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className=" p-8">
          <h3 className="text-3xl font-bold mb-6 text-center">Latest News</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg">
              <h4 className="text-2xl font-semibold mb-2">News 1</h4>
              <p className="text-sm text-gray-600 mb-4">Posted on September 3, 2024</p>
              <p>Stay updated with the latest developments in online learning.</p>
            </div>
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg">
              <h4 className="text-2xl font-semibold mb-2">News 2</h4>
              <p className="text-sm text-gray-600 mb-4">Posted on September 2, 2024</p>
              <p>Discover new features and courses available on LMS.</p>
            </div>
            <div className="bg-white dark:dark:bg-[#212830] p-6 rounded-lg-lg shadow-lg">
              <h4 className="text-2xl font-semibold mb-2">News 3</h4>
              <p className="text-sm text-gray-600 mb-4">Posted on September 1, 2024</p>
              <p>Get notifications about the courses uploaded and their due date.</p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
