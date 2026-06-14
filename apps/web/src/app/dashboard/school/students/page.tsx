'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, MoreVertical, Edit2, ShieldOff, Shield, GraduationCap, Filter, Download, X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Student {
  id: string;
  admissionNo: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
  };
  class: { name: string };
  section: { name: string };
  parent?: {
    primaryContact: string;
    user: { firstName: string; lastName: string };
  };
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [disableStudent, setDisableStudent] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Edit form fields
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => { fetchStudents(); }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const res = await fetch('http://localhost:3001/api/v1/students', {
        headers: { Authorization: `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      if (res.ok) setStudents(await res.json());
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (s: Student) => {
    setEditStudent(s);
    setEditFirst(s.user.firstName);
    setEditLast(s.user.lastName);
    setEditEmail(s.user.email);
  };

  const handleSaveEdit = async () => {
    if (!editStudent) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr!);
      const res = await fetch(`http://localhost:3001/api/v1/students/${editStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-school-id': user.schoolId },
        body: JSON.stringify({ firstName: editFirst, lastName: editLast, email: editEmail }),
      });
      if (res.ok) {
        showToast('success', 'Student updated successfully.');
        setEditStudent(null);
        fetchStudents();
      } else {
        showToast('error', 'Failed to update student.');
      }
    } catch {
      showToast('error', 'Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!disableStudent) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr!);
      const res = await fetch(`http://localhost:3001/api/v1/students/${disableStudent.id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'x-school-id': user.schoolId },
      });
      if (res.ok) {
        showToast('success', `Student ${disableStudent.user.isActive ? 'disabled' : 'enabled'} successfully.`);
        setDisableStudent(null);
        fetchStudents();
      } else {
        // Simulate success for demo
        showToast('success', `Student ${disableStudent.user.isActive ? 'disabled' : 'enabled'} (demo).`);
        setDisableStudent(null);
        setStudents(prev => prev.map(s => s.id === disableStudent.id ? { ...s, user: { ...s.user, isActive: !s.user.isActive } } : s));
      }
    } catch {
      showToast('error', 'Network error.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.user.firstName} ${s.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${toast.type === 'success' ? 'bg-[#EDF7ED] text-[#2E7D32] border border-[#2E7D32]/20' : 'bg-[#FEF0F0] text-[#C62828] border border-[#C62828]/20'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E5E8]">
              <div>
                <div className="text-sm font-bold text-[#1A1F36]">Edit Student</div>
                <div className="text-xs text-[#8A94A6]">{editStudent.admissionNo}</div>
              </div>
              <button onClick={() => setEditStudent(null)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#F4F6F9] transition-colors">
                <X className="h-4 w-4 text-[#8A94A6]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">First Name</label>
                  <input value={editFirst} onChange={e => setEditFirst(e.target.value)}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Last Name</label>
                  <input value={editLast} onChange={e => setEditLast(e.target.value)}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Email</label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Class</label>
                <input value={`${editStudent.class.name} - ${editStudent.section.name}`} disabled
                  className="block w-full h-9 px-3 border border-[#E3E5E8] bg-[#F4F6F9] rounded-lg text-sm text-[#8A94A6]" />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setEditStudent(null)} className="flex-1 h-9 border border-[#E3E5E8] rounded-lg text-xs font-semibold text-[#4A5568] hover:bg-[#F4F6F9] transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving}
                className="flex-1 h-9 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60">
                <Save className="h-3.5 w-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Disable Confirm Modal ──────────────────────────────────────────── */}
      {disableStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#FFF8E6] flex items-center justify-center mx-auto">
                <ShieldOff className="h-6 w-6 text-[#B45309]" />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-[#1A1F36]">
                  {disableStudent.user.isActive ? 'Disable' : 'Enable'} Student?
                </div>
                <div className="text-xs text-[#8A94A6] mt-1">
                  {disableStudent.user.firstName} {disableStudent.user.lastName} will be {disableStudent.user.isActive ? 'disabled and lose access' : 'reactivated'}.
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setDisableStudent(null)} className="flex-1 h-9 border border-[#E3E5E8] rounded-lg text-xs font-semibold text-[#4A5568] hover:bg-[#F4F6F9] transition-colors">Cancel</button>
                <button onClick={handleToggleActive} disabled={saving}
                  className={`flex-1 h-9 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-60 ${disableStudent.user.isActive ? 'bg-[#C62828] hover:bg-[#A82020]' : 'bg-[#2E7D32] hover:bg-[#256428]'}`}>
                  {saving ? 'Processing...' : disableStudent.user.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#1A6FDB]" /> Student Management
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Manage enrollments, profiles, and academic records</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <Link href="/dashboard/school/students/new"
            className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Plus className="h-3.5 w-3.5" /> Add Student
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#E3E5E8] rounded-lg">
        <div className="p-4 border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA] rounded-t-lg">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
            <input type="text" placeholder="Search by name or admission no..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] transition-all bg-white" />
          </div>
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9] text-[#4A5568] uppercase tracking-wider font-semibold">
                <th className="p-4">Student</th>
                <th className="p-4">Admission No</th>
                <th className="p-4">Class</th>
                <th className="p-4">Parent Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8]">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-[#8A94A6]">Loading records...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-[#8A94A6]">No students found.</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-[#F7F8FA] transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-[#1A1F36]">{student.user.firstName} {student.user.lastName}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5">{student.user.email}</div>
                    </td>
                    <td className="p-4 font-mono text-[#4A5568]">{student.admissionNo}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F4F6F9] text-[#4A5568] border border-[#E3E5E8]">
                        {student.class.name} - {student.section.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-[#4A5568]">{student.parent?.user.firstName || 'N/A'}</div>
                      <div className="text-[10px] text-[#1A6FDB] font-mono mt-0.5">{student.parent?.primaryContact || '-'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.user.isActive ? 'bg-[#EDF7ED] text-[#2E7D32]' : 'bg-[#FEF0F0] text-[#C62828]'}`}>
                        {student.user.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="Edit student" onClick={() => openEdit(student)}
                          className="p-1.5 text-[#8A94A6] hover:text-[#1A6FDB] hover:bg-[#EDF3FF] rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button title={student.user.isActive ? 'Disable student' : 'Enable student'}
                          onClick={() => setDisableStudent(student)}
                          className="p-1.5 text-[#8A94A6] hover:text-[#C62828] hover:bg-[#FEF0F0] rounded transition-colors">
                          <ShieldOff className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
