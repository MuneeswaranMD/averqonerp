'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home, Calendar, CreditCard, Award, BookOpen,
  Activity, MapPin, Users, LogOut, Zap, Search,
  GraduationCap, Bus, BarChart3, Settings, Wallet,
  ClipboardCheck, Bell, HelpCircle, User, FileText,
  Truck, Shield, LayoutDashboard, UserCheck, BookMarked,
  Megaphone, ChevronDown, ChevronRight, AlertTriangle, Layers
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  schoolId: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  children?: { label: string; href: string }[];
}

const navConfig: Record<string, NavItem[]> = {
  STUDENT: [
    { label: 'Dashboard', href: '/dashboard/student', icon: Home },
    { label: 'My Profile', href: '/dashboard/student/profile', icon: User, children: [
      { label: 'Personal Details', href: '/dashboard/student/profile' },
      { label: 'Academic Information', href: '/dashboard/student/profile/academic' },
      { label: 'Documents', href: '/dashboard/student/profile/documents' },
    ]},
    { label: 'Attendance', href: '/dashboard/attendance', icon: Calendar, children: [
      { label: 'Daily Attendance', href: '/dashboard/attendance' },
      { label: 'Monthly Report', href: '/dashboard/student/attendance/report' },
    ]},
    { label: 'Academics', href: '/dashboard/student/academics', icon: BookOpen, children: [
      { label: 'Subjects', href: '/dashboard/student/academics/subjects' },
      { label: 'Timetable', href: '/dashboard/student/academics/timetable' },
      { label: 'Study Materials', href: '/dashboard/student/academics/materials' },
    ]},
    { label: 'Assignments', href: '/dashboard/lms', icon: ClipboardCheck, children: [
      { label: 'Pending', href: '/dashboard/lms' },
      { label: 'Submitted', href: '/dashboard/student/assignments/submitted' },
      { label: 'Grades', href: '/dashboard/student/assignments/grades' },
    ]},
    { label: 'Exams', href: '/dashboard/exams/results', icon: Award, children: [
      { label: 'Exam Schedule', href: '/dashboard/student/exams/schedule' },
      { label: 'Results', href: '/dashboard/exams/results' },
      { label: 'Report Cards', href: '/dashboard/student/exams/report-cards' },
    ]},
    { label: 'Fees', href: '/dashboard/fees', icon: Wallet, children: [
      { label: 'Fee Details', href: '/dashboard/fees' },
      { label: 'Payment History', href: '/dashboard/student/fees/history' },
      { label: 'Download Receipts', href: '/dashboard/student/fees/receipts' },
    ]},
    { label: 'Transport', href: '/dashboard/transport', icon: Bus, children: [
      { label: 'Bus Tracking', href: '/dashboard/transport' },
      { label: 'Route Details', href: '/dashboard/student/transport/route' },
      { label: 'Pickup Timing', href: '/dashboard/student/transport/timing' },
    ]},
    { label: 'Notifications', href: '/dashboard/student/notifications', icon: Bell },
    { label: 'Help & Support', href: '/dashboard/student/help', icon: HelpCircle },
  ],

  TEACHER: [
    { label: 'Dashboard', href: '/dashboard/teacher', icon: Home },
    { label: 'My Profile', href: '/dashboard/teacher/profile', icon: User },
    { label: 'Attendance', href: '/dashboard/attendance/mark', icon: Calendar, children: [
      { label: 'Mark Attendance', href: '/dashboard/attendance/mark' },
      { label: 'Attendance Reports', href: '/dashboard/teacher/attendance/reports' },
      { label: 'Student Absentees', href: '/dashboard/teacher/attendance/absentees' },
    ]},
    { label: 'Classes', href: '/dashboard/teacher/classes', icon: BookOpen, children: [
      { label: 'My Classes', href: '/dashboard/teacher/classes' },
      { label: 'Subjects', href: '/dashboard/teacher/classes/subjects' },
      { label: 'Timetable', href: '/dashboard/teacher/classes/timetable' },
    ]},
    { label: 'Students', href: '/dashboard/teacher/students', icon: GraduationCap, children: [
      { label: 'Student List', href: '/dashboard/teacher/students' },
      { label: 'Student Performance', href: '/dashboard/teacher/students/performance' },
      { label: 'Parent Information', href: '/dashboard/teacher/students/parents' },
    ]},
    { label: 'Assignments', href: '/dashboard/teacher/assignments', icon: ClipboardCheck, children: [
      { label: 'Create Assignment', href: '/dashboard/teacher/assignments/create' },
      { label: 'Review Submissions', href: '/dashboard/teacher/assignments/review' },
      { label: 'Grades', href: '/dashboard/teacher/assignments/grades' },
    ]},
    { label: 'Exams', href: '/dashboard/teacher/exams', icon: Award, children: [
      { label: 'Exam Schedule', href: '/dashboard/teacher/exams/schedule' },
      { label: 'Marks Entry', href: '/dashboard/teacher/exams/marks' },
      { label: 'Publish Results', href: '/dashboard/teacher/exams/results' },
    ]},
    { label: 'LMS', href: '/dashboard/teacher/lms', icon: BookMarked, children: [
      { label: 'Courses', href: '/dashboard/teacher/lms/courses' },
      { label: 'Learning Materials', href: '/dashboard/teacher/lms/materials' },
      { label: 'Quizzes', href: '/dashboard/teacher/lms/quizzes' },
    ]},
    { label: 'Communication', href: '/dashboard/teacher/communication', icon: Megaphone, children: [
      { label: 'Parent Messages', href: '/dashboard/teacher/communication/parents' },
      { label: 'Announcements', href: '/dashboard/teacher/communication/announcements' },
      { label: 'Circulars', href: '/dashboard/teacher/communication/circulars' },
    ]},
    { label: 'Leave Management', href: '/dashboard/teacher/leave', icon: FileText },
  ],

  TRANSPORT_MANAGER: [
    { label: 'Dashboard', href: '/dashboard/transport', icon: Home },
    { label: 'Vehicle Management', href: '/dashboard/transport/vehicles', icon: Bus, children: [
      { label: 'Vehicle List', href: '/dashboard/transport/vehicles' },
      { label: 'Add Vehicle', href: '/dashboard/transport/vehicles/add' },
      { label: 'Insurance', href: '/dashboard/transport/vehicles/insurance' },
      { label: 'Maintenance', href: '/dashboard/transport/vehicles/maintenance' },
    ]},
    { label: 'Route Management', href: '/dashboard/transport', icon: MapPin, children: [
      { label: 'Routes', href: '/dashboard/transport' },
      { label: 'Stops', href: '/dashboard/transport/stops' },
      { label: 'Route Allocation', href: '/dashboard/transport/allocation' },
    ]},
    { label: 'Driver Management', href: '/dashboard/transport/drivers', icon: UserCheck, children: [
      { label: 'Drivers', href: '/dashboard/transport/drivers' },
      { label: 'License Details', href: '/dashboard/transport/drivers/licenses' },
      { label: 'Attendance', href: '/dashboard/transport/drivers/attendance' },
    ]},
    { label: 'Student Transport', href: '/dashboard/transport/students', icon: GraduationCap, children: [
      { label: 'Assigned Students', href: '/dashboard/transport/students' },
      { label: 'Pickup Points', href: '/dashboard/transport/students/pickup' },
      { label: 'Fee Details', href: '/dashboard/transport/students/fees' },
    ]},
    { label: 'Live Tracking', href: '/dashboard/transport/tracking', icon: Activity, children: [
      { label: 'GPS Tracking', href: '/dashboard/transport/tracking' },
      { label: 'Vehicle Location', href: '/dashboard/transport/tracking/location' },
      { label: 'Trip Monitoring', href: '/dashboard/transport/tracking/trips' },
    ]},
    { label: 'Alerts', href: '/dashboard/transport/alerts', icon: AlertTriangle, children: [
      { label: 'Delayed Bus', href: '/dashboard/transport/alerts/delayed' },
      { label: 'Emergency Alerts', href: '/dashboard/transport/alerts/emergency' },
      { label: 'Maintenance Alerts', href: '/dashboard/transport/alerts/maintenance' },
    ]},
    { label: 'Reports', href: '/dashboard/transport/reports', icon: BarChart3, children: [
      { label: 'Route Reports', href: '/dashboard/transport/reports/routes' },
      { label: 'Driver Reports', href: '/dashboard/transport/reports/drivers' },
      { label: 'Fuel Reports', href: '/dashboard/transport/reports/fuel' },
      { label: 'Vehicle Reports', href: '/dashboard/transport/reports/vehicles' },
    ]},
    { label: 'Settings', href: '/dashboard/settings/access-control', icon: Settings },
  ],

  DRIVER: [
    { label: 'Dashboard', href: '/dashboard/transport/driver', icon: Home },
    { label: "Today's Route", href: '/dashboard/transport/driver', icon: MapPin },
    { label: 'Student Pickup', href: '/dashboard/transport/driver', icon: Users, children: [
      { label: 'Pickup List', href: '/dashboard/transport/driver' },
      { label: 'Mark Pickup', href: '/dashboard/transport/driver' },
    ]},
    { label: 'Student Drop', href: '/dashboard/transport/driver', icon: GraduationCap, children: [
      { label: 'Drop List', href: '/dashboard/transport/driver' },
      { label: 'Mark Drop', href: '/dashboard/transport/driver' },
    ]},
    { label: 'Live Trip', href: '/dashboard/transport/driver', icon: Activity, children: [
      { label: 'Start Trip', href: '/dashboard/transport/driver' },
      { label: 'End Trip', href: '/dashboard/transport/driver' },
      { label: 'GPS Status', href: '/dashboard/transport/driver' },
    ]},
    { label: 'Emergency Alert', href: '/dashboard/transport/driver', icon: AlertTriangle },
    { label: 'Vehicle Inspection', href: '/dashboard/transport/driver', icon: Bus },
    { label: 'My Profile', href: '/dashboard/transport/driver', icon: User },
  ],

  SCHOOL_ADMIN: [
    { label: 'Dashboard', href: '/dashboard/school', icon: Home },
    { label: 'Admissions', href: '/dashboard/admission', icon: FileText },
    { label: 'Students', href: '/dashboard/school/students', icon: GraduationCap },
    { label: 'Staff', href: '/dashboard/school/staff', icon: Users },
    { label: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
    { label: 'Fees', href: '/dashboard/fees', icon: Wallet },
    { label: 'Accounting', href: '/dashboard/accounting', icon: Activity },
    { label: 'Exams', href: '/dashboard/exams/marks', icon: Award },
    { label: 'LMS', href: '/dashboard/lms', icon: BookOpen },
    { label: 'Transport', href: '/dashboard/transport', icon: Bus },
    { label: 'Reports', href: '/dashboard/school/reports', icon: BarChart3 },
    { label: 'Communication', href: '/dashboard/school/communication', icon: Megaphone },
    { label: 'Roles & Permissions', href: '/dashboard/settings?s=roles', icon: Shield },
    { label: 'School Settings', href: '/dashboard/settings?s=school', icon: Settings },
    { label: 'Academic Year', href: '/dashboard/settings?s=academic', icon: Calendar },
    { label: 'User Management', href: '/dashboard/settings?s=users', icon: Users },
    { label: 'Classes & Sections', href: '/dashboard/settings?s=classes', icon: Layers },
    { label: 'Subjects', href: '/dashboard/settings?s=subjects', icon: BookOpen },
    { label: 'Departments', href: '/dashboard/settings?s=departments', icon: LayoutDashboard },
    { label: 'Audit Logs', href: '/dashboard/settings?s=audit', icon: FileText },
    { label: 'Notifications', href: '/dashboard/settings?s=notifications', icon: Bell },
    { label: 'Integrations', href: '/dashboard/settings?s=integrations', icon: Megaphone },
    { label: 'Support', href: '/dashboard/settings?s=support', icon: HelpCircle },
  ],

  PRINCIPAL: [
    { label: 'Dashboard', href: '/dashboard/school', icon: Home },
    { label: 'Admissions', href: '/dashboard/admission', icon: FileText },
    { label: 'Students', href: '/dashboard/school/students', icon: GraduationCap },
    { label: 'Staff', href: '/dashboard/school/staff', icon: Users },
    { label: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
    { label: 'Fees', href: '/dashboard/fees', icon: Wallet },
    { label: 'Exams', href: '/dashboard/exams/marks', icon: Award },
    { label: 'LMS', href: '/dashboard/lms', icon: BookOpen },
    { label: 'Transport', href: '/dashboard/transport', icon: Bus },
    { label: 'Reports', href: '/dashboard/school/reports', icon: BarChart3 },
    { label: 'Access Control', href: '/dashboard/settings/access-control', icon: Shield },
  ],

  SUPER_ADMIN: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: Home },
    { label: 'Schools', href: '/dashboard/admin/schools', icon: GraduationCap, children: [
      { label: 'All Schools', href: '/dashboard/admin/schools' },
      { label: 'Add School', href: '/dashboard/admin/schools/add' },
      { label: 'School Details', href: '/dashboard/admin/schools/details' },
      { label: 'Subscription Status', href: '/dashboard/admin/schools/subscription' },
      { label: 'School Analytics', href: '/dashboard/admin/schools/analytics' },
    ]},
    { label: 'Users', href: '/dashboard/admin/users', icon: Users, children: [
      { label: 'School Admins', href: '/dashboard/admin/users/admins' },
      { label: 'Teachers', href: '/dashboard/admin/users/teachers' },
      { label: 'Accountants', href: '/dashboard/admin/users/accountants' },
      { label: 'Parents', href: '/dashboard/admin/users/parents' },
      { label: 'Students', href: '/dashboard/admin/users/students' },
      { label: 'Transport Staff', href: '/dashboard/admin/users/transport' },
    ]},
    { label: 'Subscriptions', href: '/dashboard/admin/subscriptions', icon: CreditCard, children: [
      { label: 'Plans', href: '/dashboard/admin/subscriptions/plans' },
      { label: 'Active Schools', href: '/dashboard/admin/subscriptions/active' },
      { label: 'Expiring Plans', href: '/dashboard/admin/subscriptions/expiring' },
      { label: 'Payments', href: '/dashboard/admin/subscriptions/payments' },
    ]},
    { label: 'Revenue', href: '/dashboard/admin/revenue', icon: BarChart3, children: [
      { label: 'Monthly Revenue', href: '/dashboard/admin/revenue/monthly' },
      { label: 'School Payments', href: '/dashboard/admin/revenue/payments' },
      { label: 'Invoices', href: '/dashboard/admin/revenue/invoices' },
      { label: 'Financial Reports', href: '/dashboard/admin/revenue/reports' },
    ]},
    { label: 'Support', href: '/dashboard/admin/support', icon: HelpCircle, children: [
      { label: 'Open Tickets', href: '/dashboard/admin/support/open' },
      { label: 'Resolved Tickets', href: '/dashboard/admin/support/resolved' },
      { label: 'Live Chat', href: '/dashboard/admin/support/chat' },
      { label: 'Documentation', href: '/dashboard/admin/support/docs' },
    ]},
    { label: 'Platform Settings', href: '/dashboard/admin/settings', icon: Settings, children: [
      { label: 'Branding', href: '/dashboard/admin/settings/branding' },
      { label: 'Email Settings', href: '/dashboard/admin/settings/email' },
      { label: 'SMS Gateway', href: '/dashboard/admin/settings/sms' },
      { label: 'WhatsApp API', href: '/dashboard/admin/settings/whatsapp' },
      { label: 'Storage', href: '/dashboard/admin/settings/storage' },
      { label: 'Security', href: '/dashboard/admin/settings/security' },
    ]},
    { label: 'Security', href: '/dashboard/admin/security', icon: Shield, children: [
      { label: 'Audit Logs', href: '/dashboard/admin/security/audit' },
      { label: 'Login History', href: '/dashboard/admin/security/login' },
      { label: 'API Logs', href: '/dashboard/admin/security/api' },
      { label: 'Access Control', href: '/dashboard/admin/security/access-control' },
    ]},
  ],

  ACCOUNTANT: [
    { label: 'Dashboard', href: '/dashboard/accounting', icon: Home },
    { label: 'Fee Invoices', href: '/dashboard/fees', icon: CreditCard },
    { label: 'Payments', href: '/dashboard/fees', icon: Wallet },
    { label: 'School Ledger', href: '/dashboard/accounting', icon: Activity },
    { label: 'Reports', href: '/dashboard/school/reports', icon: BarChart3 },
  ],

  PARENT: [
    { label: 'Dashboard', href: '/dashboard/parent', icon: Home },
    { label: 'Child Attendance', href: '/dashboard/attendance', icon: Calendar },
    { label: 'Fee Invoices', href: '/dashboard/fees', icon: CreditCard },
    { label: 'Academic Results', href: '/dashboard/exams/results', icon: Award },
    { label: 'Bus Tracker', href: '/dashboard/transport', icon: Bus },
    { label: 'Notifications', href: '/dashboard/parent', icon: Bell },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] text-[#1A1F36] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin" />
          <span className="text-sm font-medium text-[#4A5568]">Loading workspace...</span>
        </div>
      </div>
    );
  }

  const navItems = navConfig[user.role] || navConfig['STUDENT'];

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1A1F36] flex flex-col font-sans">

      {/* TOP BAR */}
      <header className="h-14 bg-white border-b border-[#E3E5E8] flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Averqon Logo" className="h-full w-full object-contain" />
          </div>
          <span className="text-md font-bold tracking-tight text-[#1A1F36]">
            averqon<span className="text-[#1A6FDB] font-medium">erp</span>
          </span>
        </div>

        <div className="hidden md:flex items-center bg-[#F4F6F9] border border-[#E3E5E8] rounded-md px-3 py-1.5 w-72 gap-2">
          <Search className="h-4 w-4 text-[#8A94A6] shrink-0" />
          <input
            type="text"
            placeholder="Search modules, students..."
            className="bg-transparent border-none text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative h-8 w-8 flex items-center justify-center rounded-md border border-[#E3E5E8] bg-white text-[#8A94A6] hover:bg-[#F4F6F9] transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-[#C62828] rounded-full" />
          </button>
          <div className="flex items-center gap-2 text-[#4A5568] bg-[#F4F6F9] px-2.5 py-1.5 rounded-md border border-[#E3E5E8]">
            <div className="h-6 w-6 rounded-full bg-[#1A6FDB] flex items-center justify-center text-[10px] text-white font-bold uppercase">
              {user.role[0]}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A94A6] leading-none">{user.role.replace('_', ' ')}</div>
              <div className="text-xs font-semibold text-[#1A1F36] mt-0.5 max-w-[140px] truncate">{user.email || user.id}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* SIDEBAR */}
        <aside className="w-full md:w-[220px] bg-[#F4F6F9] border-b md:border-b-0 md:border-r border-[#E3E5E8] shrink-0 flex flex-col justify-between md:sticky md:top-14 md:h-[calc(100vh-56px)] overflow-y-auto">
          <div className="p-3 space-y-0.5">
            <div className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest px-3 py-2 select-none">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.has(item.label);
              const isActiveParent = item.children
                ? item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
                : pathname === item.href || pathname.startsWith(item.href + '/');
              const isActive = !item.children && (pathname === item.href || pathname.startsWith(item.href + '/'));

              if (item.children) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-md text-[12.5px] font-normal transition-all ${
                        isActiveParent
                          ? 'bg-[#E8F0FD] text-[#1A6FDB] font-medium'
                          : 'text-[#4A5568] hover:bg-[#EAECF0] hover:text-[#1A1F36]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`h-[16px] w-[16px] shrink-0 ${isActiveParent ? 'text-[#1A6FDB]' : 'text-[#8A94A6]'}`} />
                        {item.label}
                      </span>
                      {isExpanded
                        ? <ChevronDown className="h-3.5 w-3.5 text-[#8A94A6]" />
                        : <ChevronRight className="h-3.5 w-3.5 text-[#8A94A6]" />
                      }
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 border-l border-[#E3E5E8] pl-2 space-y-0.5">
                        {item.children.map(child => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              className={`flex items-center px-3 py-1.5 rounded-md text-[12px] transition-all ${
                                isChildActive
                                  ? 'text-[#1A6FDB] font-semibold bg-[#E8F0FD]'
                                  : 'text-[#4A5568] hover:bg-[#EAECF0] hover:text-[#1A1F36]'
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[12.5px] font-normal transition-all ${
                    isActive
                      ? 'bg-[#E8F0FD] text-[#1A6FDB] font-medium border-l-[3px] border-[#1A6FDB] rounded-l-none pl-[9px]'
                      : 'text-[#4A5568] hover:bg-[#EAECF0] hover:text-[#1A1F36]'
                  }`}
                >
                  <Icon className={`h-[16px] w-[16px] shrink-0 ${isActive ? 'text-[#1A6FDB]' : 'text-[#8A94A6]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#E3E5E8]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md text-[12.5px] font-medium transition-colors"
            >
              <LogOut className="h-[16px] w-[16px] shrink-0 text-red-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 bg-[#F7F8FA] overflow-y-auto min-h-0">
          <div className="max-w-[1280px] mx-auto p-6 md:p-8 space-y-6">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
