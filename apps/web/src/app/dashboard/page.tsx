'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const roleRoutes: Record<string, string> = {
  SUPER_ADMIN: '/dashboard/admin',
  SCHOOL_ADMIN: '/dashboard/school',
  PRINCIPAL: '/dashboard/school',
  TEACHER: '/dashboard/teacher',
  STUDENT: '/dashboard/student',
  PARENT: '/dashboard/parent',
  DRIVER: '/dashboard/transport/driver',
  TRANSPORT_MANAGER: '/dashboard/transport',
  ACCOUNTANT: '/dashboard/accounting',
  HR_MANAGER: '/dashboard/school',
  LIBRARIAN: '/dashboard/school',
  RECEPTIONIST: '/dashboard/school',
  ATTENDANCE_STAFF: '/dashboard/attendance',
};

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const target = roleRoutes[user.role] || '/dashboard/school';
      router.replace(target);
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin" />
        <span className="text-sm font-medium text-[#4A5568]">Redirecting to your dashboard...</span>
      </div>
    </div>
  );
}
