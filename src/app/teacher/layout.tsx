// app/student/layout.tsx
import React from 'react';
import TeacherLayout from '@/components/Sidebar/teacherlayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherLayout>
      {children}
    </TeacherLayout>
  );
}
