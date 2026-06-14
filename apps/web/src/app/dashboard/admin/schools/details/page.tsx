import { 
  Building2, Info, CreditCard, BarChart2, Shield, BookOpen, Briefcase, 
  Users, GraduationCap, Bus, Package, CheckCircle, AlertTriangle, 
  TrendingUp, Activity, FileText, PieChart, HelpCircle, CheckSquare, 
  MessageSquare, Book, Palette, Mail, MessageCircle, Phone, HardDrive, 
  Lock, List, LogIn, Terminal, ShieldAlert, Search, Filter, Download, 
  Plus, Edit2, Trash2, Save 
} from 'lucide-react';


export default function SchoolDetailsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Info className="h-5 w-5 text-[#1A6FDB]" />
            School Details
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">View complete profile and metrics for a specific school.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-semibold text-[#1A1F36] mb-4">Detailed Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 border-b border-[#E3E5E8] pb-4">
                <div className="text-xs text-[#8A94A6]">Reference ID</div>
                <div className="col-span-2 text-sm font-medium text-[#1A1F36] font-mono">SYS-9982-110A</div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-[#E3E5E8] pb-4">
                <div className="text-xs text-[#8A94A6]">Status</div>
                <div className="col-span-2">
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EDF7ED] text-[#2E7D32]">Active</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pb-2">
                <div className="text-xs text-[#8A94A6]">Last Updated</div>
                <div className="col-span-2 text-sm text-[#1A1F36]">Just now by System Administrator</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#F7F8FA] border border-[#E3E5E8] rounded-lg p-5">
            <h3 className="text-sm font-semibold text-[#1A1F36] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-[#1A6FDB] hover:bg-white rounded border border-transparent hover:border-[#E3E5E8] transition-all">Edit Details</button>
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-[#4A5568] hover:bg-white rounded border border-transparent hover:border-[#E3E5E8] transition-all">View History</button>
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-white rounded border border-transparent hover:border-red-100 transition-all">Suspend Item</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}