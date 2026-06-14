'use client';

import { useState } from 'react';
import { Search, Filter, GraduationCap, Download, ExternalLink, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

const MOCK_STUDENTS = [
  { id: '1', name: 'Aarav Patel', rollNo: '101', class: '10-A', gender: 'Male', parent: 'Rajesh Patel', phone: '+91 9876543210' },
  { id: '2', name: 'Diya Sharma', rollNo: '102', class: '10-A', gender: 'Female', parent: 'Sunita Sharma', phone: '+91 9876543211' },
  { id: '3', name: 'Vihaan Kumar', rollNo: '103', class: '10-B', gender: 'Male', parent: 'Anita Kumar', phone: '+91 9876543212' },
  { id: '4', name: 'Ananya Singh', rollNo: '104', class: '9-A', gender: 'Female', parent: 'Vikram Singh', phone: '+91 9876543213' },
  { id: '5', name: 'Rohan Gupta', rollNo: '105', class: '9-B', gender: 'Male', parent: 'Meera Gupta', phone: '+91 9876543214' },
];

export default function StudentListPage() {
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.includes(search);
    const matchClass = selectedClass === 'All Classes' || s.class === selectedClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#1A6FDB]" />
            Student Directory
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">View and manage students enrolled in your classes</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export Data
          </button>
        </div>
      </div>

      {/* Main content table */}
      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA] rounded-t-lg">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
            <input 
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 px-3 border border-[#C8CDD5] rounded-md text-xs font-medium text-[#1A1F36] bg-white focus:outline-none focus:border-[#1A6FDB] transition-all"
            >
              <option value="All Classes">All Classes</option>
              <option value="10-A">10-A</option>
              <option value="10-B">10-B</option>
              <option value="9-A">9-A</option>
              <option value="9-B">9-B</option>
            </select>
            <button className="h-9 px-4 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
              <Filter className="h-3.5 w-3.5" /> More Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9] text-[#4A5568] uppercase tracking-wider font-semibold">
                <th className="p-4 w-16">Roll No</th>
                <th className="p-4">Student Info</th>
                <th className="p-4">Class</th>
                <th className="p-4">Parent Contact</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#8A94A6] text-sm">
                    {search ? 'No students found matching your search.' : 'No students found in this class.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-[#F7F8FA] transition-colors group">
                    <td className="p-4 font-mono font-medium text-[#4A5568]">{student.rollNo}</td>
                    <td className="p-4">
                      <div className="font-semibold text-[#1A1F36]">{student.name}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5">{student.gender}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F0FD] text-[#1A6FDB]">
                        {student.class}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[#1A1F36]">{student.parent}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#8A94A6]">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {student.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="View Profile" className="p-1.5 text-[#8A94A6] hover:text-[#1A6FDB] hover:bg-[#EDF3FF] rounded transition-colors">
                          <ExternalLink className="h-4 w-4" />
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
