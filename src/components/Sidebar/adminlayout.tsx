// app/student/layout.tsx
import React from 'react';
import Sidebar from '@/components/Sidebar/adminsidebar';

const adminlayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
    <div className="lg:w-1/6 md:w-1/6"> {/* Adjust width for the sidebar */}
      <Sidebar />
    </div>
    <div className="w-full lg:w-5/6 md:w-5/6"> {/* Adjust width for the content */}
      {children}
    </div>
  </div>
  );
};

export default adminlayout;
