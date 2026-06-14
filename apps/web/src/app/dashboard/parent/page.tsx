'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Award, CreditCard, MapPin, Activity, HelpCircle } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  schoolId: string;
}

export default function ParentDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Parent Companion Portal</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp &gt; Parent Panel</div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EDF3FF] text-[#1A6FDB] text-xs font-semibold uppercase tracking-wider">
          Guardian View
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28 hover:border-[#C8CDD5] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all">
          <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Child Attendance</span>
          <div className="text-2xl font-bold text-[#2E7D32] mt-2">94.8% (Good)</div>
        </div>
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28 hover:border-[#C8CDD5] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all">
          <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Current Term GPA</span>
          <div className="text-2xl font-bold text-[#1A6FDB] mt-2">3.50 / 4.00</div>
        </div>
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28 hover:border-[#C8CDD5] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all">
          <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Fee Balances</span>
          <div className="text-2xl font-bold text-[#2E7D32] mt-2">No Due Costs</div>
        </div>
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28 hover:border-[#C8CDD5] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all">
          <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Bus Transit</span>
          <div className="text-2xl font-bold text-[#1A1F36] mt-2">Active Route</div>
        </div>
      </div>

      {/* Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2">Ward Academic & Billing Shortcuts</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/attendance"
              className="p-4 border border-[#E3E5E8] hover:border-[#1A6FDB] rounded-md transition-all space-y-1 block hover:bg-[#E8F0FD]"
            >
              <Calendar className="h-5 w-5 text-[#1A6FDB]" />
              <h4 className="text-xs font-semibold text-[#1A1F36] pt-1">Logs Register</h4>
              <p className="text-[10px] text-[#8A94A6]">Check daily roll-call logs</p>
            </Link>

            <Link
              href="/dashboard/fees"
              className="p-4 border border-[#E3E5E8] hover:border-[#1A6FDB] rounded-md transition-all space-y-1 block hover:bg-[#E8F0FD]"
            >
              <CreditCard className="h-5 w-5 text-[#2E7D32]" />
              <h4 className="text-xs font-semibold text-[#1A1F36] pt-1">Fee Invoices</h4>
              <p className="text-[10px] text-[#8A94A6]">Complete educational cost settlements</p>
            </Link>

            <Link
              href="/dashboard/transport"
              className="p-4 border border-[#E3E5E8] hover:border-[#1A6FDB] rounded-md transition-all space-y-1 block hover:bg-[#E8F0FD]"
            >
              <MapPin className="h-5 w-5 text-[#B45309]" />
              <h4 className="text-xs font-semibold text-[#1A1F36] pt-1">Bus Tracker</h4>
              <p className="text-[10px] text-[#8A94A6]">Verify route timelines and driver contacts</p>
            </Link>
          </div>
        </div>

        {/* Notices */}
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2">Campus Circulars</h3>
          <div className="space-y-3 text-xs text-[#4A5568] leading-relaxed">
            <div className="p-3 border border-[#E3E5E8] bg-[#F4F6F9] rounded-md">
              <span className="font-semibold text-[#1A1F36]">Examinations Transcripts</span>
              <p className="mt-1">Candidates can view midterm scores under results. Reports printout features are active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
