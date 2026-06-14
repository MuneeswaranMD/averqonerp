'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar, Award, BookOpen, MapPin, Wallet, Bell,
  HelpCircle, ClipboardCheck, TrendingUp, AlertCircle,
  CheckCircle, FileText, Bus, Clock, BookMarked, User
} from 'lucide-react';

interface StatsData {
  attendancePct: number;
  pendingAssignments: number;
  upcomingExams: number;
  feeDue: boolean;
  feeAmount: number;
}

const quickActions = [
  { label: 'Daily Attendance', sub: 'Check present/absent status', href: '/dashboard/attendance', icon: Calendar, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
  { label: 'Study LMS', sub: 'Access course materials', href: '/dashboard/lms', icon: BookOpen, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
  { label: 'Exam Results', sub: 'View transcript & GPA', href: '/dashboard/exams/results', icon: Award, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
  { label: 'Fee Invoices', sub: 'Payments & receipts', href: '/dashboard/fees', icon: Wallet, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
  { label: 'Bus Tracker', sub: 'Route & pickup timing', href: '/dashboard/transport', icon: Bus, color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]' },
  { label: 'Assignments', sub: 'Pending tasks', href: '/dashboard/lms', icon: ClipboardCheck, color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]' },
];

const upcomingExamsList = [
  { subject: 'Mathematics', date: 'Jun 22, 2026', time: '09:00 AM', type: 'Mid-Term', status: 'upcoming' },
  { subject: 'Physics', date: 'Jun 24, 2026', time: '11:00 AM', type: 'Mid-Term', status: 'upcoming' },
  { subject: 'English', date: 'Jun 26, 2026', time: '02:00 PM', type: 'Unit Test', status: 'upcoming' },
];

const recentAttendance = [
  { date: 'Mon, Jun 9', status: 'PRESENT' },
  { date: 'Tue, Jun 10', status: 'PRESENT' },
  { date: 'Wed, Jun 11', status: 'ABSENT' },
  { date: 'Thu, Jun 12', status: 'PRESENT' },
  { date: 'Fri, Jun 13', status: 'PRESENT' },
];

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    attendancePct: 91.2,
    pendingAssignments: 3,
    upcomingExams: 3,
    feeDue: true,
    feeAmount: 12500,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading || !user) return null;

  const kpiCards = [
    {
      label: 'Attendance Rate',
      value: `${stats.attendancePct}%`,
      sub: 'Last 30 days',
      color: stats.attendancePct >= 85 ? 'text-[#2E7D32]' : 'text-[#C62828]',
      icon: Calendar,
      iconBg: 'bg-[#EDF7ED]',
      iconColor: 'text-[#2E7D32]',
    },
    {
      label: 'Pending Assignments',
      value: stats.pendingAssignments.toString(),
      sub: 'Submissions due soon',
      color: stats.pendingAssignments > 0 ? 'text-[#B45309]' : 'text-[#2E7D32]',
      icon: ClipboardCheck,
      iconBg: 'bg-[#FFF8E6]',
      iconColor: 'text-[#B45309]',
    },
    {
      label: 'Upcoming Exams',
      value: stats.upcomingExams.toString(),
      sub: 'This academic term',
      color: 'text-[#1A6FDB]',
      icon: Award,
      iconBg: 'bg-[#EDF3FF]',
      iconColor: 'text-[#1A6FDB]',
    },
    {
      label: 'Fee Due Status',
      value: stats.feeDue ? `₹${stats.feeAmount.toLocaleString()}` : 'Paid',
      sub: stats.feeDue ? 'Outstanding balance' : 'All clear',
      color: stats.feeDue ? 'text-[#C62828]' : 'text-[#2E7D32]',
      icon: Wallet,
      iconBg: stats.feeDue ? 'bg-[#FEF0F0]' : 'bg-[#EDF7ED]',
      iconColor: stats.feeDue ? 'text-[#C62828]' : 'text-[#2E7D32]',
    },
    {
      label: "Today's Classes",
      value: '5',
      sub: 'Next: Physics 11:00 AM',
      color: 'text-[#1A1F36]',
      icon: BookOpen,
      iconBg: 'bg-[#F4F6F9]',
      iconColor: 'text-[#4A5568]',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Student Dashboard</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › Student Portal</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#EDF3FF] text-[#1A6FDB] text-xs font-semibold uppercase tracking-wider">
            Student
          </span>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="p-5 bg-white border border-[#E3E5E8] rounded-lg flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[#1A1F36]">Good day, Student!</div>
          <div className="text-xs text-[#8A94A6] mt-1">Academic Year 2026–2027 · Grade 10, Section A</div>
          <div className="text-xs text-[#B45309] mt-2 font-medium">⚠ You have {stats.pendingAssignments} pending assignment(s) due this week.</div>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1.5">
          <div className="text-[11px] text-[#8A94A6] font-semibold uppercase tracking-wide">Admission No.</div>
          <div className="text-sm font-mono font-bold text-[#1A1F36]">STU2026001</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-4 border border-[#E3E5E8] bg-white rounded-lg flex flex-col gap-3 hover:border-[#C8CDD5] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider leading-tight">{card.label}</span>
                <div className={`h-7 w-7 rounded-md ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-[10px] text-[#8A94A6]">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-5">

          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="p-4 border border-[#E3E5E8] hover:border-[#1A6FDB] rounded-lg transition-all space-y-2 block hover:bg-[#F7F9FD] group"
                  >
                    <div className={`h-8 w-8 rounded-md ${action.bg} flex items-center justify-center`}>
                      <Icon className={`h-4.5 w-4.5 ${action.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1A1F36] group-hover:text-[#1A6FDB] transition-colors">{action.label}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5">{action.sub}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> Exam Schedule
              </span>
              <Link href="/dashboard/student/exams/schedule" className="text-[11px] text-[#1A6FDB] font-medium hover:underline">View all</Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9]">
                  <th className="p-3 pl-4 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Subject</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Date & Time</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Type</th>
                  <th className="p-3 pr-4 text-right text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E8]">
                {upcomingExamsList.map((exam) => (
                  <tr key={exam.subject} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-3 pl-4 font-semibold text-[#1A1F36]">{exam.subject}</td>
                    <td className="p-3 text-[#4A5568]">{exam.date} · {exam.time}</td>
                    <td className="p-3 text-[#8A94A6]">{exam.type}</td>
                    <td className="p-3 pr-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDF3FF] text-[#1A6FDB] uppercase">Upcoming</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Panel */}
        <div className="space-y-5">

          {/* Attendance Mini Calendar */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Recent Attendance</h3>
            <div className="space-y-2">
              {recentAttendance.map((day) => (
                <div key={day.date} className="flex items-center justify-between text-xs">
                  <span className="text-[#4A5568]">{day.date}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    day.status === 'PRESENT'
                      ? 'bg-[#EDF7ED] text-[#2E7D32]'
                      : 'bg-[#FEF0F0] text-[#C62828]'
                  }`}>
                    {day.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#E3E5E8]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A94A6]">Monthly Rate</span>
                <span className="font-bold text-[#2E7D32]">{stats.attendancePct}%</span>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2 flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 border border-[#FFF8E6] bg-[#FFFDF0] rounded-md">
                <div className="font-semibold text-[#1A1F36]">Mid-Term Calendar Released</div>
                <div className="text-[#8A94A6] mt-0.5">Exams start June 22nd. Check your schedule.</div>
              </div>
              <div className="p-3 border border-[#E3E5E8] bg-[#F4F6F9] rounded-md">
                <div className="font-semibold text-[#1A1F36]">Fee Reminder</div>
                <div className="text-[#8A94A6] mt-0.5">Term fees due by June 30th, 2026.</div>
              </div>
            </div>
          </div>

          {/* Fee Status */}
          {stats.feeDue && (
            <div className="p-4 border border-[#FEF0F0] bg-[#FEF8F8] rounded-lg">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-[#C62828] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#C62828]">Fee Due</div>
                  <div className="text-[11px] text-[#4A5568] mt-0.5">₹{stats.feeAmount.toLocaleString()} outstanding</div>
                  <Link href="/dashboard/fees" className="mt-2 inline-block text-[11px] text-white bg-[#1A6FDB] hover:bg-[#1558B0] px-3 py-1.5 rounded-md font-semibold transition-colors">
                    Pay Now
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
