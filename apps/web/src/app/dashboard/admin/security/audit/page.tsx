import { 
  Building2, Info, CreditCard, BarChart2, Shield, BookOpen, Briefcase, 
  Users, GraduationCap, Bus, Package, CheckCircle, AlertTriangle, 
  TrendingUp, Activity, FileText, PieChart, HelpCircle, CheckSquare, 
  MessageSquare, Book, Palette, Mail, MessageCircle, Phone, HardDrive, 
  Lock, List, LogIn, Terminal, ShieldAlert, Search, Filter, Download, 
  Plus, Edit2, Trash2, Save 
} from 'lucide-react';


export default function GlobalAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <List className="h-5 w-5 text-[#1A6FDB]" />
            Global Audit Logs
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">System-wide activity tracker.</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Plus className="h-3.5 w-3.5" /> Create New
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm">
        <div className="p-4 border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA] rounded-t-lg">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
            <input 
              type="text"
              placeholder="Search records..."
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
              <tr className="border-b border-[#E3E5E8] bg-white text-[#8A94A6] uppercase tracking-wider font-semibold">
                <th className="p-4">ID Reference</th>
                <th className="p-4">Primary Data</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8]">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-[#F7F8FA] transition-colors group">
                  <td className="p-4 text-[#8A94A6] font-mono">#REF-00{item}</td>
                  <td className="p-4 font-semibold text-[#1A1F36]">Sample Record {item}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EDF7ED] text-[#2E7D32]">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-[#4A5568]">Oct 12, 2026</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-[#8A94A6] hover:text-[#1A6FDB]"><Edit2 className="h-4 w-4" /></button>
                      <button className="p-1 text-[#8A94A6] hover:text-[#C62828]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}