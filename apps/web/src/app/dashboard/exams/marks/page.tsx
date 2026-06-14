'use client';

import { useState, useEffect } from 'react';
import {
  Award, BookOpen, Calendar, BarChart3, FileText, Star, Send,
  Plus, Edit, Trash2, Save, Download, Printer, Mail, Search,
  ChevronRight, CheckCircle, AlertCircle, RefreshCw, Upload,
  TrendingUp, TrendingDown, Users, Target, Zap, X, Eye
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Exam {
  id: string;
  name: string;
  status?: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_EXAMS = [
  { id: '1', name: 'Quarterly Exam',    term: 'Term 1', class: 'Grade 10', year: '2025-26', start: '2026-01-10', end: '2026-01-20', status: 'Published' },
  { id: '2', name: 'Half Yearly Exam',  term: 'Term 2', class: 'Grade 10', year: '2025-26', start: '2026-03-01', end: '2026-03-15', status: 'Approved'  },
  { id: '3', name: 'Unit Test 1',       term: 'Term 1', class: 'All',      year: '2025-26', start: '2025-09-05', end: '2025-09-07', status: 'Published' },
  { id: '4', name: 'Mid-Term Exam',     term: 'Term 2', class: 'Grade 10', year: '2025-26', start: '2025-11-10', end: '2025-11-25', status: 'Draft'     },
  { id: '5', name: 'Annual Exam',       term: 'Final',  class: 'All',      year: '2025-26', start: '2026-03-20', end: '2026-04-05', status: 'Draft'     },
];

const DEMO_SCHEDULE = [
  { subject: 'Mathematics',    date: '10-Jan', time: '9:00 AM', max: 100, room: 'Hall A' },
  { subject: 'Science',        date: '12-Jan', time: '9:00 AM', max: 100, room: 'Hall B' },
  { subject: 'English',        date: '14-Jan', time: '9:00 AM', max: 100, room: 'Hall A' },
  { subject: 'Social Science', date: '16-Jan', time: '9:00 AM', max: 100, room: 'Hall C' },
  { subject: 'Computer Sci.',  date: '18-Jan', time: '9:00 AM', max: 50,  room: 'Lab 1'  },
];

const DEMO_STUDENTS = [
  { roll: '101', name: 'Priya S',         math: 97, sci: 94, eng: 95, sst: 92, cs: 48, total: 426 },
  { roll: '102', name: 'Arun Kumar',       math: 87, sci: 82, eng: 79, sst: 85, cs: 44, total: 377 },
  { roll: '103', name: 'Divya Nair',       math: 91, sci: 88, eng: 93, sst: 90, cs: 46, total: 408 },
  { roll: '104', name: 'Rahul Verma',      math: 72, sci: 68, eng: 75, sst: 71, cs: 38, total: 324 },
  { roll: '105', name: 'Sneha Pillai',     math: 84, sci: 79, eng: 88, sst: 80, cs: 42, total: 373 },
  { roll: '106', name: 'Karthik Raja',     math: 65, sci: 61, eng: 70, sst: 67, cs: 35, total: 298 },
  { roll: '107', name: 'Meera Krishnan',   math: 95, sci: 92, eng: 98, sst: 96, cs: 47, total: 428 },
  { roll: '108', name: 'Arjun Sharma',     math: 78, sci: 74, eng: 82, sst: 76, cs: 40, total: 350 },
];

const GRADE_CONFIG = [
  { min: 91, max: 100, grade: 'A1', gpa: 10, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
  { min: 81, max: 90,  grade: 'A2', gpa: 9,  color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
  { min: 71, max: 80,  grade: 'B1', gpa: 8,  color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]' },
  { min: 61, max: 70,  grade: 'B2', gpa: 7,  color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
  { min: 51, max: 60,  grade: 'C1', gpa: 6,  color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
  { min: 41, max: 50,  grade: 'C2', gpa: 5,  color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
  { min: 35, max: 40,  grade: 'D',  gpa: 4,  color: 'text-[#4A5568]', bg: 'bg-[#F4F6F9]' },
  { min: 0,  max: 34,  grade: 'F',  gpa: 0,  color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]' },
];

const getGrade = (pct: number) => GRADE_CONFIG.find(g => pct >= g.min && pct <= g.max) || GRADE_CONFIG[7];

// ─── Horizontal Bar ──────────────────────────────────────────────────────────
const BarStat = ({ label, pct, color }: { label: string; pct: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px]">
      <span className="font-medium text-[#1A1F36]">{label}</span>
      <span className="font-bold text-[#1A6FDB]">{pct}%</span>
    </div>
    <div className="h-2 bg-[#E3E5E8] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const s: Record<string, string> = {
    Published: 'bg-[#EDF7ED] text-[#2E7D32]',
    Approved:  'bg-[#EDF3FF] text-[#1A6FDB]',
    Draft:     'bg-[#F4F6F9] text-[#4A5568]',
    'Under Review': 'bg-[#FFF8E6] text-[#B45309]',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s[status] || s.Draft}`}>{status}</span>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExamsDashboard() {
  const [tab, setTab] = useState<'types' | 'schedule' | 'marks' | 'grades' | 'marksheet' | 'reportcard' | 'analytics' | 'publish'>('analytics');
  const [exams, setExams] = useState<Exam[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>(
    Object.fromEntries(DEMO_STUDENTS.map(s => [s.roll, String(s.math)]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(DEMO_STUDENTS[0]);
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [examForm, setExamForm] = useState({ name: '', term: 'Term 1', class: 'Grade 10', year: '2025-26', start: '', end: '' });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        if (!token || !userStr) return;
        const user = JSON.parse(userStr);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/exams`, {
          headers: { Authorization: `Bearer ${token}`, 'x-school-id': user.schoolId }
        });
        if (res.ok) setExams(await res.json());
      } catch { /* Use demo data */ }
    };
    fetchExams();
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSaveMarks = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    showToast('Marks saved successfully!');
  };

  const handleGenerateReport = () => {
    setGenerating(true); setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2500);
  };

  const handleCreateExam = () => {
    showToast(`Exam "${examForm.name}" created successfully!`);
    setShowCreateExam(false);
    setExamForm({ name: '', term: 'Term 1', class: 'Grade 10', year: '2025-26', start: '', end: '' });
  };

  const sorted = [...DEMO_STUDENTS].sort((a, b) => b.total - a.total);
  const ranks = Object.fromEntries(sorted.map((s, i) => [s.roll, i + 1]));
  const classAvg = Math.round(DEMO_STUDENTS.reduce((s, st) => s + (st.total / 450 * 100), 0) / DEMO_STUDENTS.length);
  const passCount = DEMO_STUDENTS.filter(s => (s.total / 450 * 100) >= 35).length;
  const highest = Math.max(...DEMO_STUDENTS.map(s => s.total));

  const TABS = [
    { id: 'analytics',  label: 'Dashboard',      icon: BarChart3  },
    { id: 'types',      label: 'Exam Types',      icon: Award      },
    { id: 'schedule',   label: 'Exam Schedule',   icon: Calendar   },
    { id: 'marks',      label: 'Marks Entry',     icon: Edit       },
    { id: 'grades',     label: 'Grade Config',    icon: Target     },
    { id: 'marksheet',  label: 'Marksheet',       icon: FileText   },
    { id: 'reportcard', label: 'Report Card',     icon: Star       },
    { id: 'publish',    label: 'Publish Results', icon: Send       },
  ] as const;

  return (
    <div className="space-y-5">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold bg-[#EDF7ED] text-[#2E7D32] border border-[#2E7D32]/20">
          <CheckCircle className="h-4 w-4" /> {toast}
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E5E8]">
              <div><div className="text-sm font-bold text-[#1A1F36]">Create New Exam</div><div className="text-xs text-[#8A94A6]">Academic Year 2025-26</div></div>
              <button onClick={() => setShowCreateExam(false)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#F4F6F9]"><X className="h-4 w-4 text-[#8A94A6]" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Exam Name</label>
                <input value={examForm.name} onChange={e => setExamForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Quarterly Exam"
                  className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Term</label>
                  <select value={examForm.term} onChange={e => setExamForm(p => ({ ...p, term: e.target.value }))}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all bg-white">
                    {['Term 1','Term 2','Half Yearly','Final'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Class</label>
                  <select value={examForm.class} onChange={e => setExamForm(p => ({ ...p, class: e.target.value }))}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all bg-white">
                    {['All','Grade 10','Grade 9','Grade 8'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Start Date</label>
                  <input type="date" value={examForm.start} onChange={e => setExamForm(p => ({ ...p, start: e.target.value }))}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">End Date</label>
                  <input type="date" value={examForm.end} onChange={e => setExamForm(p => ({ ...p, end: e.target.value }))}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowCreateExam(false)} className="flex-1 h-9 border border-[#E3E5E8] rounded-lg text-xs font-semibold text-[#4A5568] hover:bg-[#F4F6F9] transition-colors">Cancel</button>
              <button onClick={handleCreateExam} className="flex-1 h-9 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors flex items-center justify-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Create Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Academic Marksheet & Grading</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › Exams › {TABS.find(t => t.id === tab)?.label}</div>
        </div>
        <div className="flex gap-2">
          <select className="h-8 px-3 border border-[#C8CDD5] bg-white rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] transition-all">
            <option>Quarterly Exam</option>
            {DEMO_EXAMS.map(e => <option key={e.id}>{e.name}</option>)}
          </select>
          <select className="h-8 px-3 border border-[#C8CDD5] bg-white rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] transition-all">
            <option>Grade 10 — Section A</option>
            <option>Grade 9 — Section A</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-[#E3E5E8]">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id ? 'border-[#1A6FDB] text-[#1A6FDB]' : 'border-transparent text-[#8A94A6] hover:text-[#1A1F36]'
              }`}>
              <Icon className="h-3.5 w-3.5" />{t.label}
            </button>
          );
        })}
      </div>

      {/* ══ ANALYTICS DASHBOARD ═══════════════════════════════════════════════ */}
      {tab === 'analytics' && (
        <div className="space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Students', value: DEMO_STUDENTS.length, icon: Users,      color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
              { label: 'Pass %',         value: `${Math.round(passCount/DEMO_STUDENTS.length*100)}%`, icon: CheckCircle, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
              { label: 'Fail %',         value: `${Math.round((DEMO_STUDENTS.length-passCount)/DEMO_STUDENTS.length*100)}%`, icon: AlertCircle, color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]' },
              { label: 'Highest Score',  value: `${highest}/450`, icon: TrendingUp,    color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
              { label: 'Class Average',  value: `${classAvg}%`,   icon: Target,        color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
            ].map(kpi => { const Icon = kpi.icon; return (
              <div key={kpi.label} className="p-4 border border-[#E3E5E8] bg-white rounded-xl flex items-center gap-3 hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all">
                <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}><Icon className={`h-5 w-5 ${kpi.color}`} /></div>
                <div><div className="text-xl font-bold text-[#1A1F36]">{kpi.value}</div><div className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider leading-tight">{kpi.label}</div></div>
              </div>
            ); })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Subject Performance */}
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
              <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Subject Performance</div>
              <div className="space-y-3">
                {[
                  { sub: 'Mathematics',    avg: Math.round(DEMO_STUDENTS.reduce((s,st)=>s+st.math,0)/DEMO_STUDENTS.length), color: '#7C3AED' },
                  { sub: 'Science',        avg: Math.round(DEMO_STUDENTS.reduce((s,st)=>s+st.sci,0)/DEMO_STUDENTS.length),  color: '#2E7D32' },
                  { sub: 'English',        avg: Math.round(DEMO_STUDENTS.reduce((s,st)=>s+st.eng,0)/DEMO_STUDENTS.length),  color: '#1A6FDB' },
                  { sub: 'Social Science', avg: Math.round(DEMO_STUDENTS.reduce((s,st)=>s+st.sst,0)/DEMO_STUDENTS.length),  color: '#B45309' },
                ].map(s => <BarStat key={s.sub} label={s.sub} pct={s.avg} color={s.color} />)}
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
              <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Grade Distribution</div>
              <div className="space-y-2">
                {GRADE_CONFIG.slice(0, 6).map(g => {
                  const cnt = DEMO_STUDENTS.filter(s => {
                    const pct = Math.round(s.total / 450 * 100);
                    return pct >= g.min && pct <= g.max;
                  }).length;
                  return (
                    <div key={g.grade} className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-6 text-center ${g.color}`}>{g.grade}</span>
                      <div className="flex-1 h-5 bg-[#F4F6F9] rounded-md overflow-hidden">
                        <div className="h-full rounded-md flex items-center px-2 transition-all" style={{ width: `${cnt > 0 ? Math.max((cnt/DEMO_STUDENTS.length)*100, 8) : 0}%`, backgroundColor: g.color.replace('text-[','').replace(']','') }}>
                          <span className="text-[10px] font-bold text-white">{cnt > 0 ? `${cnt} students` : ''}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#8A94A6] w-16 text-right">{g.min}–{g.max}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rank Table */}
          <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1F36]">Student Rankings — Grade 10A</span>
              <div className="flex gap-2">
                {['PDF','Excel'].map(f => (
                  <button key={f} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 border border-[#E3E5E8] rounded-lg text-[#4A5568] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors">
                    <Download className="h-3 w-3" /> {f}
                  </button>
                ))}
              </div>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
                {['Rank','Roll','Student','Math','Sci','Eng','SST','Total','%','Grade','Result'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-[#F4F6F9]">
                {sorted.map((s, i) => {
                  const pct = Math.round(s.total / 450 * 100);
                  const g = getGrade(pct);
                  const pass = pct >= 35;
                  return (
                    <tr key={s.roll} className="hover:bg-[#F7F9FD] transition-colors">
                      <td className="px-3 py-2.5">
                        <span className={`font-bold text-sm ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-700' : 'text-[#8A94A6]'}`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[#8A94A6]">{s.roll}</td>
                      <td className="px-3 py-2.5 font-semibold text-[#1A1F36]">{s.name}</td>
                      <td className="px-3 py-2.5 text-[#4A5568]">{s.math}</td>
                      <td className="px-3 py-2.5 text-[#4A5568]">{s.sci}</td>
                      <td className="px-3 py-2.5 text-[#4A5568]">{s.eng}</td>
                      <td className="px-3 py-2.5 text-[#4A5568]">{s.sst}</td>
                      <td className="px-3 py-2.5 font-bold text-[#1A1F36]">{s.total}/450</td>
                      <td className="px-3 py-2.5 font-bold text-[#1A1F36]">{pct}%</td>
                      <td className="px-3 py-2.5"><span className={`font-bold text-xs px-1.5 py-0.5 rounded ${g.bg} ${g.color}`}>{g.grade}</span></td>
                      <td className="px-3 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pass ? 'bg-[#EDF7ED] text-[#2E7D32]' : 'bg-[#FEF0F0] text-[#C62828]'}`}>{pass ? 'PASS' : 'FAIL'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ EXAM TYPES ═══════════════════════════════════════════════════════ */}
      {tab === 'types' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8A94A6]">Manage exam types, terms, and schedules for the academic year.</p>
            <button onClick={() => setShowCreateExam(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold hover:bg-[#1558B0] transition-colors">
              <Plus className="h-3.5 w-3.5" /> Create Exam
            </button>
          </div>
          <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
                {['Exam Name','Term','Class','Year','Start','End','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-[#F4F6F9]">
                {DEMO_EXAMS.map(ex => (
                  <tr key={ex.id} className="hover:bg-[#F7F9FD] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#1A1F36]">{ex.name}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{ex.term}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{ex.class}</td>
                    <td className="px-4 py-3 text-[#8A94A6] font-mono">{ex.year}</td>
                    <td className="px-4 py-3 text-[#8A94A6]">{ex.start}</td>
                    <td className="px-4 py-3 text-[#8A94A6]">{ex.end}</td>
                    <td className="px-4 py-3"><StatusBadge status={ex.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => showToast(`Editing ${ex.name}...`)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors"><Edit className="h-3 w-3 text-[#1A6FDB]" /></button>
                        <button onClick={() => showToast(`${ex.name} published!`)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#EDF7ED] transition-colors"><Send className="h-3 w-3 text-[#2E7D32]" /></button>
                        <button onClick={() => showToast(`${ex.name} deleted.`)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#FEF0F0] transition-colors"><Trash2 className="h-3 w-3 text-[#C62828]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ EXAM SCHEDULE ════════════════════════════════════════════════════ */}
      {tab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8A94A6]">Quarterly Exam 2025-26 — Grade 10</p>
            <div className="flex gap-2">
              <button onClick={() => showToast('Schedule created!')} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E3E5E8] bg-white text-[#4A5568] rounded-lg text-xs font-semibold hover:bg-[#F4F6F9] transition-colors"><Plus className="h-3.5 w-3.5" /> Add Subject</button>
              <button onClick={() => showToast('Timetable PDF ready!')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold hover:bg-[#1558B0] transition-colors"><Printer className="h-3.5 w-3.5" /> Print Timetable</button>
            </div>
          </div>
          <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
                {['#','Subject','Date','Time','Max Marks','Room','Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-[#F4F6F9]">
                {DEMO_SCHEDULE.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F7F9FD] transition-colors">
                    <td className="px-4 py-3 font-mono text-[#8A94A6]">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A1F36]">{row.subject}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{row.date}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{row.time}</td>
                    <td className="px-4 py-3 font-bold text-[#1A1F36]">{row.max}</td>
                    <td className="px-4 py-3 text-[#8A94A6]">{row.room}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => showToast(`Editing ${row.subject} schedule...`)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors"><Edit className="h-3 w-3 text-[#1A6FDB]" /></button>
                        <button onClick={() => showToast(`${row.subject} removed.`)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#FEF0F0] transition-colors"><Trash2 className="h-3 w-3 text-[#C62828]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ MARKS ENTRY ══════════════════════════════════════════════════════ */}
      {tab === 'marks' && (
        <div className="space-y-4">
          <div className="p-4 border border-[#E3E5E8] bg-white rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[10px] text-[#8A94A6] font-bold uppercase tracking-wider">Class</div>
                <div className="text-sm font-bold text-[#1A1F36]">Grade 10 — Section A</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8A94A6] font-bold uppercase tracking-wider">Subject</div>
                <div className="text-sm font-bold text-[#1A1F36]">Mathematics</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8A94A6] font-bold uppercase tracking-wider">Exam</div>
                <div className="text-sm font-bold text-[#1A1F36]">Quarterly Exam</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8A94A6] font-bold uppercase tracking-wider">Max Marks</div>
                <div className="text-sm font-bold text-[#1A1F36]">100</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast('Import template downloaded!')} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E3E5E8] bg-white text-[#4A5568] rounded-lg text-xs font-semibold hover:bg-[#F4F6F9] transition-colors"><Upload className="h-3.5 w-3.5" /> Import Excel</button>
              <button onClick={() => { const newM: Record<string,string> = {}; DEMO_STUDENTS.forEach(s => { newM[s.roll] = String(s.math); }); setMarks(newM); showToast('All marks set to Present!'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E3E5E8] bg-white text-[#4A5568] rounded-lg text-xs font-semibold hover:bg-[#F4F6F9] transition-colors">Bulk Fill</button>
              <button onClick={handleSaveMarks} disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors disabled:opacity-60">
                {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Marks'}
              </button>
            </div>
          </div>

          <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
            <div className="p-3 border-b border-[#E3E5E8] bg-[#F4F6F9] flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">Marks Entry Sheet — {DEMO_STUDENTS.length} Students</span>
              <span className="text-[10px] text-[#8A94A6]">Auto-saved · Changes are live</span>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-[#E3E5E8]">
                {['Roll No','Student Name','Marks Obtained (/ 100)','Grade Preview'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-[#F4F6F9]">
                {DEMO_STUDENTS.map(s => {
                  const val = Number(marks[s.roll] ?? s.math);
                  const g = getGrade(val);
                  return (
                    <tr key={s.roll} className="hover:bg-[#F7F9FD] transition-colors">
                      <td className="px-4 py-2.5 font-mono text-[#8A94A6]">{s.roll}</td>
                      <td className="px-4 py-2.5 font-semibold text-[#1A1F36]">{s.name}</td>
                      <td className="px-4 py-2.5">
                        <input
                          type="number" min={0} max={100} step={0.5}
                          value={marks[s.roll] ?? s.math}
                          onChange={e => setMarks(p => ({ ...p, [s.roll]: e.target.value }))}
                          className="w-24 text-center h-8 px-2 border border-[#C8CDD5] bg-white rounded-lg text-sm font-mono focus:outline-none focus:border-[#1A6FDB] focus:ring-2 focus:ring-[#1A6FDB]/20 transition-all"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`font-bold text-xs px-2 py-1 rounded-lg ${g.bg} ${g.color}`}>
                          {g.grade} · {g.gpa} GPA
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ GRADE CONFIGURATION ══════════════════════════════════════════════ */}
      {tab === 'grades' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8A94A6]">Configure grading scale — CBSE, State Board, or School Custom.</p>
            <div className="flex gap-2">
              {['CBSE Style','State Board','Custom Scale'].map(s => (
                <button key={s} onClick={() => showToast(`${s} applied!`)} className="px-3 py-1.5 border border-[#E3E5E8] bg-white text-[#4A5568] rounded-lg text-xs font-semibold hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors">{s}</button>
              ))}
              <button onClick={() => showToast('Grade config saved!')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold hover:bg-[#1558B0] transition-colors"><Save className="h-3.5 w-3.5" /> Save</button>
            </div>
          </div>
          <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
                {['#','Marks Range','Grade','GPA','Visual','Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-[#F4F6F9]">
                {GRADE_CONFIG.map((g, i) => (
                  <tr key={g.grade} className="hover:bg-[#F7F9FD] transition-colors">
                    <td className="px-4 py-3 font-mono text-[#8A94A6]">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={g.min} className="w-16 h-7 px-2 border border-[#C8CDD5] rounded text-xs font-mono text-center focus:outline-none focus:border-[#1A6FDB]" />
                        <span className="text-[#8A94A6]">–</span>
                        <input type="number" defaultValue={g.max} className="w-16 h-7 px-2 border border-[#C8CDD5] rounded text-xs font-mono text-center focus:outline-none focus:border-[#1A6FDB]" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`font-bold text-sm px-2.5 py-1 rounded-lg ${g.bg} ${g.color}`}>{g.grade}</span></td>
                    <td className="px-4 py-3"><span className="font-bold text-[#1A1F36]">{g.gpa}.0</span></td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-32 bg-[#E3E5E8] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${((g.max + g.min) / 2)}%`, backgroundColor: g.color.replace('text-[','').replace(']','') }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => showToast(`Grade ${g.grade} updated!`)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors"><Edit className="h-3 w-3 text-[#1A6FDB]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ MARKSHEET ════════════════════════════════════════════════════════ */}
      {tab === 'marksheet' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {DEMO_STUDENTS.map(s => (
              <button key={s.roll} onClick={() => setSelectedStudent(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${selectedStudent.roll === s.roll ? 'bg-[#1A6FDB] text-white border-[#1A6FDB]' : 'bg-white text-[#4A5568] border-[#E3E5E8] hover:border-[#1A6FDB]'}`}>
                {s.name}
              </button>
            ))}
          </div>

          {/* Marksheet card */}
          <div className="border border-[#E3E5E8] bg-white rounded-2xl overflow-hidden">
            {/* School header */}
            <div className="bg-gradient-to-r from-[#1A6FDB] to-[#1558B0] p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                  </div>
                  <div>
                    <div className="text-base font-bold">Green Valley International School</div>
                    <div className="text-xs text-white/70">Academic Year 2025-26 · Quarterly Exam</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/70">Academic Marksheet</div>
                  <div className="text-sm font-bold">Grade 10 — Section A</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Student info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F7F9FD] rounded-xl">
                {[
                  { label: 'Student Name', value: selectedStudent.name },
                  { label: 'Roll Number', value: selectedStudent.roll },
                  { label: 'Class', value: 'Grade 10 — A' },
                  { label: 'Rank', value: `#${ranks[selectedStudent.roll]} of ${DEMO_STUDENTS.length}` },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{f.label}</div>
                    <div className="text-sm font-bold text-[#1A1F36] mt-0.5">{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Subject marks */}
              <table className="w-full text-xs">
                <thead><tr className="bg-[#F4F6F9] border border-[#E3E5E8] rounded-lg">
                  {['Subject','Max Marks','Obtained','%','Grade','GPA'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-[#F4F6F9]">
                  {[
                    { sub: 'Mathematics',    obt: selectedStudent.math, max: 100 },
                    { sub: 'Science',        obt: selectedStudent.sci,  max: 100 },
                    { sub: 'English',        obt: selectedStudent.eng,  max: 100 },
                    { sub: 'Social Science', obt: selectedStudent.sst,  max: 100 },
                    { sub: 'Computer Sci.', obt: selectedStudent.cs,   max: 50  },
                  ].map(row => {
                    const pct = Math.round((row.obt / row.max) * 100);
                    const g = getGrade(pct);
                    return (
                      <tr key={row.sub} className="hover:bg-[#F7F9FD] transition-colors">
                        <td className="px-4 py-3 font-semibold text-[#1A1F36]">{row.sub}</td>
                        <td className="px-4 py-3 text-[#8A94A6]">{row.max}</td>
                        <td className="px-4 py-3 font-bold text-[#1A1F36]">{row.obt}</td>
                        <td className="px-4 py-3 text-[#4A5568]">{pct}%</td>
                        <td className="px-4 py-3"><span className={`font-bold text-xs px-2 py-0.5 rounded-lg ${g.bg} ${g.color}`}>{g.grade}</span></td>
                        <td className="px-4 py-3 font-bold text-[#1A1F36]">{g.gpa}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-[#E3E5E8] rounded-xl">
                {(() => {
                  const total = selectedStudent.total;
                  const max = 450;
                  const pct = (total / max * 100).toFixed(2);
                  const g = getGrade(Math.round(total / max * 100));
                  return [
                    { label: 'Total Marks', value: `${total} / ${max}` },
                    { label: 'Percentage', value: `${pct}%` },
                    { label: 'Overall Grade', value: g.grade },
                    { label: 'Result', value: Number(pct) >= 35 ? 'PASS' : 'FAIL' },
                  ];
                })().map(f => (
                  <div key={f.label} className="text-center">
                    <div className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{f.label}</div>
                    <div className={`text-xl font-bold mt-1 ${f.label === 'Result' ? (f.value === 'PASS' ? 'text-[#2E7D32]' : 'text-[#C62828]') : 'text-[#1A1F36]'}`}>{f.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {[
                  { icon: Download, label: 'Download PDF' },
                  { icon: Printer, label: 'Print' },
                  { icon: Mail, label: 'Email to Parent' },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} onClick={() => showToast(`${label} — ${selectedStudent.name}`)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E3E5E8] rounded-lg text-xs font-semibold text-[#4A5568] hover:border-[#1A6FDB] hover:text-[#1A6FDB] hover:bg-[#F7F9FD] transition-colors">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ REPORT CARD ══════════════════════════════════════════════════════ */}
      {tab === 'reportcard' && (
        <div className="space-y-4">
          {/* Generate CTA */}
          <div className="relative overflow-hidden rounded-xl border border-[#1A6FDB]/30 bg-gradient-to-br from-[#1A6FDB] via-[#1558B0] to-[#0D3A7A] p-6 text-white">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-16 translate-x-16 pointer-events-none" />
            <div className="relative flex items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center"><Star className="h-4 w-4 text-yellow-300" /></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/70">Wow Feature</span>
                </div>
                <h2 className="text-lg font-bold">Generate Consolidated Report Card</h2>
                <p className="text-sm text-white/70 max-w-md">Beautiful PDF with school branding, attendance, all subject marks, grades, teacher & principal remarks, and student rank.</p>
                <div className="flex gap-2 pt-1">
                  {['School Logo','Attendance','All Subjects','Rank','Remarks'].map(tag => (
                    <span key={tag} className="text-[10px] font-medium bg-white/15 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-3">
                <button onClick={handleGenerateReport} disabled={generating}
                  className="flex items-center gap-2 bg-white text-[#1A6FDB] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-all disabled:opacity-70 shadow-lg shadow-black/20">
                  {generating ? <><RefreshCw className="h-4 w-4 animate-spin" />Generating...</> : <><Zap className="h-4 w-4" />Generate Report Card</>}
                </button>
                {generated && (
                  <div className="flex items-center gap-2 text-xs font-semibold bg-green-500/20 border border-green-400/30 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="h-3.5 w-3.5 text-green-300" />
                    Report ready — <span className="underline cursor-pointer">Download PDF</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {[{icon: Download, label: 'PDF'}, {icon: Printer, label: 'Print'}, {icon: Mail, label: 'Email All'}].map(({icon: Icon, label}) => (
                    <button key={label} onClick={() => showToast(`${label} — All students`)} className="flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-md transition-colors">
                      <Icon className="h-3 w-3" />{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Report Card Preview */}
          <div className="border-2 border-[#1A6FDB]/20 bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-[#1A1F36] to-[#1A6FDB] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                <div>
                  <div className="font-bold">Green Valley International School</div>
                  <div className="text-xs text-white/70">MG Road, Bengaluru — www.greenvalley.edu</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">Progress Report Card</div>
                <div className="text-xs text-white/70">Academic Year 2025-26</div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div><span className="text-[#8A94A6]">Student:</span> <span className="font-bold text-[#1A1F36]">{selectedStudent.name}</span></div>
                <div><span className="text-[#8A94A6]">Roll:</span> <span className="font-bold text-[#1A1F36]">{selectedStudent.roll}</span></div>
                <div><span className="text-[#8A94A6]">Class:</span> <span className="font-bold text-[#1A1F36]">Grade 10 — A</span></div>
                <div><span className="text-[#8A94A6]">Exam:</span> <span className="font-bold text-[#1A1F36]">Quarterly Exam</span></div>
                <div><span className="text-[#8A94A6]">Attendance:</span> <span className="font-bold text-[#2E7D32]">94%</span></div>
                <div><span className="text-[#8A94A6]">Rank:</span> <span className="font-bold text-[#1A6FDB]">#{ranks[selectedStudent.roll]}</span></div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-[10px] font-bold text-center">
                {[
                  { sub: 'Maths', obt: selectedStudent.math, max: 100 },
                  { sub: 'Sci',   obt: selectedStudent.sci,  max: 100 },
                  { sub: 'Eng',   obt: selectedStudent.eng,  max: 100 },
                  { sub: 'SST',   obt: selectedStudent.sst,  max: 100 },
                  { sub: 'CS',    obt: selectedStudent.cs,   max: 50  },
                ].map(s => {
                  const pct = Math.round(s.obt / s.max * 100);
                  const g = getGrade(pct);
                  return (
                    <div key={s.sub} className={`p-3 rounded-xl border ${g.bg} ${g.color.replace('text-','border-').replace(']','/20]')}`}>
                      <div className="text-[10px] text-[#8A94A6]">{s.sub}</div>
                      <div className="text-lg font-bold mt-1">{s.obt}</div>
                      <div className="text-[10px]">/{s.max}</div>
                      <div className={`text-[10px] font-bold mt-1 ${g.color}`}>{g.grade}</div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-[#E3E5E8] rounded-xl space-y-1">
                  <div className="font-bold text-[#8A94A6] uppercase tracking-wider text-[10px]">Teacher Remarks</div>
                  <div className="text-[#4A5568] italic">"Excellent performance! Consistent hard work and dedication. Keep it up."</div>
                </div>
                <div className="p-3 border border-[#E3E5E8] rounded-xl space-y-1">
                  <div className="font-bold text-[#8A94A6] uppercase tracking-wider text-[10px]">Principal Remarks</div>
                  <div className="text-[#4A5568] italic">"Outstanding student. We are proud of your achievement this term."</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E3E5E8] text-[10px] text-[#8A94A6]">
                <span>Signature: _________________________ (Class Teacher)</span>
                <span>Signature: _________________________ (Principal)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ PUBLISH RESULTS ══════════════════════════════════════════════════ */}
      {tab === 'publish' && (
        <div className="space-y-4">
          {/* Workflow */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl">
            <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider mb-4">Publication Workflow</div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { step: '1', label: 'Teacher enters marks', status: 'done' },
                { step: '2', label: 'Coordinator verifies', status: 'done' },
                { step: '3', label: 'Principal approves', status: 'current' },
                { step: '4', label: 'Results published', status: 'pending' },
              ].map((s, i, arr) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    s.status === 'done'    ? 'bg-[#EDF7ED] border-[#2E7D32]/30 text-[#2E7D32]' :
                    s.status === 'current' ? 'bg-[#EDF3FF] border-[#1A6FDB]/30 text-[#1A6FDB] ring-2 ring-[#1A6FDB]/20' :
                    'bg-[#F4F6F9] border-[#E3E5E8] text-[#8A94A6]'
                  }`}>
                    {s.status === 'done' ? <CheckCircle className="h-4 w-4" /> : <span className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">{s.step}</span>}
                    {s.label}
                  </div>
                  {i < arr.length - 1 && <ChevronRight className="h-4 w-4 text-[#C8CDD5] shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Exam status list */}
          <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1F36]">Results Pending Approval</span>
              <button onClick={() => showToast('All results approved and published!')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors">
                <Send className="h-3.5 w-3.5" /> Publish All
              </button>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
                {['Exam','Class','Students','Pass %','Avg %','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-[#F4F6F9]">
                {[
                  { exam: 'Quarterly Exam', class: 'Grade 10A', students: 45, pass: 96, avg: 82, status: 'Under Review' },
                  { exam: 'Quarterly Exam', class: 'Grade 10B', students: 42, pass: 90, avg: 77, status: 'Draft' },
                  { exam: 'Unit Test 1',    class: 'Grade 9A',  students: 40, pass: 100, avg: 88, status: 'Approved' },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-[#F7F9FD] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#1A1F36]">{r.exam}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{r.class}</td>
                    <td className="px-4 py-3 text-[#4A5568]">{r.students}</td>
                    <td className="px-4 py-3"><span className={`font-bold ${r.pass >= 90 ? 'text-[#2E7D32]' : 'text-[#B45309]'}`}>{r.pass}%</span></td>
                    <td className="px-4 py-3 font-bold text-[#1A1F36]">{r.avg}%</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => showToast(`${r.class} ${r.exam} approved!`)} className="flex items-center gap-1 px-2 py-1 bg-[#EDF7ED] text-[#2E7D32] rounded text-[10px] font-bold hover:bg-[#2E7D32] hover:text-white transition-colors"><CheckCircle className="h-3 w-3" /> Approve</button>
                        <button onClick={() => showToast(`${r.class} results published!`)} className="flex items-center gap-1 px-2 py-1 bg-[#EDF3FF] text-[#1A6FDB] rounded text-[10px] font-bold hover:bg-[#1A6FDB] hover:text-white transition-colors"><Send className="h-3 w-3" /> Publish</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
