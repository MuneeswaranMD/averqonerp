'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Users, Wallet, Calendar, Bus, Award,
  Activity, FileText, Megaphone, Settings, BarChart3,
  TrendingUp, AlertTriangle, CheckCircle, Clock, HelpCircle
} from 'lucide-react';

const iconMap: Record<string, any> = {
  GraduationCap, Users, Wallet, Calendar, Bus, Award,
  Activity, FileText, Megaphone, Settings, BarChart3,
  TrendingUp, AlertTriangle, CheckCircle, Clock, HelpCircle
};

const defaultKpiData = [
  { label: 'Total Students', value: '210', change: 'Green Valley active enrollments', color: 'text-[#1A1F36]', icon: 'GraduationCap', iconBg: 'bg-[#EDF3FF]', iconColor: 'text-[#1A6FDB]' },
  { label: 'Total Staff', value: '28', change: 'Academic & administrative staff', color: 'text-[#1A1F36]', icon: 'Users', iconBg: 'bg-[#EDF7ED]', iconColor: 'text-[#2E7D32]' },
  { label: 'Fee Collection', value: '₹8.4L', change: '82% of target', color: 'text-[#2E7D32]', icon: 'Wallet', iconBg: 'bg-[#F3EEFF]', iconColor: 'text-[#7C3AED]' },
  { label: 'Attendance %', value: '94.2%', change: 'Average student attendance', color: 'text-[#2E7D32]', icon: 'Calendar', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]' },
  { label: 'Active Vehicles', value: '10', change: 'Seeded transport routes', color: 'text-[#1A1F36]', icon: 'Bus', iconBg: 'bg-[#FEF0F0]', iconColor: 'text-[#C62828]' },
  { label: 'Upcoming Exams', value: '6', change: 'Scheduled in academic calendar', color: 'text-[#7C3AED]', icon: 'Award', iconBg: 'bg-[#F3EEFF]', iconColor: 'text-[#7C3AED]' },
  { label: 'New Admissions', value: '50', change: 'Applications pending review', color: 'text-[#B45309]', icon: 'FileText', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]' },
  { label: 'Operational Expenses', value: '₹2.1L', change: 'Total recorded school expenses', color: 'text-[#B45309]', icon: 'TrendingUp', iconBg: 'bg-[#EDF7ED]', iconColor: 'text-[#2E7D32]' },
];

const defaultRecentActivities = [
  { action: 'Admissions generated', actor: 'System seed — Green Valley', time: '10 min ago', type: 'success' },
  { action: 'Fee invoices generated', actor: 'Batch Q1 2026 — 210 students', time: '1 hr ago', type: 'info' },
  { action: 'Attendance records marked', actor: 'All 36 sections', time: '2 hrs ago', type: 'success' },
  { action: 'Exam marks published', actor: 'Midterm Science Class 10', time: '3 hrs ago', type: 'warning' },
];

const quickModules = [
  { label: 'Admissions', href: '/dashboard/admission', icon: FileText, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]', desc: 'Manage intake queue' },
  { label: 'Fee Invoices', href: '/dashboard/fees', icon: Wallet, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]', desc: 'Payments & invoicing' },
  { label: 'Attendance', href: '/dashboard/attendance', icon: Calendar, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]', desc: 'Daily register' },
  { label: 'Exams', href: '/dashboard/exams/marks', icon: Award, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]', desc: 'Marks & approvals' },
  { label: 'Accounting', href: '/dashboard/accounting', icon: Activity, color: 'text-[#1A1F36]', bg: 'bg-[#F4F6F9]', desc: 'Ledger & expenses' },
  { label: 'Transport', href: '/dashboard/transport', icon: Bus, color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]', desc: 'Routes & tracking' },
  { label: 'Reports', href: '/dashboard/school/reports', icon: BarChart3, color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]', desc: 'Analytics & reports' },
  { label: 'Access Control', href: '/dashboard/settings/access-control', icon: Settings, color: 'text-[#4A5568]', bg: 'bg-[#F4F6F9]', desc: 'Roles & audit logs' },
];

