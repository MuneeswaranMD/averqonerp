'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar, Award, BookOpen, Users, Clock, ClipboardCheck,
  MessageSquare, CheckCircle, AlertCircle, FileText,
  TrendingUp, BookMarked, Megaphone, Upload, Wallet, HelpCircle
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Calendar, Award, BookOpen, Users, Clock, ClipboardCheck,
  MessageSquare, CheckCircle, AlertCircle, FileText,
  TrendingUp, BookMarked, Megaphone, Upload, Wallet
};

const defaultClasses = [
  { time: '08:30 AM', class: 'Grade 10 - A', subject: 'Mathematics', room: 'Room 201', done: true },
  { time: '10:00 AM', class: 'Grade 9 - B', subject: 'Physics', room: 'Room 105', done: true },
  { time: '11:30 AM', class: 'Grade 10 - B', subject: 'Mathematics', room: 'Room 203', done: false },
  { time: '02:00 PM', class: 'Grade 8 - A', subject: 'Algebra', room: 'Room 108', done: false },
  { time: '03:30 PM', class: 'Grade 10 - A', subject: 'Statistics', room: 'Room 201', done: false },
];

const defaultKPIs = [
  { label: 'Classes Today', value: '5', sub: 'Next: Math 11:30 AM', color: 'text-[#1A1F36]', iconBg: 'bg-[#EDF3FF]', iconColor: 'text-[#1A6FDB]', icon: 'BookOpen' },
  { label: 'Attendance Pending', value: '3', sub: 'Classes not yet marked', color: 'text-[#B45309]', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]', icon: 'Calendar' },
  { label: 'Assignments to Review', value: '12', sub: 'Submissions awaiting', color: 'text-[#C62828]', iconBg: 'bg-[#FEF0F0]', iconColor: 'text-[#C62828]', icon: 'ClipboardCheck' },
  { label: 'Upcoming Exams', value: '2', sub: 'This week', color: 'text-[#7C3AED]', iconBg: 'bg-[#F3EEFF]', iconColor: 'text-[#7C3AED]', icon: 'Award' },
];

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      fetchStats(u);
    }
  }, []);

  const fetchStats = async (currentUser: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const res = await fetch('http://localhost:3001/api/v1/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-id': currentUser.schoolId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard statistics', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const kpiCards = stats?.kpiCards || defaultKPIs;
  const todayClasses = stats?.todayClasses || defaultClasses;
  const assignmentsReview = stats?.assignmentsReview || [];
  const classAttendanceOverview = stats?.classAttendanceOverview || [
    { class: 'Grade 10-A', pct: 94, count: 38 },
    { class: 'Grade 9-B', pct: 88, count: 35 },
    { class: 'Grade 10-B', pct: 91, count: 40 },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Teacher Console</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › Staff Portal · Academic Instructor</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#EDF3FF] text-[#1A6FDB] text-xs font-semibold uppercase tracking-wider">
          Teacher
        </span>
      </div>

      {/* Welcome */}
      <div className="p-5 bg-white border border-[#E3E5E8] rounded-lg flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-[#1A1F36]">Good morning! Here is your school dashboard.</div>
          <div className="text-xs text-[#8A94A6] mt-1">Academic Year 2026–2027 · Green Valley International School</div>
          {todayClasses.filter((c: any) => !c.done).length > 0 && (
            <div className="text-xs text-[#B45309] mt-2 font-medium">
              ⚠ You have {todayClasses.filter((c: any) => !c.done).length} upcoming classes scheduled today.
            </div>
          )}
        </div>
        <div className="hidden md:flex gap-3">
          <Link
            href="/dashboard/attendance/mark"
            className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" /> Mark Attendance
          </Link>
          <Link
            href="/dashboard/exams/marks"
            className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Award className="h-3.5 w-3.5" /> Enter Marks
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpiCards.map((card: any) => {
          const Icon = iconMap[card.icon] || HelpCircle;
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

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-5">

          {/* Today's Classes Timetable */}
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Today's Class Schedule
              </span>
              <Link href="/dashboard/teacher/classes/timetable" className="text-[11px] text-[#1A6FDB] font-medium hover:underline">Full timetable</Link>
            </div>
            <div className="divide-y divide-[#E3E5E8]">
              {todayClasses.map((cls: any, index: number) => (
                <div key={index} className={`flex items-center justify-between px-4 py-3 hover:bg-[#F7F8FA] transition-colors ${cls.done ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-md flex items-center justify-center ${cls.done ? 'bg-[#EDF7ED]' : 'bg-[#EDF3FF]'}`}>
                      {cls.done
                        ? <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                        : <BookOpen className="h-4 w-4 text-[#1A6FDB]" />
                      }
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1A1F36]">{cls.subject} — {cls.class}</div>
                      <div className="text-[10px] text-[#8A94A6]">{cls.room}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-[#4A5568]">{cls.time}</div>
                    <span className={`text-[10px] font-bold uppercase ${cls.done ? 'text-[#2E7D32]' : 'text-[#1A6FDB]'}`}>
                      {cls.done ? 'Done' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Review Queue */}
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardCheck className="h-3.5 w-3.5" /> Assignment Review Queue
              </span>
              <Link href="/dashboard/teacher/assignments/review" className="text-[11px] text-[#1A6FDB] font-medium hover:underline">View all</Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9]">
                  <th className="p-3 pl-4 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Student</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Course</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Assignment</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Submitted</th>
                  <th className="p-3 pr-4 text-right text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E8]">
                {assignmentsReview.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[#8A94A6]">No pending assignment reviews.</td>
                  </tr>
                ) : (
                  assignmentsReview.map((a: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="p-3 pl-4 font-semibold text-[#1A1F36]">{a.student}</td>
                      <td className="p-3 text-[#4A5568]">{a.class}</td>
                      <td className="p-3 text-[#4A5568]">{a.subject}</td>
                      <td className="p-3 text-[#8A94A6]">{a.submitted}</td>
                      <td className="p-3 pr-4 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          a.status === 'SUBMITTED' || a.status === 'PENDING'
                            ? 'bg-[#FFF8E6] text-[#B45309]'
                            : 'bg-[#EDF7ED] text-[#2E7D32]'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Sidebar Panel */}
        <div className="space-y-5">

          {/* Quick Actions Panel */}
          {user?.role && ['TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'].includes(user.role) && (() => {
            const allowedTools = [
              { label: 'Upload Learning Materials', href: '/dashboard/teacher/lms/materials', icon: Upload, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]', roles: ['TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'] },
              { label: 'Mark Attendance', href: '/dashboard/attendance/mark', icon: Calendar, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]', roles: ['TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'] },
              { label: 'Enter Marks', href: '/dashboard/exams/marks', icon: Award, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]', roles: ['TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'] },
              { label: 'Create Assignments', href: '/dashboard/lms', icon: ClipboardCheck, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]', roles: ['TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN'] },
              { label: 'View Student Fee Status', href: '/dashboard/teacher/students/fees', icon: Wallet, color: 'text-[#4A5568]', bg: 'bg-[#F4F6F9]', roles: ['TEACHER', 'PRINCIPAL', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'ACCOUNTANT'] },
            ].filter((tool) => tool.roles.includes(user.role));

            return (
              <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
                <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Quick Actions</h3>
                <div className="space-y-2">
                  {allowedTools.length === 0 ? (
                    <div className="p-4 bg-[#F4F6F9] border border-[#E3E5E8] rounded-md text-center flex flex-col items-center justify-center gap-1">
                      <AlertCircle className="h-4 w-4 text-[#8A94A6]" />
                      <span className="text-[11px] font-semibold text-[#8A94A6]">No quick actions authorized</span>
                    </div>
                  ) : (
                    allowedTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.label}
                          href={tool.href}
                          className="flex items-center gap-3 p-3 border border-[#E3E5E8] rounded-md hover:border-[#1A6FDB] hover:bg-[#F7F9FD] transition-all text-xs font-medium text-[#1A1F36]"
                        >
                          <div className={`h-7 w-7 rounded-md ${tool.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`h-4 w-4 ${tool.color}`} />
                          </div>
                          {tool.label}
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })()}

          {/* Class Attendance Overview */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Class Attendance Overview
            </h3>
            <div className="space-y-2 text-xs">
              {classAttendanceOverview.map((cls: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A5568] font-medium">{cls.class}</span>
                    <span className={`font-bold ${cls.pct >= 90 ? 'text-[#2E7D32]' : 'text-[#B45309]'}`}>{cls.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#E3E5E8] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cls.pct >= 90 ? 'bg-[#2E7D32]' : 'bg-[#B45309]'}`}
                      style={{ width: `${cls.pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#8A94A6]">{cls.count} students</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
