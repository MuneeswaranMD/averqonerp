'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Shield, School, Calendar, FileText, HelpCircle,
  Users, Building2, Layers, BookOpen, Bell, Mail,
  Link2, Palette, HardDrive, Settings,
  CheckCircle, Clock, Globe,
  Plus, Edit, Trash2, Copy, Key, Lock,
  Download, Upload, RefreshCw, Save,
  Phone, MapPin, Camera, Hash,
  GraduationCap, ArrowRight,
  CheckCheck, Smartphone, MessageSquare, Zap, Star,
  Activity, BarChart3, SlidersHorizontal
} from 'lucide-react';

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ label, variant = 'default' }: { label: string; variant?: 'default'|'success'|'warning'|'error'|'info' }) => {
  const styles = {
    default: 'bg-[#F4F6F9] text-[#4A5568]',
    success: 'bg-[#EDF7ED] text-[#2E7D32]',
    warning: 'bg-[#FFF8E6] text-[#B45309]',
    error:   'bg-[#FEF0F0] text-[#C62828]',
    info:    'bg-[#EDF3FF] text-[#1A6FDB]',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${styles[variant]}`}>{label}</span>;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const defaultRoles = [
  { name: 'School Admin',      users: 1,   perms: 48, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
  { name: 'Principal',         users: 1,   perms: 36, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
  { name: 'Teacher',           users: 12,  perms: 24, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
  { name: 'Accountant',        users: 2,   perms: 18, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
  { name: 'Transport Manager', users: 1,   perms: 12, color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]' },
  { name: 'Driver',            users: 4,   perms: 6,  color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]' },
  { name: 'Librarian',         users: 1,   perms: 10, color: 'text-[#4A5568]', bg: 'bg-[#F4F6F9]' },
  { name: 'Parent',            users: 160, perms: 4,  color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
  { name: 'Student',           users: 210, perms: 4,  color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
];

const modules = ['Admissions','Students','Staff','Attendance','Fees','Accounting','Exams','LMS','Transport','Reports','Communication','Settings'];
const permActions = ['View','Create','Edit','Delete','Approve','Export','Print'];

const auditLogs = [
  { user: 'admin@greenvalley.edu', action: 'Login',             module: 'Auth',            date: '2026-06-15 01:02', ip: '192.168.1.10', type: 'info'    },
  { user: 'admin@greenvalley.edu', action: 'Update',            module: 'School Settings', date: '2026-06-14 23:45', ip: '192.168.1.10', type: 'update'  },
  { user: 'admin@greenvalley.edu', action: 'Create',            module: 'Users',           date: '2026-06-14 22:30', ip: '192.168.1.10', type: 'create'  },
  { user: 'superadmin@averqonerp.com', action: 'Permission Change', module: 'Roles',       date: '2026-06-14 19:17', ip: '10.0.0.1',    type: 'warning' },
  { user: 'admin@greenvalley.edu', action: 'Fee Collection',    module: 'Fees',            date: '2026-06-14 15:30', ip: '192.168.1.10', type: 'create'  },
  { user: 'admin@greenvalley.edu', action: 'Result Publishing', module: 'Exams',           date: '2026-06-14 14:00', ip: '192.168.1.10', type: 'update'  },
  { user: 'accounts@greenvalley.edu', action: 'Export',         module: 'Reports',         date: '2026-06-14 11:20', ip: '192.168.1.12', type: 'info'    },
];

const supportTickets = [
  { id: 'TKT-001', title: 'Fee report export not working',    priority: 'High',   status: 'Open',        date: '2026-06-14' },
  { id: 'TKT-002', title: 'SMS notifications not delivered',  priority: 'Medium', status: 'In Progress', date: '2026-06-13' },
  { id: 'TKT-003', title: 'Class timetable export',          priority: 'Low',    status: 'Resolved',    date: '2026-06-12' },
];

const classesData = [
  { grade: 'Grade 1', sections: ['A','B','C'], teacher: 'Mrs. Priya Sharma',  capacity: 35 },
  { grade: 'Grade 2', sections: ['A','B'],     teacher: 'Mr. Rajan Kumar',    capacity: 35 },
  { grade: 'Grade 3', sections: ['A','B','C'], teacher: 'Mrs. Anita Roy',     capacity: 35 },
  { grade: 'Grade 4', sections: ['A','B'],     teacher: 'Mr. Suresh Patel',   capacity: 30 },
  { grade: 'Grade 5', sections: ['A','B','C'], teacher: 'Mrs. Kavitha Nair',  capacity: 30 },
];

const subjectsList = [
  { name: 'Mathematics',     code: 'MAT', teacher: 'Mr. Rajan Kumar',    classes: 5, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
  { name: 'Science',         code: 'SCI', teacher: 'Mrs. Priya Sharma',  classes: 5, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
  { name: 'English',         code: 'ENG', teacher: 'Mrs. Anita Roy',     classes: 5, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
  { name: 'Social Science',  code: 'SST', teacher: 'Mr. Suresh Patel',   classes: 4, color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]' },
  { name: 'Computer Science',code: 'CS',  teacher: 'Mrs. Kavitha Nair',  classes: 3, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
  { name: 'Hindi',           code: 'HIN', teacher: 'Mr. Amit Verma',     classes: 5, color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]' },
];

const departmentsList = [
  { name: 'Mathematics',  head: 'Mr. Rajan Kumar',    staff: 4, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]' },
  { name: 'Science',      head: 'Mrs. Priya Sharma',  staff: 5, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]' },
  { name: 'English',      head: 'Mrs. Anita Roy',     staff: 3, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]' },
  { name: 'Administration',head: 'Mrs. Meghana Rao',  staff: 6, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]' },
  { name: 'Transport',    head: 'Mr. Vivek Joshi',    staff: 5, color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]' },
  { name: 'Accounts',     head: 'Accounts ERP',       staff: 2, color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]' },
];

// ─── Section titles map ────────────────────────────────────────────────────────
const sectionTitles: Record<string, string> = {
  roles:         'Roles & Permissions',
  school:        'School Settings',
  academic:      'Academic Year',
  audit:         'Audit Logs',
  support:       'Support Center',
  users:         'User Management',
  departments:   'Departments',
  classes:       'Classes & Sections',
  subjects:      'Subjects',
  notifications: 'Notification Settings',
  email:         'Email & SMS Settings',
  integrations:  'Integrations',
  branding:      'Branding',
  backup:        'Backup & Restore',
  system:        'System Preferences',
};

// ─── Inner content ────────────────────────────────────────────────────────────
function SettingsContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get('s') || 'roles';
  const title = sectionTitles[section] || 'Settings';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="border-b border-[#E3E5E8] pb-3">
        <h1 className="text-xl font-semibold text-[#1A1F36]">{title}</h1>
        <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › Settings › {title}</div>
      </div>

      {/* ── ROLES ──────────────────────────────────────────────────────────── */}
      {section === 'roles' && <RolesSection />}

      {/* ── SCHOOL ──────────────────────────────────────────────────────────── */}
      {section === 'school' && <SchoolSection />}

      {/* ── ACADEMIC ──────────────────────────────────────────────────────── */}
      {section === 'academic' && <AcademicSection />}

      {/* ── AUDIT ───────────────────────────────────────────────────────────── */}
      {section === 'audit' && <AuditSection />}

      {/* ── SUPPORT ─────────────────────────────────────────────────────────── */}
      {section === 'support' && <SupportSection />}

      {/* ── USERS ───────────────────────────────────────────────────────────── */}
      {section === 'users' && <UsersSection />}

      {/* ── DEPARTMENTS ──────────────────────────────────────────────────────── */}
      {section === 'departments' && <DepartmentsSection />}

      {/* ── CLASSES ──────────────────────────────────────────────────────────── */}
      {section === 'classes' && <ClassesSection />}

      {/* ── SUBJECTS ─────────────────────────────────────────────────────────── */}
      {section === 'subjects' && <SubjectsSection />}

      {/* ── NOTIFICATIONS ────────────────────────────────────────────────────── */}
      {section === 'notifications' && <NotificationsSection />}

      {/* ── EMAIL ────────────────────────────────────────────────────────────── */}
      {section === 'email' && <EmailSection />}

      {/* ── INTEGRATIONS ─────────────────────────────────────────────────────── */}
      {section === 'integrations' && <IntegrationsSection />}

      {/* ── BRANDING ─────────────────────────────────────────────────────────── */}
      {section === 'branding' && <BrandingSection />}

      {/* ── BACKUP ───────────────────────────────────────────────────────────── */}
      {section === 'backup' && <BackupSection />}

      {/* ── SYSTEM ───────────────────────────────────────────────────────────── */}
      {section === 'system' && <SystemSection />}
    </div>
  );
}

// ═══════════════════ SECTION COMPONENTS ═══════════════════════════════════════

function RolesSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8A94A6]">Create, clone, and configure role-based access for every user type.</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold hover:bg-[#1558B0] transition-colors">
          <Plus className="h-3.5 w-3.5" /> Create Role
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Role list */}
        <div className="space-y-2">
          {defaultRoles.map(role => (
            <div key={role.name} className="flex items-center justify-between p-3 rounded-xl border border-[#E3E5E8] bg-white hover:border-[#1A6FDB]/40 transition-all">
              <div className="flex items-center gap-2.5">
                <div className={`h-7 w-7 rounded-lg ${role.bg} flex items-center justify-center`}>
                  <Shield className={`h-3.5 w-3.5 ${role.color}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1F36]">{role.name}</div>
                  <div className="text-[10px] text-[#8A94A6]">{role.users} users · {role.perms} perms</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors" title="Clone">
                  <Copy className="h-3 w-3 text-[#8A94A6]" />
                </button>
                <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors" title="Edit">
                  <Edit className="h-3 w-3 text-[#8A94A6]" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Permission Matrix */}
        <div className="lg:col-span-2 border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
          <div className="p-3 border-b border-[#E3E5E8] bg-[#F7F9FD] flex items-center justify-between">
            <span className="text-xs font-bold text-[#1A1F36]">Permission Matrix — School Admin</span>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold">
              <Save className="h-3 w-3" /> Save
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
                  <th className="text-left px-3 py-2 font-bold text-[#8A94A6] text-[10px] uppercase tracking-wider w-28">Module</th>
                  {permActions.map(a => <th key={a} className="px-2 py-2 font-bold text-[#8A94A6] text-[10px] uppercase tracking-wider">{a}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F6F9]">
                {modules.map((mod, mi) => (
                  <tr key={mod} className="hover:bg-[#F7F9FD] transition-colors">
                    <td className="px-3 py-2 font-semibold text-[11px] text-[#1A1F36]">{mod}</td>
                    {permActions.map((act, ai) => (
                      <td key={act} className="px-2 py-2 text-center">
                        <div className={`h-4 w-4 rounded border-2 mx-auto flex items-center justify-center ${
                          (mi < 8 && ai < 4) ? 'bg-[#1A6FDB] border-[#1A6FDB]' : 'bg-white border-[#C8CDD5] hover:border-[#1A6FDB]'
                        } cursor-pointer transition-all`}>
                          {(mi < 8 && ai < 4) && <CheckCheck className="h-2.5 w-2.5 text-white" />}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
          <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">School Information</div>
          {[
            { label: 'School Name', value: 'Green Valley International School', icon: School },
            { label: 'School Code', value: 'GVIS-2026', icon: Hash },
            { label: 'Address', value: '42, MG Road, Bengaluru', icon: MapPin },
            { label: 'City', value: 'Bengaluru', icon: MapPin },
            { label: 'State', value: 'Karnataka', icon: MapPin },
            { label: 'PIN Code', value: '560001', icon: Hash },
          ].map(f => { const Icon = f.icon; return (
            <div key={f.label} className="space-y-1">
              <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider flex items-center gap-1"><Icon className="h-3 w-3" /> {f.label}</label>
              <input type="text" defaultValue={f.value} className="block w-full h-8 px-3 border border-[#C8CDD5] bg-[#F7F8FA] rounded-lg text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:bg-white transition-all" />
            </div>
          ); })}
        </div>
        <div className="space-y-5">
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
            <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Contact Information</div>
            {[
              { label: 'Phone', value: '+91 80 1234 5678', icon: Phone },
              { label: 'Email', value: 'info@greenvalley.edu', icon: Mail },
              { label: 'Website', value: 'www.greenvalley.edu', icon: Globe },
            ].map(f => { const Icon = f.icon; return (
              <div key={f.label} className="space-y-1">
                <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider flex items-center gap-1"><Icon className="h-3 w-3" /> {f.label}</label>
                <input type="text" defaultValue={f.value} className="block w-full h-8 px-3 border border-[#C8CDD5] bg-[#F7F8FA] rounded-lg text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:bg-white transition-all" />
              </div>
            ); })}
          </div>
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-3">
            <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Documents</div>
            {['School Logo','School Banner','School Seal'].map(doc => (
              <div key={doc} className="flex items-center justify-between p-3 border border-[#E3E5E8] rounded-lg">
                <div className="flex items-center gap-2"><Camera className="h-4 w-4 text-[#8A94A6]" /><span className="text-xs font-medium text-[#4A5568]">{doc}</span></div>
                <button className="flex items-center gap-1 text-[11px] text-[#1A6FDB] font-semibold hover:underline"><Upload className="h-3 w-3" /> Upload</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors">
        <Save className="h-3.5 w-3.5" /> Update School Profile
      </button>
    </div>
  );
}

function AcademicSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Create Academic Year</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { year: '2025–2026', status: 'Active',    terms: ['Term 1 (Apr–Jun)', 'Term 2 (Jul–Sep)', 'Half Yearly (Oct)', 'Final Exam (Mar)'] },
          { year: '2026–2027', status: 'Upcoming',  terms: ['Term 1', 'Term 2', 'Half Yearly', 'Final Exam'] },
          { year: '2027–2028', status: 'Draft',     terms: ['Term 1', 'Term 2', 'Half Yearly', 'Final Exam'] },
        ].map(ay => (
          <div key={ay.year} className={`p-5 border rounded-xl bg-white space-y-4 ${ay.status === 'Active' ? 'border-[#1A6FDB] shadow-md shadow-[#1A6FDB]/10' : 'border-[#E3E5E8]'}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-[#1A1F36]">{ay.year}</div>
              <Badge label={ay.status} variant={ay.status === 'Active' ? 'success' : ay.status === 'Upcoming' ? 'info' : 'default'} />
            </div>
            <div className="space-y-2">
              {ay.terms.map(t => (
                <div key={t} className="flex items-center gap-2 text-xs text-[#4A5568] p-2 bg-[#F7F8FA] rounded-lg"><Calendar className="h-3.5 w-3.5 text-[#8A94A6]" />{t}</div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-[#E3E5E8]">
              {ay.status !== 'Active' && <button className="flex-1 text-[11px] font-semibold py-1.5 border border-[#1A6FDB] text-[#1A6FDB] rounded-lg hover:bg-[#EDF3FF] transition-colors">Activate</button>}
              <button className="flex-1 text-[11px] font-semibold py-1.5 border border-[#E3E5E8] text-[#4A5568] rounded-lg hover:bg-[#F4F6F9] transition-colors">Archive</button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-3">
        <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Student Promotion</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Promote Students', icon: ArrowRight, desc: 'Move students to next grade' },
            { label: 'Move Sections', icon: Layers, desc: 'Reassign class sections' },
            { label: 'Archive Graduated', icon: GraduationCap, desc: 'Archive Grade 12 students' },
          ].map(a => { const Icon = a.icon; return (
            <button key={a.label} className="flex items-center gap-3 p-3 border border-[#E3E5E8] rounded-xl hover:border-[#1A6FDB]/40 hover:bg-[#F7F9FD] transition-all text-left group">
              <div className="h-8 w-8 rounded-lg bg-[#EDF3FF] flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-[#1A6FDB]" /></div>
              <div><div className="text-xs font-bold text-[#1A1F36] group-hover:text-[#1A6FDB]">{a.label}</div><div className="text-[10px] text-[#8A94A6]">{a.desc}</div></div>
            </button>
          ); })}
        </div>
      </div>
    </div>
  );
}

function AuditSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8A94A6]">Track every user action, login, and permission change in real time.</p>
        <div className="flex gap-2">
          {['PDF','Excel','CSV'].map(f => (
            <button key={f} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 border border-[#E3E5E8] rounded-lg text-[#4A5568] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors">
              <Download className="h-3 w-3" /> {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Search by user or module..." className="flex-1 h-8 px-3 border border-[#C8CDD5] bg-white rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] transition-all" />
        <select className="h-8 px-3 border border-[#C8CDD5] bg-white rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] transition-all">
          <option>All Actions</option><option>Login</option><option>Create</option><option>Update</option><option>Delete</option>
        </select>
      </div>
      <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
              {['User','Action','Module','Date','IP'].map(h => <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F9]">
            {auditLogs.map((log, i) => (
              <tr key={i} className="hover:bg-[#F7F9FD] transition-colors">
                <td className="px-4 py-2.5 font-medium text-[#1A1F36]">{log.user}</td>
                <td className="px-4 py-2.5"><Badge label={log.action} variant={log.type === 'warning' ? 'warning' : log.type === 'create' ? 'success' : log.type === 'update' ? 'info' : 'default'} /></td>
                <td className="px-4 py-2.5 text-[#4A5568]">{log.module}</td>
                <td className="px-4 py-2.5 text-[#8A94A6] font-mono">{log.date}</td>
                <td className="px-4 py-2.5 text-[#8A94A6] font-mono">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupportSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Create Ticket</button>
      </div>
      <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
        <div className="p-3 border-b border-[#E3E5E8] bg-[#F4F6F9] text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">My Tickets</div>
        <div className="divide-y divide-[#F4F6F9]">
          {supportTickets.map(t => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F9FD] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#8A94A6]">{t.id}</span>
                <div><div className="text-xs font-semibold text-[#1A1F36]">{t.title}</div><div className="text-[10px] text-[#8A94A6]">{t.date}</div></div>
              </div>
              <div className="flex gap-2">
                <Badge label={t.priority} variant={t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : 'default'} />
                <Badge label={t.status} variant={t.status === 'Resolved' ? 'success' : t.status === 'In Progress' ? 'info' : 'warning'} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'FAQ', icon: HelpCircle },
          { label: 'Documentation', icon: FileText },
          { label: 'Video Tutorials', icon: Star },
          { label: 'Release Notes', icon: Zap },
        ].map(r => { const Icon = r.icon; return (
          <button key={r.label} className="flex items-center gap-3 p-4 border border-[#E3E5E8] bg-white rounded-xl hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all text-left group">
            <div className="h-8 w-8 rounded-lg bg-[#EDF3FF] flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-[#1A6FDB]" /></div>
            <span className="text-xs font-bold text-[#1A1F36] group-hover:text-[#1A6FDB] transition-colors">{r.label}</span>
          </button>
        ); })}
      </div>
    </div>
  );
}

function UsersSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Create User</button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { type: 'School Admin', count: 1,   color: 'text-[#1A6FDB]' },
          { type: 'Teacher',      count: 12,  color: 'text-[#2E7D32]' },
          { type: 'Accountant',   count: 2,   color: 'text-[#B45309]' },
          { type: 'Parent',       count: 160, color: 'text-[#7C3AED]' },
          { type: 'Student',      count: 210, color: 'text-[#0891B2]' },
          { type: 'Driver',       count: 4,   color: 'text-[#C62828]' },
        ].map(u => (
          <div key={u.type} className="p-4 border border-[#E3E5E8] bg-white rounded-xl text-center hover:border-[#1A6FDB]/40 transition-all">
            <div className="text-2xl font-bold text-[#1A1F36]">{u.count}</div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${u.color}`}>{u.type}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Search users..." className="flex-1 h-8 px-3 border border-[#C8CDD5] bg-white rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] transition-all" />
        <select className="h-8 px-3 border border-[#C8CDD5] bg-white rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] transition-all">
          <option>All Roles</option><option>School Admin</option><option>Teacher</option><option>Student</option>
        </select>
      </div>
      <div className="border border-[#E3E5E8] bg-white rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F4F6F9] border-b border-[#E3E5E8]">
              {['Name','Email','Role','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F9]">
            {[
              { name: 'Meghana Rao', email: 'admin@greenvalley.edu', role: 'School Admin', status: 'Active' },
              { name: 'Accounts ERP', email: 'accounts@greenvalley.edu', role: 'Accountant', status: 'Active' },
            ].map(u => (
              <tr key={u.email} className="hover:bg-[#F7F9FD] transition-colors">
                <td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-[#EDF3FF] flex items-center justify-center text-[10px] font-bold text-[#1A6FDB]">{u.name[0]}</div><span className="font-medium text-[#1A1F36]">{u.name}</span></div></td>
                <td className="px-4 py-2.5 text-[#4A5568]">{u.email}</td>
                <td className="px-4 py-2.5"><Badge label={u.role} variant="info" /></td>
                <td className="px-4 py-2.5"><Badge label={u.status} variant="success" /></td>
                <td className="px-4 py-2.5"><div className="flex gap-1">
                  <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors"><Edit className="h-3 w-3 text-[#1A6FDB]" /></button>
                  <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors"><Key className="h-3 w-3 text-[#8A94A6]" /></button>
                  <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#FEF0F0] transition-colors"><Lock className="h-3 w-3 text-[#C62828]" /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DepartmentsSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Add Department</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentsList.map(d => (
          <div key={d.name} className="p-4 border border-[#E3E5E8] bg-white rounded-xl flex items-center justify-between hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${d.bg} flex items-center justify-center`}><Building2 className={`h-5 w-5 ${d.color}`} /></div>
              <div>
                <div className="text-sm font-bold text-[#1A1F36]">{d.name}</div>
                <div className="text-[10px] text-[#8A94A6]">Head: {d.head}</div>
                <div className="text-[10px] text-[#8A94A6]">{d.staff} staff members</div>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#E8F0FD] transition-colors"><Edit className="h-3.5 w-3.5 text-[#1A6FDB]" /></button>
              <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#FEF0F0] transition-colors"><Trash2 className="h-3.5 w-3.5 text-[#C62828]" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassesSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E3E5E8] bg-white text-[#4A5568] rounded-lg text-xs font-semibold hover:bg-[#F4F6F9] transition-colors"><Plus className="h-3.5 w-3.5" /> Add Section</button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Create Class</button>
      </div>
      <div className="space-y-3">
        {classesData.map(cls => (
          <div key={cls.grade} className="p-4 border border-[#E3E5E8] bg-white rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#EDF3FF] flex items-center justify-center"><Layers className="h-4 w-4 text-[#1A6FDB]" /></div>
                <div>
                  <div className="text-sm font-bold text-[#1A1F36]">{cls.grade}</div>
                  <div className="text-[10px] text-[#8A94A6]">Class Teacher: {cls.teacher} · Capacity: {cls.capacity}/section</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors"><Edit className="h-3 w-3 text-[#1A6FDB]" /></button>
                <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#FEF0F0] transition-colors"><Trash2 className="h-3 w-3 text-[#C62828]" /></button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {cls.sections.map(s => (
                <span key={s} className="px-3 py-1 bg-[#F4F6F9] border border-[#E3E5E8] rounded-lg text-xs font-bold text-[#4A5568] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors cursor-pointer">Section {s}</span>
              ))}
              <button className="px-3 py-1 border border-dashed border-[#C8CDD5] rounded-lg text-xs text-[#8A94A6] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors">+ Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectsSection() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Create Subject</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectsList.map(s => (
          <div key={s.name} className="p-4 border border-[#E3E5E8] bg-white rounded-xl hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}><BookOpen className={`h-5 w-5 ${s.color}`} /></div>
                <div><div className="text-sm font-bold text-[#1A1F36]">{s.name}</div><div className={`text-[10px] font-bold font-mono ${s.color}`}>{s.code}</div></div>
              </div>
              <div className="flex gap-1">
                <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#E8F0FD] transition-colors"><Edit className="h-3.5 w-3.5 text-[#1A6FDB]" /></button>
                <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#FEF0F0] transition-colors"><Trash2 className="h-3.5 w-3.5 text-[#C62828]" /></button>
              </div>
            </div>
            <div className="text-[10px] text-[#8A94A6]">Teacher: {s.teacher}</div>
            <div className="text-[10px] text-[#8A94A6]">Assigned to {s.classes} classes</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
          <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Channels</div>
          {[
            { label: 'Email Notifications', icon: Mail, enabled: true },
            { label: 'SMS Notifications', icon: MessageSquare, enabled: true },
            { label: 'Push Notifications', icon: Bell, enabled: false },
            { label: 'WhatsApp Messages', icon: Smartphone, enabled: false },
          ].map(ch => { const Icon = ch.icon; return (
            <div key={ch.label} className="flex items-center justify-between p-3 border border-[#E3E5E8] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#F4F6F9] flex items-center justify-center"><Icon className="h-4 w-4 text-[#8A94A6]" /></div>
                <span className="text-xs font-semibold text-[#1A1F36]">{ch.label}</span>
              </div>
              <div className={`relative h-5 w-9 rounded-full cursor-pointer transition-all ${ch.enabled ? 'bg-[#1A6FDB]' : 'bg-[#E3E5E8]'}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${ch.enabled ? 'left-4' : 'left-0.5'}`} />
              </div>
            </div>
          ); })}
        </div>
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
          <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Events</div>
          {[
            { event: 'Attendance Alert', desc: 'When student is absent' },
            { event: 'Fee Reminder', desc: '3 days before due date' },
            { event: 'Exam Result', desc: 'When results are published' },
            { event: 'Admission Status', desc: 'On application update' },
          ].map(ev => (
            <div key={ev.event} className="flex items-center justify-between p-3 border border-[#E3E5E8] rounded-xl">
              <div><div className="text-xs font-semibold text-[#1A1F36]">{ev.event}</div><div className="text-[10px] text-[#8A94A6]">{ev.desc}</div></div>
              <div className="h-5 w-9 rounded-full bg-[#1A6FDB] relative cursor-pointer"><div className="absolute top-0.5 left-4 h-4 w-4 rounded-full bg-white shadow" /></div>
            </div>
          ))}
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors"><Save className="h-3.5 w-3.5" /> Save Settings</button>
    </div>
  );
}

function EmailSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { title: 'Email (SMTP)', fields: ['SMTP Host','SMTP Port','Username','Password','From Email','From Name'] },
        { title: 'SMS Gateway', fields: ['API Key','API Secret','Sender ID','Provider'] },
      ].map(panel => (
        <div key={panel.title} className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-3">
          <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">{panel.title}</div>
          {panel.fields.map(f => (
            <div key={f} className="space-y-1">
              <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">{f}</label>
              <input type={f.toLowerCase().includes('password') || f.toLowerCase().includes('secret') || f.toLowerCase().includes('key') ? 'password' : 'text'} placeholder={f}
                className="block w-full h-8 px-3 border border-[#C8CDD5] bg-[#F7F8FA] rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] focus:bg-white transition-all" />
            </div>
          ))}
          <button className="w-full mt-2 py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors">Save {panel.title}</button>
        </div>
      ))}
    </div>
  );
}

function IntegrationsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { name: 'Google Meet', desc: 'Virtual classrooms', status: 'Available', icon: '🎥' },
        { name: 'Zoom', desc: 'Video conferencing', status: 'Available', icon: '📹' },
        { name: 'Razorpay', desc: 'Online fee collection', status: 'Available', icon: '💳' },
        { name: 'Stripe', desc: 'Global payment gateway', status: 'Available', icon: '💰' },
        { name: 'WhatsApp API', desc: 'Messaging integration', status: 'Coming Soon', icon: '📱' },
        { name: 'Firebase', desc: 'Push notifications', status: 'Coming Soon', icon: '🔥' },
      ].map(int => (
        <div key={int.name} className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-3 hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{int.icon}</span>
            <div><div className="text-sm font-bold text-[#1A1F36]">{int.name}</div><div className="text-[10px] text-[#8A94A6]">{int.desc}</div></div>
          </div>
          <button className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${int.status === 'Coming Soon' ? 'bg-[#F4F6F9] text-[#8A94A6] cursor-not-allowed' : 'bg-[#EDF3FF] text-[#1A6FDB] hover:bg-[#1A6FDB] hover:text-white'}`}>
            {int.status === 'Coming Soon' ? '🔒 Coming Soon' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );
}

function BrandingSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
        <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">School Colors</div>
        {[{ label: 'Primary Color', value: '#1A6FDB' },{ label: 'Secondary Color', value: '#1A1F36' },{ label: 'Accent Color', value: '#7C3AED' }].map(c => (
          <div key={c.label} className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#4A5568]">{c.label}</span>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-[#E3E5E8]" style={{ backgroundColor: c.value }} />
              <span className="text-xs font-mono text-[#8A94A6]">{c.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-3">
        <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Templates</div>
        {['Report Card Theme','Certificate Template','ID Card Template'].map(t => (
          <div key={t} className="flex items-center justify-between p-3 border border-[#E3E5E8] rounded-xl hover:border-[#1A6FDB]/40 transition-all">
            <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-[#8A94A6]" /><span className="text-xs font-medium text-[#4A5568]">{t}</span></div>
            <div className="flex gap-1">
              <button className="text-[11px] px-2 py-0.5 border border-[#E3E5E8] rounded text-[#4A5568] hover:border-[#1A6FDB] hover:text-[#1A6FDB] transition-colors">Preview</button>
              <button className="text-[11px] px-2 py-0.5 bg-[#EDF3FF] text-[#1A6FDB] rounded font-semibold hover:bg-[#1A6FDB] hover:text-white transition-colors">Upload</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackupSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
        <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Backup Options</div>
        <button className="w-full flex items-center gap-3 p-4 border border-[#1A6FDB]/30 bg-[#EDF3FF] rounded-xl hover:bg-[#1A6FDB] hover:text-white transition-all group text-left">
          <Download className="h-5 w-5 text-[#1A6FDB] group-hover:text-white" />
          <div><div className="text-xs font-bold text-[#1A6FDB] group-hover:text-white">Manual Backup</div><div className="text-[10px] text-[#8A94A6] group-hover:text-white/70">Download a full backup now</div></div>
        </button>
        <div className="p-4 border border-[#E3E5E8] rounded-xl space-y-2">
          <div className="text-xs font-semibold text-[#1A1F36]">Scheduled Backup</div>
          <select className="w-full h-8 px-3 border border-[#C8CDD5] bg-[#F7F8FA] rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] transition-all">
            <option>Daily at 2:00 AM</option><option>Weekly on Sunday</option><option>Monthly on 1st</option>
          </select>
          <button className="w-full py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors">Save Schedule</button>
        </div>
      </div>
      <div className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
        <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Recent Backups</div>
        {[
          { date: '2026-06-15 02:00', size: '42 MB' },
          { date: '2026-06-14 02:00', size: '41 MB' },
          { date: '2026-06-13 02:00', size: '40 MB' },
        ].map(b => (
          <div key={b.date} className="flex items-center justify-between p-3 border border-[#E3E5E8] rounded-xl">
            <div><div className="text-xs font-semibold text-[#1A1F36]">{b.date}</div><div className="text-[10px] text-[#8A94A6]">{b.size} · Auto</div></div>
            <div className="flex gap-1">
              <button className="text-[11px] px-2 py-1 bg-[#EDF3FF] text-[#1A6FDB] rounded font-semibold hover:bg-[#1A6FDB] hover:text-white transition-colors">Restore</button>
              <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8F0FD] transition-colors"><Download className="h-3 w-3 text-[#1A6FDB]" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { title: 'General', fields: [
          { label: 'Language', type: 'select', opts: ['English','Hindi','Tamil','Telugu','Kannada'] },
          { label: 'Time Zone', type: 'select', opts: ['Asia/Kolkata (IST +5:30)','UTC','Asia/Dubai'] },
          { label: 'Date Format', type: 'select', opts: ['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'] },
          { label: 'Currency', type: 'select', opts: ['INR (₹)','USD ($)','EUR (€)'] },
        ]},
        { title: 'Rules', fields: [
          { label: 'Attendance Threshold %', type: 'text', placeholder: 'e.g. 75' },
          { label: 'Fee Late Fine (₹)', type: 'text', placeholder: 'e.g. 50 per day' },
          { label: 'Max Login Attempts', type: 'text', placeholder: 'e.g. 5' },
          { label: 'Session Timeout (min)', type: 'text', placeholder: 'e.g. 30' },
        ]},
      ].map(panel => (
        <div key={panel.title} className="p-5 border border-[#E3E5E8] bg-white rounded-xl space-y-4">
          <div className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">{panel.title}</div>
          {panel.fields.map((f: any) => (
            <div key={f.label} className="space-y-1">
              <label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">{f.label}</label>
              {f.type === 'select'
                ? <select className="block w-full h-8 px-3 border border-[#C8CDD5] bg-[#F7F8FA] rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] focus:bg-white transition-all">{f.opts.map((o: string) => <option key={o}>{o}</option>)}</select>
                : <input type="text" placeholder={f.placeholder} className="block w-full h-8 px-3 border border-[#C8CDD5] bg-[#F7F8FA] rounded-lg text-xs focus:outline-none focus:border-[#1A6FDB] focus:bg-white transition-all" />
              }
            </div>
          ))}
          <button className="w-full py-1.5 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors mt-2">Save {panel.title}</button>
        </div>
      ))}
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
