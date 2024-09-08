// app/student/layout.tsx
import React from 'react';
import AdminLayout from '@/components/Sidebar/adminlayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
