'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface AttendanceLog {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  remarks?: string;
}

export default function AttendanceDashboard() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        if (!token || !userStr) throw new Error('Unauthorized');
        const user = JSON.parse(userStr);
        setRole(user.role);

        // Fetch logs (only relevant for students/parents)
        if (user.role === 'STUDENT' || user.role === 'PARENT') {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendance/my-logs`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-school-id': user.schoolId,
            },
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to load logs.');
          setLogs(data);
        }
      } catch (err: any) {
        setError(err.message || 'Connection failure.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const isStaff = role === 'SUPER_ADMIN' || role === 'TEACHER';

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Attendance Registry</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">
            averqonerp &gt; Attendance Logs
          </div>
        </div>
        {isStaff && (
          <Link
            href="/dashboard/attendance/mark"
            className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] font-semibold text-white text-xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Mark Classroom Attendance
          </Link>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 border-none font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isStaff ? (
        <div className="p-8 border border-[#E3E5E8] bg-white rounded-lg text-center space-y-3">
          <Calendar className="h-10 w-10 text-[#1A6FDB] mx-auto" />
          <h3 className="text-sm font-semibold text-[#1A1F36]">Staff Portal Controls</h3>
          <p className="text-[#4A5568] text-xs max-w-md mx-auto leading-relaxed">
            Staff and Administrators do not have personal daily roll-call log sheets. Use the button above to load student listings and mark attendance.
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8A94A6]">
          <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
          <span className="text-xs font-medium">Fetching log sheets...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#E3E5E8] bg-white rounded-lg text-[#8A94A6] font-normal text-xs">
          No attendance records found for this student.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
              <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Total Present</span>
              <div className="text-2xl font-bold text-[#2E7D32] mt-2">
                {logs.filter(l => l.status === 'PRESENT').length} Days
              </div>
            </div>
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
              <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Total Absent</span>
              <div className="text-2xl font-bold text-[#C62828] mt-2">
                {logs.filter(l => l.status === 'ABSENT').length} Days
              </div>
            </div>
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
              <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Late / Tardy</span>
              <div className="text-2xl font-bold text-[#B45309] mt-2">
                {logs.filter(l => l.status === 'LATE' || l.status === 'HALF_DAY').length} Days
              </div>
            </div>
          </div>

          {/* List Table */}
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] font-semibold text-[#1A1F36] text-xs">
              Daily Attendance Register
            </div>
            <div className="divide-y divide-[#E3E5E8]">
              {logs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#F7F8FA] transition-colors">
                  <span className="font-mono text-[#4A5568]">{new Date(log.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-4">
                    {log.remarks && <span className="text-xs text-[#8A94A6] italic font-light">"{log.remarks}"</span>}
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      log.status === 'PRESENT' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                      log.status === 'ABSENT' ? 'bg-[#FEF0F0] text-[#C62828]' :
                      'bg-[#FFF8E6] text-[#B45309]'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
