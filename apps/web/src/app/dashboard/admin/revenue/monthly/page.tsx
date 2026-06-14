import { 
  Building2, Info, CreditCard, BarChart2, Shield, BookOpen, Briefcase, 
  Users, GraduationCap, Bus, Package, CheckCircle, AlertTriangle, 
  TrendingUp, Activity, FileText, PieChart, HelpCircle, CheckSquare, 
  MessageSquare, Book, Palette, Mail, MessageCircle, Phone, HardDrive, 
  Lock, List, LogIn, Terminal, ShieldAlert, Search, Filter, Download, 
  Plus, Edit2, Trash2, Save 
} from 'lucide-react';


export default function MonthlyRevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#1A6FDB]" />
            Monthly Revenue
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Monthly Recurring Revenue (MRR) and growth metrics.</div>
        </div>
        <div className="flex gap-2">
          <select className="h-9 px-3 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] text-xs font-medium focus:outline-none">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="h-9 px-4 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Primary Metric', value: '14,200', change: '+12%' },
          { label: 'Secondary Metric', value: '8,450', change: '+5%' },
          { label: 'Tertiary Metric', value: '2.4%', change: '-1.2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-[#E3E5E8] shadow-sm">
            <p className="text-[11px] font-semibold text-[#8A94A6] uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-2xl font-bold text-[#1A1F36]">{stat.value}</h3>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mb-1`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm h-80 flex items-center justify-center">
        <div className="text-center text-[#8A94A6]">
          <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Interactive Chart Visualization</p>
          <p className="text-xs mt-1">Rendering analytics data...</p>
        </div>
      </div>
    </div>
  );
}