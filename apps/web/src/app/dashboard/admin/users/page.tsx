import { Users, Filter, Download, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function PlatformUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Users className="h-5 w-5 text-[#1A6FDB]" />
            Global User Management
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Manage accounts across all tenant schools on the platform</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export Data
          </button>
          <button className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Plus className="h-3.5 w-3.5" /> Provision User
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm h-[600px] flex flex-col">
        <div className="p-4 border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA] rounded-t-lg">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
            <input 
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="h-9 px-3 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] text-xs focus:outline-none focus:border-[#1A6FDB]">
              <option>All Roles</option>
              <option>School Admins</option>
              <option>Teachers</option>
              <option>Students</option>
              <option>Parents</option>
              <option>Accountants</option>
            </select>
            <button className="h-9 px-4 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Users className="h-12 w-12 text-[#C8CDD5] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#1A1F36]">User Directory Integration</h3>
            <p className="text-sm text-[#8A94A6] max-w-sm mx-auto mt-2">
              The global user directory is currently syncing with tenant databases. 
              Data will be populated shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
