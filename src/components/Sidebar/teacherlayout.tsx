// app/student/layout.tsx
import React from 'react';
import Sidebar from '@/components/Sidebar/teachersidebar';

const teacherlayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      <div className="lg:w-1/6 md:w-1/4">
        <Sidebar />
      </div>
      <div className="lg:w-5/6 w-full md:w-3/4">
        {children}
      </div> 

      {/* <div className="lg:w-1/6 ">
        <Sidebar />
      </div>
      {/* <div className="w-full">
        {children}
      </div> */}
    </div>
  );
};

export default teacherlayout;
