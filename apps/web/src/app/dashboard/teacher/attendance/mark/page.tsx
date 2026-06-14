'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Check, X, Clock, AlertCircle, Filter, Search, Save } from 'lucide-react';

const MOCK_CLASSES = ['Class 10-A', 'Class 9-B', 'Class 8-C'];
const MOCK_STUDENTS = [
  { id: '1', name: 'Aarav Patel', rollNo: '101', status: 'PRESENT' },
  { id: '2', name: 'Diya Sharma', rollNo: '102', status: 'PRESENT' },
  { id: '3', name: 'Vihaan Kumar', rollNo: '103', status: 'ABSENT' },
  { id: '4', name: 'Ananya Singh', rollNo: '104', status: 'LATE' },
  { id: '5', name: 'Rohan Gupta', rollNo: '105', status: 'PRESENT' },
  { id: '6', name: 'Ishita Reddy', rollNo: '106', status: 'PRESENT' },
];

export default function MarkAttendancePage() {
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleStatusChange = (id: string, status: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    setSaved(false);
  };

  const markAllAs = (status: string) => {
    setStudents(students.map(s => ({ ...s, status })));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 800);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNo.includes(search)
  );

  const stats = {
    total: students.length,
    present: students.filter(s => s.status === 'PRESENT').length,
    absent: students.filter(s => s.status === 'ABSENT').length,
    late: students.filter(s => s.status === 'LATE').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#1A6FDB]" />
            Mark Attendance
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Record daily attendance for your allocated classes</div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-9 px-3 border border-[#C8CDD5] rounded-md text-xs font-medium text-[#1A1F36] bg-white focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
          >
            {MOCK_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 px-3 border border-[#C8CDD5] rounded-md text-xs font-medium text-[#1A1F36] bg-white focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.total, color: 'text-[#1A1F36]', bg: 'bg-[#F4F6F9]' },
          { label: 'Present', value: stats.present, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
          { label: 'Absent', value: stats.absent, color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]' },
          { label: 'Late', value: stats.late, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
        ].map(stat => (
          <div key={stat.label} className="p-4 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{stat.label}</span>
            <div className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Actions and List */}
      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm flex flex-col">
        <div className="p-4 border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA] rounded-t-lg">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
            <input 
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#8A94A6] mr-2">Mark All As:</span>
            <button onClick={() => markAllAs('PRESENT')} className="h-8 px-3 rounded text-[11px] font-bold uppercase bg-[#EDF7ED] text-[#2E7D32] hover:bg-[#D4EDD4] transition-colors">Present</button>
            <button onClick={() => markAllAs('ABSENT')} className="h-8 px-3 rounded text-[11px] font-bold uppercase bg-[#FEF0F0] text-[#C62828] hover:bg-[#FAD4D4] transition-colors">Absent</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E5E8] bg-white text-[#4A5568] uppercase tracking-wider font-semibold">
                <th className="p-4 w-20 text-center">Roll No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-[#8A94A6]">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-4 font-mono text-center text-[#4A5568]">{student.rollNo}</td>
                    <td className="p-4 font-semibold text-[#1A1F36]">{student.name}</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex rounded-md shadow-sm border border-[#E3E5E8] overflow-hidden">
                        <button
                          onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${student.status === 'PRESENT' ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#4A5568] hover:bg-[#F4F6F9]'}`}
                        >
                          <Check className="h-3 w-3 inline mr-1" /> P
                        </button>
                        <div className="w-px bg-[#E3E5E8]" />
                        <button
                          onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${student.status === 'ABSENT' ? 'bg-[#C62828] text-white' : 'bg-white text-[#4A5568] hover:bg-[#F4F6F9]'}`}
                        >
                          <X className="h-3 w-3 inline mr-1" /> A
                        </button>
                        <div className="w-px bg-[#E3E5E8]" />
                        <button
                          onClick={() => handleStatusChange(student.id, 'LATE')}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${student.status === 'LATE' ? 'bg-[#B45309] text-white' : 'bg-white text-[#4A5568] hover:bg-[#F4F6F9]'}`}
                        >
                          <Clock className="h-3 w-3 inline mr-1" /> L
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <input 
                        type="text" 
                        placeholder="Optional note..."
                        className="w-40 px-2 py-1.5 text-[11px] border border-[#E3E5E8] rounded bg-white focus:outline-none focus:border-[#1A6FDB] transition-colors"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#E3E5E8] bg-[#F7F8FA] rounded-b-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs font-semibold text-[#2E7D32] flex items-center gap-1"><Check className="h-4 w-4" /> Attendance saved successfully</span>}
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-6 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] disabled:bg-[#8A94A6] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/30 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
