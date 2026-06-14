import { 
  Building2, Info, CreditCard, BarChart2, Shield, BookOpen, Briefcase, 
  Users, GraduationCap, Bus, Package, CheckCircle, AlertTriangle, 
  TrendingUp, Activity, FileText, PieChart, HelpCircle, CheckSquare, 
  MessageSquare, Book, Palette, Mail, MessageCircle, Phone, HardDrive, 
  Lock, List, LogIn, Terminal, ShieldAlert, Search, Filter, Download, 
  Plus, Edit2, Trash2, Save 
} from 'lucide-react';


export default function StorageCDNPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-[#1A6FDB]" />
            Storage & CDN
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">AWS S3 and Cloudflare configuration.</div>
        </div>
        <button className="h-9 px-4 rounded-md bg-[#1A1F36] hover:bg-[#2D3748] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
          <Save className="h-3.5 w-3.5" /> Save Changes
        </button>
      </div>

      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A5568]">Configuration Name</label>
            <input type="text" defaultValue="Standard Setup" className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A5568]">API Key / Token</label>
            <input type="password" defaultValue="********" className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12" />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#4A5568]">Description / Notes</label>
          <textarea rows={4} className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12" defaultValue="Initial configuration parameters."></textarea>
        </div>

        <div className="pt-4 border-t border-[#E3E5E8] flex items-center gap-3">
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-9 h-5 bg-[#C8CDD5] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1A6FDB]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#C8CDD5] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2E7D32]"></div>
          </div>
          <span className="text-sm font-medium text-[#1A1F36]">Enable this feature platform-wide</span>
        </div>
      </div>
    </div>
  );
}