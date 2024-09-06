// app/student/layout.tsx
import React from 'react';
import StudentLayout from '@/components/Sidebar/studentlayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StudentLayout>
      {children}
    </StudentLayout>
  );
}
