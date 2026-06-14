'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, AlertCircle, CheckCircle, Search } from 'lucide-react';

interface Student {
  id: string;
  admissionNo: string;
  user: { firstName: string; lastName: string; email: string };
}

export default function MarkAttendancePage() {
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceStates, setAttendanceStates] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendance/students?classId=${classId}&sectionId=${sectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to search students.');

      setStudents(data);
      // Initialize states
      const states: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
      data.forEach((s: Student) => {
        states[s.id] = 'PRESENT'; // default status
      });
      setAttendanceStates(states);
    } catch (err: any) {
      setError(err.message || 'Failed to search students.');
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceStates(prev => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkChange = (studentId: string, text: string) => {
    setRemarks(prev => ({ ...prev, [studentId]: text }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const records = Object.keys(attendanceStates).map(studentId => ({
        studentId,
        status: attendanceStates[studentId],
        remarks: remarks[studentId] || undefined,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
        body: JSON.stringify({ date, records }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to mark attendance.');

      setSuccess('Classroom attendance successfully registered for this date!');
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/attendance" className="h-7 w-7 rounded border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] flex items-center justify-center transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#1A1F36]">Mark Daily Roll-Call</h1>
            <div className="text-xs text-[#8A94A6] mt-0.5">
              averqonerp &gt; Attendance &gt; Roll-Call Mark
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 border-none font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-md bg-[#EDF7ED] text-[#2E7D32] text-xs flex items-start gap-1.5 border-none font-medium">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter Form */}
      <form onSubmit={handleSearch} className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col md:flex-row gap-4 items-end">
        <div className="space-y-1 flex-1">
          <label htmlFor="classId" className="block text-xs font-semibold text-[#4A5568]">
            Class ID
          </label>
          <input
            type="text"
            id="classId"
            required
            placeholder="Paste Class UUID"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 font-mono"
          />
        </div>
        <div className="space-y-1 flex-1">
          <label htmlFor="sectionId" className="block text-xs font-semibold text-[#4A5568]">
            Section ID
          </label>
          <input
            type="text"
            id="sectionId"
            required
            placeholder="Paste Section UUID"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 font-mono"
          />
        </div>
        <div className="space-y-1 flex-1">
          <label htmlFor="date" className="block text-xs font-semibold text-[#4A5568]">
            Roll-Call Date
          </label>
          <input
            type="date"
            id="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12"
          />
        </div>
        <button
          type="submit"
          className="h-9 px-5 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
        >
          <Search className="h-3.5 w-3.5" /> Load Student Checklist
        </button>
      </form>

      {/* Student Checklist */}
      {students.length > 0 && (
        <div className="space-y-4">
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[11px] tracking-wider select-none">
                  <th className="p-3.5 pl-4">Admission No</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5 text-center">Status Selection</th>
                  <th className="p-3.5 pr-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-3.5 pl-4 font-mono text-[#8A94A6]">{student.admissionNo}</td>
                    <td className="p-3.5 font-semibold text-[#1A1F36]">{student.user.firstName} {student.user.lastName}</td>
                    <td className="p-3.5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setStatus(student.id, 'PRESENT')}
                          className={`h-7 px-3 rounded text-[11px] font-semibold border transition-all ${
                            attendanceStates[student.id] === 'PRESENT'
                              ? 'bg-[#EDF7ED] text-[#2E7D32] border-[#2E7D32]/40 shadow-none'
                              : 'border-[#E3E5E8] bg-white text-[#8A94A6] hover:text-[#4A5568]'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => setStatus(student.id, 'ABSENT')}
                          className={`h-7 px-3 rounded text-[11px] font-semibold border transition-all ${
                            attendanceStates[student.id] === 'ABSENT'
                              ? 'bg-[#FEF0F0] text-[#C62828] border-[#C62828]/40 shadow-none'
                              : 'border-[#E3E5E8] bg-white text-[#8A94A6] hover:text-[#4A5568]'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => setStatus(student.id, 'LATE')}
                          className={`h-7 px-3 rounded text-[11px] font-semibold border transition-all ${
                            attendanceStates[student.id] === 'LATE'
                              ? 'bg-[#FFF8E6] text-[#B45309] border-[#B45309]/40 shadow-none'
                              : 'border-[#E3E5E8] bg-white text-[#8A94A6] hover:text-[#4A5568]'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 pr-4">
                      <input
                        type="text"
                        placeholder="Add register notes..."
                        value={remarks[student.id] || ''}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                        className="w-full h-8 px-2.5 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="h-9 px-6 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] font-semibold text-white text-xs transition-colors flex items-center justify-center"
            >
              {loading ? 'Submitting Register...' : 'Submit Attendance Register'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
