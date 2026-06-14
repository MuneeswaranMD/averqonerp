import { GraduationCap, Users, CreditCard, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Building2, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Schools', value: '42', change: '+3 this month', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'up' },
    { label: 'Total Students', value: '18,450', change: '+450 this month', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50', trend: 'up' },
    { label: 'Platform Revenue', value: '$124,500', change: '+12% from last month', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'up' },
    { label: 'Active Subscriptions', value: '38', change: '-2 this month', icon: CreditCard, color: 'text-red-600', bg: 'bg-red-50', trend: 'down' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#1A6FDB]" />
            Platform Overview
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Monitor all tenant schools and system-wide performance</div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/admin/schools/add"
            className="h-9 px-4 rounded-md bg-[#1A1F36] hover:bg-[#2D3748] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Building2 className="h-3.5 w-3.5" /> Onboard New School
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-[#E3E5E8] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {stat.trend === 'up' ? (
                <div className="flex items-center text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> {stat.change.split(' ')[0]}
                </div>
              ) : (
                <div className="flex items-center text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  <ArrowDownRight className="h-3 w-3 mr-0.5" /> {stat.change.split(' ')[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1A1F36] tracking-tight">{stat.value}</h3>
              <p className="text-[11px] font-semibold text-[#8A94A6] uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#E3E5E8] shadow-sm">
          <div className="p-4 border-b border-[#E3E5E8] flex justify-between items-center bg-[#F7F8FA] rounded-t-lg">
            <h2 className="text-sm font-semibold text-[#1A1F36]">Recently Onboarded Schools</h2>
            <Link href="/dashboard/admin/schools" className="text-xs font-semibold text-[#1A6FDB] hover:underline">View All</Link>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3E5E8] bg-white text-[#8A94A6] uppercase tracking-wider font-semibold">
                  <th className="p-4">School Name</th>
                  <th className="p-4">Domain</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E8]">
                {[
                  { name: 'Green Valley International', domain: 'greenvalley.averqonerp.com', status: 'Active', plan: 'Enterprise' },
                  { name: 'Sunrise Public School', domain: 'sunrise.averqonerp.com', status: 'Active', plan: 'Pro' },
                  { name: 'Apex Academy', domain: 'apex.averqonerp.com', status: 'Trial', plan: 'Trial' },
                  { name: 'Oakwood High', domain: 'oakwood.averqonerp.com', status: 'Active', plan: 'Basic' },
                ].map((school, i) => (
                  <tr key={i} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-4 font-semibold text-[#1A1F36]">{school.name}</td>
                    <td className="p-4 text-[#8A94A6]">{school.domain}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        school.status === 'Active' ? 'bg-[#EDF7ED] text-[#2E7D32]' : 'bg-[#FFF4E5] text-[#ED6C02]'
                      }`}>
                        {school.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-[#4A5568]">{school.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg border border-[#E3E5E8] shadow-sm flex flex-col">
          <div className="p-4 border-b border-[#E3E5E8] bg-[#F7F8FA] rounded-t-lg">
            <h2 className="text-sm font-semibold text-[#1A1F36]">System Health & Usage</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#4A5568]">Server CPU Usage</span>
                <span className="text-[#8A94A6]">42%</span>
              </div>
              <div className="h-2 w-full bg-[#E3E5E8] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#4A5568]">Memory (RAM)</span>
                <span className="text-[#8A94A6]">68%</span>
              </div>
              <div className="h-2 w-full bg-[#E3E5E8] rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#4A5568]">Database Storage</span>
                <span className="text-[#8A94A6]">24%</span>
              </div>
              <div className="h-2 w-full bg-[#E3E5E8] rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-[#E3E5E8]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#EDF7ED] flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5 text-[#2E7D32]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1F36]">All Systems Operational</div>
                  <div className="text-[11px] text-[#8A94A6]">Last checked 2 mins ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
