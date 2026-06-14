'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen, FolderOpen, Calendar, FileText, CheckCircle2, AlertCircle,
  UploadCloud, ChevronRight, PlayCircle, Trophy, Clock, Star, Zap,
  BarChart3, BookMarked, ClipboardCheck, Users, TrendingUp, Award,
  Video, Download, Lock, ChevronDown, Circle, CheckCheck, Target,
  Layers, ArrowUpRight, RefreshCw
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Submission {
  id: string;
  submittedAt: string;
  fileUrl: string;
  marks: string | null;
  feedback: string | null;
  status: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  fileUrl: string | null;
  submissions: Submission[];
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  contentUrl: string | null;
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  subject: { name: string; code: string };
  lessons: Lesson[];
  assignments: Assignment[];
}

// ─── Mock enrichment data (per-course) ────────────────────────────────────────
const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  default: { bg: 'bg-[#EDF3FF]', text: 'text-[#1A6FDB]', border: 'border-[#1A6FDB]/20' },
  MAT:  { bg: 'bg-[#F3EEFF]', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20' },
  SCI:  { bg: 'bg-[#EDF7ED]', text: 'text-[#2E7D32]', border: 'border-[#2E7D32]/20' },
  ENG:  { bg: 'bg-[#FFF8E6]', text: 'text-[#B45309]', border: 'border-[#B45309]/20' },
  HIS:  { bg: 'bg-[#FEF0F0]', text: 'text-[#C62828]', border: 'border-[#C62828]/20' },
  GEO:  { bg: 'bg-[#EFF8FB]', text: 'text-[#0891B2]', border: 'border-[#0891B2]/20' },
};

const getSubjectStyle = (code: string) => {
  const key = Object.keys(subjectColors).find(k => code.startsWith(k)) || 'default';
  return subjectColors[key];
};