export default function SchoolAdminDashboard() {
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

  const kpis = stats?.kpiData || defaultKpiData;
  const activities = stats?.recentActivities || defaultRecentActivities;
  const financialSummary = stats?.financialSummary || [
    { label: 'Total Fee Invoiced', value: '₹14,70,000', color: 'text-[#1A1F36]' },
    { label: 'Total Fee Collected', value: '₹8,40,000', color: 'text-[#2E7D32]' },
    { label: 'Outstanding Fee', value: '₹6,30,000', color: 'text-[#C62828]' },
    { label: 'Operational Expenses', value: '₹2,10,000', color: 'text-[#B45309]' }
  ];
  const pendingActions = stats?.pendingActions || [
    { label: '50 Admissions to review', href: '/dashboard/admission', urgent: true },
    { label: 'Mid-Term results approval', href: '/dashboard/settings/access-control', urgent: true },
    { label: 'Fee invoices outstanding', href: '/dashboard/fees', urgent: false },
    { label: '10 Active transport routes', href: '/dashboard/transport', urgent: false }
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Green Valley International School Dashboard</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › School Admin Console</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#EDF3FF] text-[#1A6FDB] text-xs font-semibold uppercase tracking-wider">
          {user.role.replace('_', ' ')}
        </span>
      </div>

      {/* Alert Bar */}
      <div className="p-4 bg-[#FFF8E6] border border-[#F5E6C0] rounded-lg flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-[#B45309] shrink-0" />
        <div className="text-xs text-[#B45309] font-medium">
          {pendingActions[0]?.label || 'Pending admissions'} require review · Verification of academic structures completed
        </div>
        <Link href="/dashboard/admission" className="ml-auto text-xs text-[#1A6FDB] font-semibold hover:underline shrink-0">
          Review Now →
        </Link>
      </div>

      {/* KPI Cards - 4 per row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((card: any) => {
          const Icon = iconMap[card.icon] || HelpCircle;
          return (
            <div key={card.label} className="p-4 border border-[#E3E5E8] bg-white rounded-lg flex flex-col gap-2.5 hover:border-[#C8CDD5] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider leading-tight">{card.label}</span>
                <div className={`h-7 w-7 rounded-md ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-[10px] text-[#8A94A6]">{card.change}</div>
            </div>
          );
        })}
      </div>

      {/* Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-5">

          {/* Module Quick Access Grid */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">All Modules</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickModules.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.label}
                    href={m.href}
                    className="p-4 border border-[#E3E5E8] hover:border-[#1A6FDB] rounded-lg transition-all space-y-2 block hover:bg-[#F7F9FD] group"
                  >
                    <div className={`h-8 w-8 rounded-md ${m.bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1A1F36] group-hover:text-[#1A6FDB] transition-colors">{m.label}</div>
                      <div className="text-[10px] text-[#8A94A6]">{m.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9]">
              <span className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Recent Activity Log
              </span>
            </div>
            <div className="divide-y divide-[#E3E5E8]">
              {activities.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8A94A6]">No recent activities found.</div>
              ) : (
                activities.map((act: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 px-4 py-3 hover:bg-[#F7F8FA] transition-colors">
                    <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                      act.type === 'success' ? 'bg-[#2E7D32]' :
                      act.type === 'warning' ? 'bg-[#B45309]' : 'bg-[#1A6FDB]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1A1F36]">{act.action}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5">{act.actor}</div>
                    </div>
                    <div className="text-[10px] text-[#8A94A6] shrink-0">{act.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Panel */}
        <div className="space-y-5">

          {/* Financial Summary */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Financial Overview</h3>
            <div className="space-y-3 text-xs">
              {financialSummary.map((item: any) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#E3E5E8] last:border-0 last:pb-0">
                  <span className="text-[#4A5568]">{item.label}</span>
                  <span className={`font-bold font-mono ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/accounting" className="text-[11px] text-[#1A6FDB] font-medium hover:underline flex items-center gap-1 pt-1">
              View full ledger →
            </Link>
          </div>

          {/* Pending Actions */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Pending Actions
            </h3>
            <div className="space-y-2">
              {pendingActions.map((item: any, idx: number) => (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-md border transition-all hover:border-[#1A6FDB] ${
                    item.urgent ? 'border-[#F5E6C0] bg-[#FFFDF0]' : 'border-[#E3E5E8] bg-[#F4F6F9]'
                  }`}
                >
                  <span className={`text-xs font-medium ${item.urgent ? 'text-[#B45309]' : 'text-[#4A5568]'}`}>{item.label}</span>
                  {item.urgent && <AlertTriangle className="h-3.5 w-3.5 text-[#B45309] shrink-0" />}
                </Link>
              ))}
            </div>
          </div>

          {/* Settings Quick Access */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Admin Settings</h3>
            <div className="space-y-1.5">
              {[
                { label: 'Roles & Permissions', href: '/dashboard/settings/access-control' },
                { label: 'Audit Logs', href: '/dashboard/settings/access-control' },
                { label: 'Academic Year Config', href: '/dashboard/school/settings/academic-year' },
                { label: 'School Profile', href: '/dashboard/school/settings' },
                { label: 'Help & Support', href: '/dashboard/school/support' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-xs text-[#4A5568] hover:bg-[#EAECF0] hover:text-[#1A1F36] transition-all font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
