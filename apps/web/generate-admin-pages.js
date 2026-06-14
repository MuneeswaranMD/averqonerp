const fs = require('fs');
const path = require('path');

const pageConfigs = [
  // SCHOOLS
  { path: 'schools/add', title: 'Onboard New School', type: 'form', icon: 'Building2', desc: 'Create a new tenant workspace and initialize their database.' },
  { path: 'schools/details', title: 'School Details', type: 'details', icon: 'Info', desc: 'View complete profile and metrics for a specific school.' },
  { path: 'schools/subscription', title: 'Subscription Status', type: 'details', icon: 'CreditCard', desc: 'Manage current billing cycle and plan features.' },
  { path: 'schools/analytics', title: 'School Analytics', type: 'dashboard', icon: 'BarChart2', desc: 'Deep dive into tenant usage, active sessions, and growth.' },
  
  // USERS
  { path: 'users/admins', title: 'School Admins', type: 'table', icon: 'Shield', desc: 'Manage all tenant administrators.' },
  { path: 'users/teachers', title: 'Teachers', type: 'table', icon: 'BookOpen', desc: 'Global directory of educators.' },
  { path: 'users/accountants', title: 'Accountants', type: 'table', icon: 'Briefcase', desc: 'Global directory of financial staff.' },
  { path: 'users/parents', title: 'Parents', type: 'table', icon: 'Users', desc: 'Global directory of guardians.' },
  { path: 'users/students', title: 'Students', type: 'table', icon: 'GraduationCap', desc: 'Global student directory.' },
  { path: 'users/transport', title: 'Transport Staff', type: 'table', icon: 'Bus', desc: 'Global directory of drivers and managers.' },

  // SUBSCRIPTIONS
  { path: 'subscriptions/plans', title: 'Subscription Plans', type: 'table', icon: 'Package', desc: 'Manage pricing tiers and feature flags.' },
  { path: 'subscriptions/active', title: 'Active Subscriptions', type: 'table', icon: 'CheckCircle', desc: 'Monitor currently active paying schools.' },
  { path: 'subscriptions/expiring', title: 'Expiring Plans', type: 'table', icon: 'AlertTriangle', desc: 'Schools with plans expiring in the next 30 days.' },
  { path: 'subscriptions/payments', title: 'Subscription Payments', type: 'table', icon: 'CreditCard', desc: 'Recent subscription renewals and payments.' },

  // REVENUE
  { path: 'revenue/monthly', title: 'Monthly Revenue', type: 'dashboard', icon: 'TrendingUp', desc: 'Monthly Recurring Revenue (MRR) and growth metrics.' },
  { path: 'revenue/payments', title: 'Payment Gateway Logs', type: 'table', icon: 'Activity', desc: 'Raw transaction logs from Stripe/Razorpay.' },
  { path: 'revenue/invoices', title: 'Platform Invoices', type: 'table', icon: 'FileText', desc: 'Invoices sent to tenant schools.' },
  { path: 'revenue/reports', title: 'Financial Reports', type: 'form', icon: 'PieChart', desc: 'Generate and export custom revenue reports.' },

  // SUPPORT
  { path: 'support/open', title: 'Open Tickets', type: 'table', icon: 'HelpCircle', desc: 'Unresolved support requests from tenant admins.' },
  { path: 'support/resolved', title: 'Resolved Tickets', type: 'table', icon: 'CheckSquare', desc: 'Archive of closed support issues.' },
  { path: 'support/chat', title: 'Live Chat', type: 'details', icon: 'MessageSquare', desc: 'Real-time support channel.' },
  { path: 'support/docs', title: 'Documentation Hub', type: 'details', icon: 'Book', desc: 'Manage help articles and guides.' },

  // SETTINGS
  { path: 'settings/branding', title: 'Platform Branding', type: 'form', icon: 'Palette', desc: 'White-labeling and visual identity.' },
  { path: 'settings/email', title: 'Email Configuration', type: 'form', icon: 'Mail', desc: 'SMTP and SendGrid API settings.' },
  { path: 'settings/sms', title: 'SMS Gateway', type: 'form', icon: 'MessageCircle', desc: 'Twilio and MSG91 API configuration.' },
  { path: 'settings/whatsapp', title: 'WhatsApp Business API', type: 'form', icon: 'Phone', desc: 'WhatsApp Cloud API integration.' },
  { path: 'settings/storage', title: 'Storage & CDN', type: 'form', icon: 'HardDrive', desc: 'AWS S3 and Cloudflare configuration.' },
  { path: 'settings/security', title: 'Global Security', type: 'form', icon: 'Lock', desc: 'MFA enforcement and IP whitelisting.' },

  // SECURITY
  { path: 'security/audit', title: 'Global Audit Logs', type: 'table', icon: 'List', desc: 'System-wide activity tracker.' },
  { path: 'security/login', title: 'Login History', type: 'table', icon: 'LogIn', desc: 'Track successful and failed authentications.' },
  { path: 'security/api', title: 'API Traffic Logs', type: 'table', icon: 'Terminal', desc: 'Monitor REST API requests and rate limits.' },
  { path: 'security/access-control', title: 'Platform Roles', type: 'form', icon: 'ShieldAlert', desc: 'Manage Super Admin permissions.' },
];

const getImports = () => `import { 
  Building2, Info, CreditCard, BarChart2, Shield, BookOpen, Briefcase, 
  Users, GraduationCap, Bus, Package, CheckCircle, AlertTriangle, 
  TrendingUp, Activity, FileText, PieChart, HelpCircle, CheckSquare, 
  MessageSquare, Book, Palette, Mail, MessageCircle, Phone, HardDrive, 
  Lock, List, LogIn, Terminal, ShieldAlert, Search, Filter, Download, 
  Plus, Edit2, Trash2, Save 
} from 'lucide-react';\n\n`;

const generateTableTemplate = (config) => `
export default function ${config.title.replace(/\s+/g, '')}Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <${config.icon} className="h-5 w-5 text-[#1A6FDB]" />
            ${config.title}
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">${config.desc}</div>
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
}`;

const generateFormTemplate = (config) => `
export default function ${config.title.replace(/\s+/g, '')}Page() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <${config.icon} className="h-5 w-5 text-[#1A6FDB]" />
            ${config.title}
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">${config.desc}</div>
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
}`;

const generateDashboardTemplate = (config) => `
export default function ${config.title.replace(/\s+/g, '')}Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <${config.icon} className="h-5 w-5 text-[#1A6FDB]" />
            ${config.title}
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">${config.desc}</div>
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
              <span className={\`text-xs font-bold \${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mb-1\`}>{stat.change}</span>
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
}`;

const generateDetailsTemplate = (config) => `
export default function ${config.title.replace(/\s+/g, '')}Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <${config.icon} className="h-5 w-5 text-[#1A6FDB]" />
            ${config.title}
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">${config.desc}</div>
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
}`;

pageConfigs.forEach(config => {
  const filePath = path.join(__dirname, 'src', 'app', 'dashboard', 'admin', config.path, 'page.tsx');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  let content = getImports();
  if (config.type === 'table') content += generateTableTemplate(config);
  else if (config.type === 'form') content += generateFormTemplate(config);
  else if (config.type === 'dashboard') content += generateDashboardTemplate(config);
  else if (config.type === 'details') content += generateDetailsTemplate(config);

  fs.writeFileSync(filePath, content);
  console.log('Generated:', config.path);
});

console.log('All Super Admin pages successfully generated!');
