'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, Download, Building2, MoreVertical, Edit2, Ban, Trash2, CheckCircle2 } from 'lucide-react';

interface School {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  _count: {
    users: number;
    students: number;
  };
}

export default function PlatformSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform-admin/schools`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSchools(data);
      }
    } catch (err) {
      console.error('Failed to fetch schools', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#1A6FDB]" />
            Tenant Schools
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Manage and monitor all school workspaces on the platform</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export Data
          </button>
          <Link 
            href="/dashboard/admin/schools/add"
            className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Onboard School
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm">
        <div className="p-4 border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA] rounded-t-lg">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
            <input 
              type="text"
              placeholder="Search by school name or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
            />
          </div>
          <button className="h-9 px-4 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9] text-[#4A5568] uppercase tracking-wider font-semibold">
                <th className="p-4">School Organization</th>
                <th className="p-4">Tenant Domain</th>
                <th className="p-4">Users / Students</th>
                <th className="p-4">Status</th>
                <th className="p-4">Onboarded</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-6 w-6 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
                      <span className="text-xs font-medium text-[#8A94A6]">Loading tenant data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#8A94A6] text-sm">
                    No schools found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSchools.map(school => (
                  <tr key={school.id} className="hover:bg-[#F7F8FA] transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-[#1A1F36] text-[13px]">{school.name}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5 font-mono">{school.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-[#1A6FDB] font-medium hover:underline cursor-pointer flex items-center gap-1">
                        {school.domain}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[#1A1F36]">{school._count.users}</span>
                          <span className="text-[9px] text-[#8A94A6] uppercase tracking-wider">Users</span>
                        </div>
                        <div className="h-6 w-px bg-[#E3E5E8]" />
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-[#1A1F36]">{school._count.students}</span>
                          <span className="text-[9px] text-[#8A94A6] uppercase tracking-wider">Students</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#EDF7ED] text-[#2E7D32] border border-[#C5E1A5]">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    </td>
                    <td className="p-4 text-[#4A5568]">
                      {new Date(school.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Edit School" className="p-1.5 text-[#8A94A6] hover:text-[#1A6FDB] hover:bg-[#EDF3FF] rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button title="Suspend Tenant" className="p-1.5 text-[#8A94A6] hover:text-[#ED6C02] hover:bg-[#FFF4E5] rounded transition-colors">
                          <Ban className="h-4 w-4" />
                        </button>
                        <button title="Delete Workspace" className="p-1.5 text-[#8A94A6] hover:text-[#C62828] hover:bg-[#FEF0F0] rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
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
