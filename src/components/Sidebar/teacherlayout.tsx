// app/student/layout.tsx
import React from 'react';
import Sidebar from '@/components/Sidebar/teachersidebar';

const teacherlayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      <div className="lg:w-1/6 "> {/* Adjust width for the sidebar */}
        <Sidebar />
      </div>
      <div className="lg:w-5/6 w-full"> {/* Adjust width for the content */}
        {children}
      </div>
    </div>
  );
};

export default teacherlayout;