// ─── Circular Progress ────────────────────────────────────────────────────────
const CircularProgress = ({ pct, color = '#1A6FDB', size = 56 }: { pct: number; color?: string; size?: number }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E3E5E8" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LMSPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = useState<'lessons' | 'assignments' | 'progress'>('lessons');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const [submissionUrl, setSubmissionUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lms/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load courses.');
      setCourses(data);
      if (data.length > 0) setSelectedCourse(data[0]);
    } catch (err: any) {
      setError(err.message || 'Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmittingHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/lms/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
        body: JSON.stringify({ assignmentId: selectedAssignment.id, fileUrl: submissionUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed.');
      setSuccess('Assignment submitted successfully!');
      setSubmissionUrl('');
      await fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to register submission.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalCourses = courses.length;
  const totalLessons = courses.reduce((s, c) => s + c.lessons.length, 0);
  const totalAssignments = courses.reduce((s, c) => s + c.assignments.length, 0);
  const submittedCount = courses.reduce((s, c) =>
    s + c.assignments.filter(a => a.submissions.length > 0).length, 0);
  const overallPct = totalAssignments > 0 ? Math.round((submittedCount / totalAssignments) * 100) : 0;

  const pendingAssignments = courses.flatMap(c =>
    c.assignments.filter(a => a.submissions.length === 0).map(a => ({ ...a, courseName: c.name }))
  ).slice(0, 4);

  // Selected course derived stats
  const selSubmitted = selectedCourse?.assignments.filter(a => a.submissions.length > 0).length || 0;
  const selTotal = selectedCourse?.assignments.length || 0;
  const selPct = selTotal > 0 ? Math.round((selSubmitted / selTotal) * 100) : 0;
  const selStyle = selectedCourse ? getSubjectStyle(selectedCourse.subject.code) : subjectColors.default;

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Digital Course LMS</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › Learning Management System</div>
        </div>
        <button
          onClick={fetchCourses}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E3E5E8] bg-white rounded-md text-xs text-[#4A5568] hover:bg-[#F4F6F9] transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* ── Alerts ───────────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-3 rounded-lg bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-[#EDF7ED] text-[#2E7D32] text-xs flex items-start gap-1.5 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#8A94A6]">
          <div className="h-10 w-10 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-4" />
          <span className="text-sm font-medium">Loading your courses...</span>
          <span className="text-xs mt-1">Syncing with the learning platform</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#E3E5E8] bg-white rounded-xl">
          <BookOpen className="h-12 w-12 text-[#E3E5E8] mx-auto mb-3" />
          <div className="text-sm font-semibold text-[#1A1F36]">No courses assigned yet</div>
          <div className="text-xs text-[#8A94A6] mt-1">Your courses will appear here once your teacher adds them.</div>
        </div>
      ) : (
        <>
          {/* ── KPI Stats Bar ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Enrolled Courses', value: totalCourses, icon: BookMarked, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
              { label: 'Total Lessons', value: totalLessons, icon: PlayCircle, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
              { label: 'Assignments Done', value: `${submittedCount}/${totalAssignments}`, icon: ClipboardCheck, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
              { label: 'Overall Progress', value: `${overallPct}%`, icon: TrendingUp, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
            ].map(kpi => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="p-4 border border-[#E3E5E8] bg-white rounded-xl flex items-center gap-4 hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all">
                  <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#1A1F36]">{kpi.value}</div>
                    <div className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{kpi.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Main Layout ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ── Left: Course List ──────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">My Courses</h3>
                <span className="text-[10px] text-[#8A94A6]">{totalCourses} enrolled</span>
              </div>
              <div className="space-y-2">
                {courses.map((course) => {
                  const style = getSubjectStyle(course.subject.code);
                  const isActive = selectedCourse?.id === course.id;
                  const submitted = course.assignments.filter(a => a.submissions.length > 0).length;
                  const pct = course.assignments.length > 0
                    ? Math.round((submitted / course.assignments.length) * 100) : 0;

                  return (
                    <button
                      key={course.id}
                      onClick={() => { setSelectedCourse(course); setSelectedAssignment(null); setActiveTab('lessons'); }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-white border-[#1A6FDB] shadow-md shadow-[#1A6FDB]/10'
                          : 'bg-white border-[#E3E5E8] hover:border-[#C8CDD5] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`h-8 w-8 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
                          <BookOpen className={`h-4 w-4 ${style.text}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#1A1F36] truncate">{course.name}</div>
                          <div className="text-[10px] text-[#8A94A6] font-mono">{course.subject.code}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-[#8A94A6]">
                          <span>{course.lessons.length} lessons · {course.assignments.length} tasks</span>
                          <span className={`font-bold ${isActive ? 'text-[#1A6FDB]' : ''}`}>{pct}%</span>
                        </div>
                        <div className="h-1 bg-[#E3E5E8] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isActive ? 'bg-[#1A6FDB]' : 'bg-[#C8CDD5]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── Pending Assignments quick panel ─────────────────────────── */}
              {pendingAssignments.length > 0 && (
                <div className="mt-4 p-3.5 border border-[#F5E6C0] bg-[#FFFDF0] rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#B45309]" />
                    <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider">Pending Tasks</span>
                  </div>
                  {pendingAssignments.map(a => (
                    <div key={a.id} className="text-xs text-[#4A5568]">
                      <span className="font-semibold text-[#1A1F36]">{a.title}</span>
                      <span className="text-[#8A94A6]"> · Due {new Date(a.dueDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Course Detail ────────────────────────────────────────── */}
            {selectedCourse && (
              <div className="lg:col-span-9 space-y-4">

                {/* Course Header Card */}
                <div className={`p-5 rounded-xl border ${selStyle.border} bg-white flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl ${selStyle.bg} flex items-center justify-center shrink-0`}>
                      <BookMarked className={`h-6 w-6 ${selStyle.text}`} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#1A1F36]">{selectedCourse.name}</h2>
                      <div className="text-xs text-[#8A94A6] mt-0.5">
                        {selectedCourse.subject.code} — {selectedCourse.subject.name}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-[#4A5568] flex items-center gap-1">
                          <PlayCircle className="h-3 w-3" /> {selectedCourse.lessons.length} Chapters
                        </span>
                        <span className="text-[10px] text-[#4A5568] flex items-center gap-1">
                          <ClipboardCheck className="h-3 w-3" /> {selTotal} Assignments
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selStyle.bg} ${selStyle.text}`}>
                          {selPct}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-center relative">
                    <CircularProgress pct={selPct} color={selStyle.text.replace('text-[', '').replace(']', '')} size={64} />
                    <span className="absolute text-[11px] font-bold text-[#1A1F36]">{selPct}%</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#E3E5E8] gap-1">
                  {(['lessons', 'assignments', 'progress'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs font-semibold capitalize transition-all border-b-2 -mb-px ${
                        activeTab === tab
                          ? 'border-[#1A6FDB] text-[#1A6FDB]'
                          : 'border-transparent text-[#8A94A6] hover:text-[#1A1F36]'
                      }`}
                    >
                      {tab === 'lessons' && <span className="flex items-center gap-1.5"><PlayCircle className="h-3.5 w-3.5" />Lessons</span>}
                      {tab === 'assignments' && <span className="flex items-center gap-1.5"><ClipboardCheck className="h-3.5 w-3.5" />Assignments</span>}
                      {tab === 'progress' && <span className="flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" />Progress</span>}
                    </button>
                  ))}
                </div>

                {/* ── Tab: Lessons ─────────────────────────────────────────────── */}
                {activeTab === 'lessons' && (
                  <div className="space-y-3">
                    {selectedCourse.lessons.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[#E3E5E8] bg-white rounded-xl">
                        <Video className="h-10 w-10 text-[#E3E5E8] mx-auto mb-2" />
                        <div className="text-sm font-semibold text-[#8A94A6]">No lessons uploaded yet</div>
                        <div className="text-xs text-[#8A94A6] mt-1">Your teacher will add chapters here soon.</div>
                      </div>
                    ) : (
                      selectedCourse.lessons.map((lesson, idx) => {
                        const isOpen = expandedLesson === lesson.id;
                        return (
                          <div
                            key={lesson.id}
                            className={`border rounded-xl bg-white overflow-hidden transition-all ${isOpen ? 'border-[#1A6FDB] shadow-md shadow-[#1A6FDB]/10' : 'border-[#E3E5E8] hover:border-[#C8CDD5]'}`}
                          >
                            <button
                              className="w-full flex items-center justify-between p-4"
                              onClick={() => setExpandedLesson(isOpen ? null : lesson.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${isOpen ? 'bg-[#1A6FDB] text-white' : 'bg-[#F4F6F9] text-[#4A5568]'}`}>
                                  {String(idx + 1).padStart(2, '0')}
                                </div>
                                <div className="text-left">
                                  <div className="text-sm font-semibold text-[#1A1F36]">{lesson.title}</div>
                                  <div className="text-[10px] text-[#8A94A6] mt-0.5">
                                    Added {new Date(lesson.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] px-2 py-0.5 bg-[#EDF7ED] text-[#2E7D32] rounded-full font-bold">Available</span>
                                <ChevronDown className={`h-4 w-4 text-[#8A94A6] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </div>
                            </button>

                            {isOpen && (
                              <div className="border-t border-[#E3E5E8] p-4 bg-[#F7F9FD] space-y-3">
                                {lesson.description && (
                                  <p className="text-xs text-[#4A5568] leading-relaxed">{lesson.description}</p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                  {lesson.contentUrl && (
                                    <a
                                      href={lesson.contentUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 p-3 bg-white border border-[#1A6FDB]/30 rounded-lg hover:bg-[#EDF3FF] transition-colors group"
                                    >
                                      <Download className="h-4 w-4 text-[#1A6FDB]" />
                                      <span className="text-xs font-semibold text-[#1A6FDB]">Download Study Guide</span>
                                    </a>
                                  )}
                                  <div className="flex items-center gap-2 p-3 bg-white border border-[#E3E5E8] rounded-lg opacity-60 cursor-not-allowed">
                                    <Video className="h-4 w-4 text-[#8A94A6]" />
                                    <span className="text-xs text-[#8A94A6]">Video Lecture</span>
                                    <Lock className="h-3 w-3 text-[#8A94A6] ml-auto" />
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-white border border-[#E3E5E8] rounded-lg opacity-60 cursor-not-allowed">
                                    <Target className="h-4 w-4 text-[#8A94A6]" />
                                    <span className="text-xs text-[#8A94A6]">Quick Quiz</span>
                                    <Lock className="h-3 w-3 text-[#8A94A6] ml-auto" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ── Tab: Assignments ─────────────────────────────────────────── */}
                {activeTab === 'assignments' && (
                  <div className="space-y-3">
                    {selectedCourse.assignments.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[#E3E5E8] bg-white rounded-xl">
                        <ClipboardCheck className="h-10 w-10 text-[#E3E5E8] mx-auto mb-2" />
                        <div className="text-sm font-semibold text-[#8A94A6]">No assignments yet</div>
                      </div>
                    ) : (
                      selectedCourse.assignments.map((assign) => {
                        const submitted = assign.submissions.length > 0;
                        const isSelected = selectedAssignment?.id === assign.id;
                        const isOverdue = !submitted && new Date(assign.dueDate) < new Date();
                        return (
                          <div key={assign.id} className={`border rounded-xl bg-white overflow-hidden transition-all ${
                            isSelected ? 'border-[#1A6FDB] shadow-md shadow-[#1A6FDB]/10' :
                            submitted ? 'border-[#2E7D32]/30' :
                            isOverdue ? 'border-[#C62828]/30' :
                            'border-[#E3E5E8] hover:border-[#C8CDD5]'
                          }`}>
                            <button
                              className="w-full flex items-center justify-between p-4"
                              onClick={() => setSelectedAssignment(isSelected ? null : assign)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                  submitted ? 'bg-[#EDF7ED]' : isOverdue ? 'bg-[#FEF0F0]' : 'bg-[#FFF8E6]'
                                }`}>
                                  {submitted
                                    ? <CheckCheck className="h-4 w-4 text-[#2E7D32]" />
                                    : isOverdue
                                    ? <AlertCircle className="h-4 w-4 text-[#C62828]" />
                                    : <Clock className="h-4 w-4 text-[#B45309]" />
                                  }
                                </div>
                                <div className="text-left">
                                  <div className="text-sm font-semibold text-[#1A1F36]">{assign.title}</div>
                                  <div className="text-[10px] text-[#8A94A6] mt-0.5">
                                    Due: {new Date(assign.dueDate).toLocaleDateString()}
                                    {submitted && assign.submissions[0].marks && (
                                      <span className="ml-2 font-bold text-[#2E7D32]">Score: {assign.submissions[0].marks}/100</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                submitted ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                                isOverdue ? 'bg-[#FEF0F0] text-[#C62828]' :
                                'bg-[#FFF8E6] text-[#B45309]'
                              }`}>
                                {submitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending'}
                              </span>
                            </button>

                            {isSelected && (
                              <div className="border-t border-[#E3E5E8] p-4 space-y-4 bg-[#F7F9FD]">
                                {assign.description && (
                                  <p className="text-xs text-[#4A5568] leading-relaxed">{assign.description}</p>
                                )}
                                {assign.fileUrl && (
                                  <a href={assign.fileUrl} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-[#1A6FDB] hover:underline font-medium">
                                    <Download className="h-3.5 w-3.5" /> Download Worksheet
                                  </a>
                                )}

                                {submitted ? (
                                  <div className="p-4 bg-[#EDF7ED] rounded-xl border border-[#2E7D32]/20 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-[#2E7D32]">
                                      <CheckCircle2 className="h-4 w-4" /> Homework Submitted!
                                    </div>
                                    <div className="text-[11px] text-[#4A5568] font-mono break-all">
                                      {assign.submissions[0].fileUrl}
                                    </div>
                                    {assign.submissions[0].marks && (
                                      <div className="flex items-center gap-3 pt-2 border-t border-[#2E7D32]/20">
                                        <div className="text-2xl font-bold text-[#1A1F36]">{assign.submissions[0].marks}</div>
                                        <div className="text-xs text-[#4A5568]">/ 100 points</div>
                                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                          Number(assign.submissions[0].marks) >= 75 ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                                          Number(assign.submissions[0].marks) >= 50 ? 'bg-[#FFF8E6] text-[#B45309]' :
                                          'bg-[#FEF0F0] text-[#C62828]'
                                        }`}>
                                          {Number(assign.submissions[0].marks) >= 75 ? 'Distinction' :
                                           Number(assign.submissions[0].marks) >= 50 ? 'Pass' : 'Needs Improvement'}
                                        </div>
                                      </div>
                                    )}
                                    {assign.submissions[0].feedback && (
                                      <div className="text-xs italic text-[#4A5568] bg-white/70 p-2 rounded-lg">
                                        💬 "{assign.submissions[0].feedback}"
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <form onSubmit={handleSubmittingHomework} className="space-y-3">
                                    <div className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Submit Your Work</div>
                                    <div>
                                      <label className="block text-[10px] font-semibold text-[#4A5568] mb-1">
                                        Paste your Google Drive / OneDrive / URL link
                                      </label>
                                      <input
                                        type="url"
                                        required
                                        placeholder="https://drive.google.com/..."
                                        value={submissionUrl}
                                        onChange={e => setSubmissionUrl(e.target.value)}
                                        className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-lg text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                                      />
                                    </div>
                                    <button
                                      type="submit"
                                      disabled={submitting}
                                      className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs transition-colors disabled:opacity-60"
                                    >
                                      <UploadCloud className="h-3.5 w-3.5" />
                                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                                    </button>
                                  </form>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ── Tab: Progress ─────────────────────────────────────────────── */}
                {activeTab === 'progress' && (
                  <div className="space-y-4">
                    {/* Overall progress card */}
                    <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl">
                      <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider mb-4">Assignment Completion</div>
                      <div className="space-y-3">
                        {selectedCourse.assignments.map(assign => {
                          const done = assign.submissions.length > 0;
                          const score = assign.submissions[0]?.marks ? Number(assign.submissions[0].marks) : null;
                          return (
                            <div key={assign.id} className="flex items-center gap-3">
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-[#EDF7ED]' : 'bg-[#F4F6F9]'}`}>
                                {done ? <CheckCircle2 className="h-3 w-3 text-[#2E7D32]" /> : <Circle className="h-3 w-3 text-[#C8CDD5]" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-medium text-[#1A1F36] truncate">{assign.title}</span>
                                  <span className={`text-[10px] font-bold ml-2 shrink-0 ${done ? 'text-[#2E7D32]' : 'text-[#8A94A6]'}`}>
                                    {score !== null ? `${score}/100` : done ? 'Submitted' : 'Pending'}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-[#E3E5E8] rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      score !== null
                                        ? score >= 75 ? 'bg-[#2E7D32]' : score >= 50 ? 'bg-[#B45309]' : 'bg-[#C62828]'
                                        : done ? 'bg-[#1A6FDB]' : 'bg-[#E3E5E8]'
                                    }`}
                                    style={{ width: score !== null ? `${score}%` : done ? '100%' : '0%' }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Achievement badges */}
                    <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-3">
                      <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Achievements</div>
                      <div className="flex gap-3 flex-wrap">
                        {[
                          { label: 'Early Bird', desc: 'Submit before deadline', earned: submittedCount > 0, icon: '🌅' },
                          { label: 'High Scorer', desc: 'Score above 75%', earned: selectedCourse.assignments.some(a => Number(a.submissions[0]?.marks) >= 75), icon: '⭐' },
                          { label: 'Perfect Streak', desc: 'Submit all assignments', earned: selSubmitted === selTotal && selTotal > 0, icon: '🔥' },
                          { label: 'Quick Learner', desc: 'Complete 5+ lessons', earned: selectedCourse.lessons.length >= 5, icon: '⚡' },
                        ].map(badge => (
                          <div key={badge.label} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            badge.earned ? 'bg-[#FFF8E6] border-[#F5E6C0]' : 'bg-[#F4F6F9] border-[#E3E5E8] opacity-50'
                          }`}>
                            <span className="text-2xl">{badge.icon}</span>
                            <div>
                              <div className={`text-xs font-bold ${badge.earned ? 'text-[#B45309]' : 'text-[#8A94A6]'}`}>{badge.label}</div>
                              <div className="text-[10px] text-[#8A94A6]">{badge.desc}</div>
                            </div>
                            {badge.earned && <CheckCircle2 className="h-4 w-4 text-[#2E7D32] ml-auto" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
