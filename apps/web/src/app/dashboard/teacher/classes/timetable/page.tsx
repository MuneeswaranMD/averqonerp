'use client';

import { useState } from 'react';
import { Calendar, Clock, Download, Printer } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = [
  { id: '1', time: '08:30 - 09:15', label: 'Period 1' },
  { id: '2', time: '09:15 - 10:00', label: 'Period 2' },
  { id: 'break1', time: '10:00 - 10:15', label: 'Short Break', isBreak: true },
  { id: '3', time: '10:15 - 11:00', label: 'Period 3' },
  { id: '4', time: '11:00 - 11:45', label: 'Period 4' },
  { id: 'lunch', time: '11:45 - 12:30', label: 'Lunch Break', isBreak: true },
  { id: '5', time: '12:30 - 01:15', label: 'Period 5' },
  { id: '6', time: '01:15 - 02:00', label: 'Period 6' },
];

const MOCK_SCHEDULE: Record<string, any> = {
  'Monday-1': { class: '10-A', subject: 'Mathematics', room: 'Room 201' },
  'Monday-3': { class: '9-B', subject: 'Physics', room: 'Lab 1' },
  'Monday-4': { class: '10-B', subject: 'Mathematics', room: 'Room 203' },
  'Tuesday-2': { class: '10-A', subject: 'Mathematics', room: 'Room 201' },
  'Tuesday-5': { class: '8-C', subject: 'Algebra', room: 'Room 105' },
  'Wednesday-1': { class: '10-A', subject: 'Mathematics', room: 'Room 201' },
  'Wednesday-6': { class: '9-B', subject: 'Physics', room: 'Lab 1' },
  'Thursday-3': { class: '10-B', subject: 'Mathematics', room: 'Room 203' },
  'Thursday-4': { class: '10-A', subject: 'Mathematics', room: 'Room 201' },
  'Friday-2': { class: '8-C', subject: 'Algebra', room: 'Room 105' },
  'Friday-5': { class: '9-B', subject: 'Physics', room: 'Lab 1' },
};

export default function TimetablePage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#1A6FDB]" />
            My Timetable
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Weekly schedule of your allocated classes</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9]">
                <th className="p-4 w-32 border-r border-[#E3E5E8] text-center font-bold text-[#4A5568] uppercase tracking-wider">
                  <Clock className="h-4 w-4 inline mr-1" /> Time
                </th>
                {DAYS.map(day => (
                  <th key={day} className="p-4 text-center font-bold text-[#1A1F36] uppercase tracking-wider border-r border-[#E3E5E8] last:border-r-0 w-[calc(100%/5)]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8]">
              {PERIODS.map(period => (
                <tr key={period.id} className={period.isBreak ? 'bg-[#F7F8FA]' : 'bg-white'}>
                  <td className="p-3 border-r border-[#E3E5E8] text-center">
                    <div className="font-semibold text-[#1A1F36]">{period.label}</div>
                    <div className="text-[10px] text-[#8A94A6] font-mono mt-0.5">{period.time}</div>
                  </td>
                  
                  {period.isBreak ? (
                    <td colSpan={5} className="p-3 text-center text-[#8A94A6] font-semibold tracking-[0.2em] uppercase text-[10px] bg-[#F7F8FA] opacity-60 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E3E5E8] to-transparent"></div>
                      </div>
                      <span className="relative bg-[#F7F8FA] px-4">{period.label}</span>
                    </td>
                  ) : (
                    DAYS.map(day => {
                      const entry = MOCK_SCHEDULE[`${day}-${period.id}`];
                      return (
                        <td key={`${day}-${period.id}`} className="p-2 border-r border-[#E3E5E8] last:border-r-0 h-24 align-top">
                          {entry ? (
                            <div className="h-full p-2.5 rounded-md border border-[#C8CDD5] bg-[#F4F6F9] hover:bg-[#EDF3FF] hover:border-[#1A6FDB] transition-all cursor-pointer flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-[#1A6FDB] text-xs">{entry.subject}</div>
                                <div className="font-medium text-[#1A1F36] text-[11px] mt-0.5">{entry.class}</div>
                              </div>
                              <div className="text-[10px] text-[#8A94A6] flex items-center gap-1 mt-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]"></span>
                                {entry.room}
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-md border border-dashed border-[#E3E5E8] flex items-center justify-center text-[#8A94A6] opacity-0 hover:opacity-100 hover:bg-[#F7F8FA] transition-all cursor-pointer">
                              <span className="text-[10px] font-medium">+ Add Class</span>
                            </div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
