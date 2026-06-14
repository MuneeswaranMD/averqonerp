'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3, BookOpen, Calendar, CreditCard, Users, Bus,
  DollarSign, MessageSquare, Shield, Settings2,
  TrendingUp, TrendingDown, GraduationCap, FileText,
  Download, Mail, Printer, Clock, Star, Zap, ChevronRight,
  Activity, AlertTriangle, CheckCircle, Eye, RefreshCw,
  PieChart, LineChart, ArrowUpRight, ArrowDownRight, Filter,
  Table, Share2, MoreHorizontal
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface ReportCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  description: string;
  reports: { label: string; badge?: string }[];
}

// ─── Report Categories ───────────────────────────────────────────────────────
const reportCategories: ReportCategory[] = [
  {
    id: 'academic',
    label: 'Academic Reports',
    icon: BookOpen,
    color: 'text-[#1A6FDB]',
    bg: 'bg-[#EDF3FF]',
    border: 'border-[#1A6FDB]/20',
    description: 'Student performance & exam analytics',
    reports: [
      { label: 'Student Performance Report', badge: 'Popular' },
      { label: 'Class-wise Performance' },
      { label: 'Subject-wise Analysis' },
      { label: 'Exam Result Report' },
      { label: 'Top / Low Performers' },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance Reports',
    icon: Calendar,
    color: 'text-[#B45309]',
    bg: 'bg-[#FFF8E6]',
    border: 'border-[#B45309]/20',
    description: 'Student & staff attendance trends',
    reports: [
      { label: 'Student Attendance' },
      { label: 'Staff Attendance' },
      { label: 'Daily Attendance' },
      { label: 'Monthly Attendance', badge: 'New' },
      { label: 'Absentee Report' },
    ],
  },
  {
    id: 'fees',
    label: 'Fee Reports',
    icon: CreditCard,
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F3EEFF]',
    border: 'border-[#7C3AED]/20',
    description: 'Fee collection, dues & payments',
    reports: [
      { label: 'Fee Collection Report', badge: 'Popular' },
      { label: 'Outstanding Dues' },
      { label: 'Payment History' },
      { label: 'Scholarship Report' },
      { label: 'Transport Fee Report' },
    ],
  },
  {
    id: 'admission',
    label: 'Admission Reports',
    icon: FileText,
    color: 'text-[#0891B2]',
    bg: 'bg-[#EFF8FB]',
    border: 'border-[#0891B2]/20',
    description: 'Intake funnel & application analytics',
    reports: [
      { label: 'Admission Funnel' },
      { label: 'New Admissions' },
      { label: 'Rejected Applications' },
      { label: 'Class-wise Admissions' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff Reports',
    icon: Users,
    color: 'text-[#2E7D32]',
    bg: 'bg-[#EDF7ED]',
    border: 'border-[#2E7D32]/20',
    description: 'HR, payroll & leave summaries',
    reports: [
      { label: 'Staff Directory' },
      { label: 'Leave Report' },
      { label: 'Payroll Summary' },
      { label: 'Department Report' },
    ],
  },
  {
    id: 'transport',
    label: 'Transport Reports',
    icon: Bus,
    color: 'text-[#C62828]',
    bg: 'bg-[#FEF0F0]',
    border: 'border-[#C62828]/20',
    description: 'Route, vehicle & driver analytics',
    reports: [
      { label: 'Vehicle Usage' },
      { label: 'Route Summary' },
      { label: 'Driver Attendance' },
      { label: 'Transport Fee Report' },
    ],
  },
  {
    id: 'financial',
    label: 'Financial Reports',
    icon: DollarSign,
    color: 'text-[#1A1F36]',
    bg: 'bg-[#F4F6F9]',
    border: 'border-[#C8CDD5]',
    description: 'Income, expenses & balance sheet',
    reports: [
      { label: 'Income Statement' },
      { label: 'Expense Report' },
      { label: 'Profit & Loss' },
      { label: 'Cash Flow' },
      { label: 'Balance Sheet', badge: 'Popular' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication Reports',
    icon: MessageSquare,
    color: 'text-[#0891B2]',
    bg: 'bg-[#EFF8FB]',
    border: 'border-[#0891B2]/20',
    description: 'SMS, email & notification analytics',
    reports: [
      { label: 'SMS Delivery Report' },
      { label: 'Email Delivery Report' },
      { label: 'Notification Report' },
      { label: 'Circular Engagement' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit & Security',
    icon: Shield,
    color: 'text-[#4A5568]',
    bg: 'bg-[#F4F6F9]',
    border: 'border-[#C8CDD5]',
    description: 'Access logs & security events',
    reports: [
      { label: 'User Activity Log', badge: 'Live' },
      { label: 'Login History' },
      { label: 'Permission Changes' },
      { label: 'Security Events' },
    ],
  },
  {
    id: 'custom',
    label: 'Custom Reports',
    icon: Settings2,
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F3EEFF]',
    border: 'border-[#7C3AED]/20',
    description: 'Build, save & schedule your own reports',
    reports: [
      { label: 'Report Builder', badge: 'Beta' },
      { label: 'Saved Reports' },
      { label: 'Scheduled Reports' },
    ],
  },
];

// ─── KPI Data ────────────────────────────────────────────────────────────────
const kpiCards = [
  { label: 'Total Students', value: '210', delta: '+12 this month', trend: 'up', icon: GraduationCap, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
  { label: 'Attendance %', value: '94.2%', delta: '+1.3% vs last month', trend: 'up', icon: Calendar, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
  { label: 'Fee Collected', value: '₹8.4L', delta: '82% of target', trend: 'up', icon: CreditCard, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
  { label: 'Revenue', value: '₹14.7L', delta: 'Total invoiced FY26', trend: 'neutral', icon: DollarSign, color: 'text-[#1A1F36]', bg: 'bg-[#F4F6F9]' },
  { label: 'New Admissions', value: '50', delta: '18 pending review', trend: 'neutral', icon: FileText, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
  { label: 'Staff Count', value: '28', delta: 'Academic & admin staff', trend: 'neutral', icon: Users, color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]' },
];

// ─── Trend Chart (SVG Sparkline) ─────────────────────────────────────────────
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const h = 40;
  const w = 120;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Trend Data ──────────────────────────────────────────────────────────────
const trendData = {
  feeCollection: [42, 55, 38, 72, 65, 80, 84],
  attendance: [90, 92, 88, 94, 91, 96, 94],
  admissions: [5, 12, 20, 35, 42, 48, 50],
  examPerformance: [68, 72, 70, 76, 74, 80, 78],
};

// ─── Recent Reports ──────────────────────────────────────────────────────────
const recentReports = [
  { name: 'Fee Collection Report — May 2026', category: 'Fee Reports', generated: '2 hrs ago', type: 'PDF' },
  { name: 'Monthly Attendance Summary', category: 'Attendance Reports', generated: '1 day ago', type: 'Excel' },
  { name: 'Midterm Exam Results', category: 'Academic Reports', generated: '2 days ago', type: 'PDF' },
  { name: 'Outstanding Dues Report', category: 'Fee Reports', generated: '3 days ago', type: 'CSV' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReportsDashboard() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerateReport = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  const filteredCategories = searchQuery
    ? reportCategories.filter(cat =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.reports.some(r => r.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : reportCategories;

  const activeData = activeCategory
    ? reportCategories.find(c => c.id === activeCategory)
    : null;

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Reports & Analytics</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › Reports Center</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E3E5E8] bg-white rounded-md text-xs text-[#4A5568] hover:bg-[#F4F6F9] transition-colors">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E3E5E8] bg-white rounded-md text-xs text-[#4A5568] hover:bg-[#F4F6F9] transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* ── DEMO-WOW: Generate School Performance Report ────────────────────── */}
      <div className="relative overflow-hidden rounded-xl border border-[#1A6FDB]/30 bg-gradient-to-br from-[#1A6FDB] via-[#1558B0] to-[#0D3A7A] p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-24 translate-x-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-16 -translate-x-16 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Executive MIS Report</span>
            </div>
            <h2 className="text-lg font-bold">Generate School Performance Report</h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-lg">
              One-click comprehensive PDF — School Overview, Student Statistics, Attendance Analytics, Fee Collection, Exam Performance, Staff & Transport Summary.
            </p>
            <div className="flex items-center gap-4 pt-1">
              {['School Overview', 'Fee Analytics', 'Exam Results', 'Staff Summary'].map(tag => (
                <span key={tag} className="text-[10px] font-medium bg-white/15 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="flex items-center gap-2 bg-white text-[#1A6FDB] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-all disabled:opacity-70 shadow-lg shadow-black/20"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate Report
                </>
              )}
            </button>
            {generated && (
              <div className="flex items-center gap-2 text-xs font-medium bg-green-500/20 border border-green-400/30 px-3 py-1.5 rounded-lg animate-pulse">
                <CheckCircle className="h-3.5 w-3.5 text-green-300" />
                <span>Report ready — <span className="underline cursor-pointer">Download PDF</span></span>
              </div>
            )}
            <div className="flex gap-2">
              {[
                { icon: Download, label: 'PDF' },
                { icon: Table, label: 'Excel' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-md transition-colors">
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-4 border border-[#E3E5E8] bg-white rounded-lg flex flex-col gap-2 hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className={`h-7 w-7 rounded-md ${card.bg} flex items-center justify-center`}>
                  <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                </div>
                {card.trend === 'up' && <ArrowUpRight className="h-3.5 w-3.5 text-[#2E7D32]" />}
                {card.trend === 'down' && <ArrowDownRight className="h-3.5 w-3.5 text-[#C62828]" />}
              </div>
              <div className="text-xl font-bold text-[#1A1F36] group-hover:text-[#1A6FDB] transition-colors">{card.value}</div>
              <div>
                <div className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider leading-tight">{card.label}</div>
                <div className="text-[10px] text-[#8A94A6] mt-0.5">{card.delta}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Trend Charts ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Fee Collection', sub: 'Last 7 months (₹L)', data: trendData.feeCollection, color: '#7C3AED', icon: CreditCard },
          { label: 'Attendance Trend', sub: 'Avg % last 7 months', data: trendData.attendance, color: '#2E7D32', icon: Calendar },
          { label: 'Admissions', sub: 'Cumulative applications', data: trendData.admissions, color: '#1A6FDB', icon: FileText },
          { label: 'Exam Performance', sub: 'Avg score % last 7 exams', data: trendData.examPerformance, color: '#B45309', icon: BookOpen },
        ].map(chart => {
          const Icon = chart.icon;
          const last = chart.data[chart.data.length - 1];
          const prev = chart.data[chart.data.length - 2];
          const isUp = last >= prev;
          return (
            <div key={chart.label} className="p-4 border border-[#E3E5E8] bg-white rounded-lg space-y-3 hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A1F36]">{chart.label}</div>
                  <div className="text-[10px] text-[#8A94A6]">{chart.sub}</div>
                </div>
                <Icon className="h-4 w-4 text-[#8A94A6]" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#1A1F36]">{last}{chart.label === 'Attendance Trend' || chart.label === 'Exam Performance' ? '%' : ''}</div>
                  <div className={`text-[10px] font-medium flex items-center gap-0.5 mt-0.5 ${isUp ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
                    {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    vs {prev}
                  </div>
                </div>
                <Sparkline data={chart.data} color={chart.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Search + Categories Grid ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-[#1A1F36]">All Report Categories</h2>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-8 px-3 border border-[#E3E5E8] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] w-56 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCategories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <div
                key={cat.id}
                className={`border rounded-xl bg-white transition-all cursor-pointer ${isActive ? 'border-[#1A6FDB] shadow-md shadow-[#1A6FDB]/10' : 'border-[#E3E5E8] hover:border-[#1A6FDB]/40 hover:shadow-sm'}`}
                onClick={() => setActiveCategory(isActive ? null : cat.id)}
              >
                {/* Card Header */}
                <div className="p-4 border-b border-[#E3E5E8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${cat.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1F36]">{cat.label}</div>
                      <div className="text-[10px] text-[#8A94A6]">{cat.description}</div>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-[#8A94A6] transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </div>

                {/* Report List */}
                <div className="divide-y divide-[#F4F6F9]">
                  {cat.reports.map((report) => (
                    <div
                      key={report.label}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-[#F7F9FD] transition-colors group"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${cat.color.replace('text-', 'bg-')} shrink-0`} />
                        <span className="text-xs text-[#4A5568] group-hover:text-[#1A6FDB] transition-colors">{report.label}</span>
                        {report.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            report.badge === 'Popular' ? 'bg-[#FFF8E6] text-[#B45309]' :
                            report.badge === 'New' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                            report.badge === 'Live' ? 'bg-[#FEF0F0] text-[#C62828]' :
                            'bg-[#F3EEFF] text-[#7C3AED]'
                          }`}>
                            {report.badge}
                          </span>
                        )}
                      </div>
                      {/* Export actions on hover */}
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button title="View" className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors">
                          <Eye className="h-3 w-3 text-[#1A6FDB]" />
                        </button>
                        <button title="Export PDF" className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors">
                          <Download className="h-3 w-3 text-[#1A6FDB]" />
                        </button>
                        <button title="Email Report" className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors">
                          <Mail className="h-3 w-3 text-[#1A6FDB]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Export All footer */}
                <div className="p-3 border-t border-[#F4F6F9] flex items-center justify-between">
                  <span className="text-[10px] text-[#8A94A6]">{cat.reports.length} reports available</span>
                  <div className="flex gap-1.5">
                    {[
                      { icon: Download, label: 'PDF' },
                      { icon: Table, label: 'XLS' },
                      { icon: Share2, label: 'Share' },
                      { icon: Printer, label: 'Print' },
                    ].map(({ icon: Icon2, label }) => (
                      <button
                        key={label}
                        title={label}
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 border border-[#E3E5E8] rounded text-[#4A5568] hover:bg-[#F4F6F9] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors"
                      >
                        <Icon2 className="h-2.5 w-2.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Recent Reports + Schedule ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Reports */}
        <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#E3E5E8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#8A94A6]" />
              <span className="text-xs font-bold text-[#1A1F36]">Recently Generated</span>
            </div>
            <button className="text-[11px] text-[#1A6FDB] font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#F4F6F9]">
            {recentReports.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F9FD] transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-7 w-7 rounded-md shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    r.type === 'PDF' ? 'bg-[#FEF0F0] text-[#C62828]' :
                    r.type === 'Excel' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                    'bg-[#EDF3FF] text-[#1A6FDB]'
                  }`}>{r.type}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#1A1F36] truncate">{r.name}</div>
                    <div className="text-[10px] text-[#8A94A6]">{r.category} · {r.generated}</div>
                  </div>
                </div>
                <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-2">
                  <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors">
                    <Download className="h-3 w-3 text-[#1A6FDB]" />
                  </button>
                  <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors">
                    <MoreHorizontal className="h-3 w-3 text-[#8A94A6]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Reports + Export Options */}
        <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#E3E5E8] flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#8A94A6]" />
            <span className="text-xs font-bold text-[#1A1F36]">Schedule & Export Options</span>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-[#8A94A6]">Automate report delivery directly to your inbox or team.</p>
            {[
              { label: 'Daily Attendance Summary', schedule: 'Every day at 8:00 AM', active: true },
              { label: 'Weekly Fee Collection', schedule: 'Every Monday at 9:00 AM', active: true },
              { label: 'Monthly MIS Report', schedule: '1st of every month', active: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-[#E3E5E8] rounded-lg">
                <div>
                  <div className="text-xs font-semibold text-[#1A1F36]">{s.label}</div>
                  <div className="text-[10px] text-[#8A94A6]">{s.schedule}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.active ? 'bg-[#EDF7ED] text-[#2E7D32]' : 'bg-[#F4F6F9] text-[#8A94A6]'}`}>
                  {s.active ? 'Active' : 'Paused'}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-[#E3E5E8]">
              <div className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider mb-2">Export Options Available</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Download, label: 'Export PDF' },
                  { icon: Table, label: 'Export Excel' },
                  { icon: FileText, label: 'Export CSV' },
                  { icon: Printer, label: 'Print Report' },
                  { icon: Mail, label: 'Email Report' },
                  { icon: Clock, label: 'Schedule Report' },
                ].map(({ icon: Icon3, label }) => (
                  <button key={label} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 border border-[#E3E5E8] rounded-md text-[#4A5568] hover:border-[#1A6FDB] hover:text-[#1A6FDB] hover:bg-[#F7F9FD] transition-colors">
                    <Icon3 className="h-3 w-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Reports Teaser ─────────────────────────────────────────────────── */}
      <div className="border border-dashed border-[#7C3AED]/40 bg-[#F3EEFF]/50 rounded-xl p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center shrink-0">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#7C3AED]">AI-Powered Reports</span>
            <span className="text-[9px] font-bold bg-[#7C3AED] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Premium · Coming Soon</span>
          </div>
          <p className="text-xs text-[#4A5568] leading-relaxed">
            Unlock intelligent insights with AI Attendance Predictions, Fee Collection Forecasting, Student Risk Analysis, Academic Performance Trends, and Teacher Effectiveness Reports.
          </p>
        </div>
        <button className="shrink-0 text-[11px] font-semibold text-[#7C3AED] border border-[#7C3AED]/40 px-3 py-1.5 rounded-lg hover:bg-[#7C3AED]/10 transition-colors">
          Learn More →
        </button>
      </div>

    </div>
  );
}
