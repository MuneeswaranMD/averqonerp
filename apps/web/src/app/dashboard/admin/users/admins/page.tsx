'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, Search, Filter, Plus, Edit2, Trash2, Mail, Lock, 
  Unlock, Activity, MonitorSmartphone, MapPin, Clock, Server,
  AlertTriangle, CheckCircle, XCircle, Power, UserPlus, Save, RefreshCw
} from 'lucide-react';

// Mock Data Types
type AdminUser = {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Locked';
  activeModules: number;
};

const MODULES = [
  'Dashboard', 'Admissions', 'Students', 'Staff', 'Attendance', 
  'Fees', 'Accounting', 'Exams', 'LMS', 'Transport', 'Reports', 
  'Communication', 'Settings', 'Audit Logs'
];

const PERMISSIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'];

export default function SchoolAdminsPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'provisioning' | 'access' | 'tracking'>('directory');
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [schools, setSchools] = useState<{id: string, name: string}[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSchoolId, setFormSchoolId] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Permissions State
  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, Record<string, boolean>>>({});

  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/platform-admin/admins', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (e) {
      console.error('Failed to fetch admins');
    }
  };

  useEffect(() => {
    // Fetch real schools and admins
    const fetchSchools = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/platform-admin/schools', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSchools(data);
          if (data.length === 1) {
            setFormSchoolId(data[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to fetch schools');
      }
    };
    
    fetchSchools();
    fetchAdmins();
  }, []);

  const handleSelectAdmin = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormName(admin.name);
    setFormEmail(admin.email);
    setFormPhone((admin as any).phone || '');
    setFormSchoolId((admin as any).schoolId || '');
    setFormPassword(''); // Reset password field
    setActiveTab('provisioning');
    fetchPermissions(admin.id);
  };

  const fetchPermissions = async (adminId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/platform-admin/admins/${adminId}/permissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPermissionsMatrix(data);
      }
    } catch (e) {
      console.error('Failed to fetch permissions');
    }
  };

  const handleNewAdmin = () => {
    setSelectedAdmin(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormSchoolId('');
    setFormPassword('');
    setActiveTab('provisioning');
  };

  const handleSaveProfile = async () => {
    if (!formName || !formEmail || !formSchoolId || formSchoolId === 'mock') {
      alert('Please fill out all required fields, including selecting a valid school.');
      return;
    }
    setLoading(true);
    const method = selectedAdmin ? 'PUT' : 'POST';
    const url = selectedAdmin 
      ? `http://localhost:3001/api/v1/platform-admin/admins/${selectedAdmin.id}`
      : `http://localhost:3001/api/v1/platform-admin/admins`;
      
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          schoolId: formSchoolId,
          password: formPassword || undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Successfully ${selectedAdmin ? 'updated' : 'provisioned'} admin!`);
        if (data.tempPassword) {
          alert(`Temporary Password: ${data.tempPassword}`);
        }
        await fetchAdmins();
        setActiveTab('directory');
      } else {
        const errData = await res.json().catch(() => null);
        alert(`Failed to save profile: ${errData?.message || res.statusText}`);
      }
    } catch (e: any) {
      alert(`Error saving profile: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/platform-admin/admins/${selectedAdmin.id}/lock`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (res.ok) {
        alert('Successfully toggled admin lock status!');
        await fetchAdmins();
        setActiveTab('directory');
      } else {
        alert('Failed to toggle lock status');
      }
    } catch (e) {
      alert('Error toggling lock status');
    }
  };

  const handleTogglePermission = (module: string, action: string) => {
    setPermissionsMatrix(prev => ({
      ...prev,
      [module]: {
        ...(prev[module] || {}),
        [action]: !(prev[module]?.[action] || false)
      }
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedAdmin) return;
    setLoading(true);

    const flatPermissions: { module: string, action: string, allowed: boolean }[] = [];
    Object.entries(permissionsMatrix).forEach(([module, actions]) => {
      Object.entries(actions).forEach(([action, allowed]) => {
        flatPermissions.push({ module, action, allowed });
      });
    });

    try {
      const res = await fetch(`http://localhost:3001/api/v1/platform-admin/admins/${selectedAdmin.id}/permissions`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
        },
        body: JSON.stringify(flatPermissions)
      });
      if (res.ok) {
        alert('Permissions successfully saved!');
      } else {
        alert('Failed to save permissions');
      }
    } catch (e) {
      alert('Error saving permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col font-sans bg-[#F4F5F7]">
      {/* Header */}
      <div className="flex-none bg-white border-b border-[#E3E5E8] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#1A6FDB]" />
            School Admin Management Console
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Global access control, provisioning, and live tracking for tenant administrators.</div>
        </div>
        <div className="flex items-center gap-2">
          {selectedAdmin && (
             <div className="px-3 py-1.5 bg-[#F4F6F9] border border-[#E3E5E8] rounded text-xs font-medium text-[#4A5568] flex items-center gap-2 mr-2">
               Managing: <span className="font-bold text-[#1A1F36]">{selectedAdmin.name}</span>
               <button onClick={() => setSelectedAdmin(null)} className="hover:text-red-600 transition-colors"><XCircle className="h-3.5 w-3.5"/></button>
             </div>
          )}
          <button 
            onClick={handleNewAdmin}
            className="h-9 px-4 rounded bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" /> Provision Admin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-none bg-white border-b border-[#E3E5E8] px-6">
        <div className="flex gap-6 text-sm font-medium">
          {['directory', 'provisioning', 'access', 'tracking'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 border-b-2 transition-colors capitalize ${
                activeTab === tab 
                  ? 'border-[#1A6FDB] text-[#1A6FDB]' 
                  : 'border-transparent text-[#4A5568] hover:text-[#1A1F36]'
              }`}
            >
              {tab === 'access' ? 'Access Control' : tab === 'tracking' ? 'Live Tracking' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* DIRECTORY TAB */}
        {activeTab === 'directory' && (
          <div className="bg-white border border-[#E3E5E8] rounded-sm">
            <div className="p-4 border-b border-[#E3E5E8] flex justify-between items-center bg-white">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
                <input 
                  type="text"
                  placeholder="Search admin name, email, or school..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-[#C8CDD5] rounded focus:outline-none focus:border-[#1A6FDB] transition-all"
                />
              </div>
              <button className="h-8 px-3 rounded border border-[#C8CDD5] text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-medium flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> Filters
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3E5E8] bg-[#F9FAFB] text-[#4A5568] font-semibold uppercase tracking-wider">
                  <th className="p-4">Admin Name</th>
                  <th className="p-4">Tenant School</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">Active Modules</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E8]">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer" onClick={() => handleSelectAdmin(admin)}>
                    <td className="p-4 font-semibold text-[#1A1F36]">{admin.name}</td>
                    <td className="p-4 text-[#4A5568]">{admin.schoolName}</td>
                    <td className="p-4 text-[#1A6FDB] hover:underline">{admin.email}</td>
                    <td className="p-4 text-[#8A94A6] flex items-center gap-1"><Clock className="h-3 w-3"/> {new Date(admin.lastLogin).toLocaleString() !== 'Invalid Date' ? new Date(admin.lastLogin).toLocaleString() : admin.lastLogin}</td>
                    <td className="p-4 font-mono text-[#4A5568]">{admin.activeModules} / {MODULES.length}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        admin.status === 'Active' ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]' : 
                        admin.status === 'Locked' ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]' : 
                        'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]'
                      }`}>
                        {admin.status === 'Active' ? <CheckCircle className="h-3 w-3"/> : <Lock className="h-3 w-3"/>}
                        {admin.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[#1A6FDB] hover:text-[#1558B0] font-medium" onClick={(e) => { e.stopPropagation(); handleSelectAdmin(admin); }}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PROVISIONING & HEALTH TAB */}
        {activeTab === 'provisioning' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[#E3E5E8] rounded-sm">
                <div className="p-5 border-b border-[#E3E5E8] bg-white flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-[#1A1F36]">{selectedAdmin ? 'Edit Administrator Profile' : 'Provision New Administrator'}</h3>
                  <button onClick={handleSaveProfile} disabled={loading} className="h-8 px-4 rounded bg-[#1A1F36] hover:bg-[#2D3748] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50">
                    <Save className="h-3.5 w-3.5" /> Save Profile
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#4A5568]">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" value={formName} onChange={e => setFormName(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded focus:outline-none focus:border-[#1A6FDB] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#4A5568]">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded focus:outline-none focus:border-[#1A6FDB] transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#4A5568]">Phone Number</label>
                      <input type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded focus:outline-none focus:border-[#1A6FDB] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#4A5568]">Set New Password</label>
                      <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder={selectedAdmin ? "Leave blank to keep current" : "Leave blank to auto-generate"} className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded focus:outline-none focus:border-[#1A6FDB] transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#4A5568]">Assign Tenant School <span className="text-red-500">*</span></label>
                      <select value={formSchoolId} onChange={e => setFormSchoolId(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#C8CDD5] rounded focus:outline-none focus:border-[#1A6FDB] transition-all">
                        <option value="">Select a school...</option>
                        {schools.length > 0 ? schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : <option value="mock">Green Valley International</option>}
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-5 border-t border-[#E3E5E8] flex gap-4">
                    <button className="h-9 px-4 rounded border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <RefreshCw className="h-3.5 w-3.5" /> Generate Temporary Password
                    </button>
                    <button className="h-9 px-4 rounded border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <Mail className="h-3.5 w-3.5" /> Send Welcome Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Health & Emergency */}
            <div className="space-y-6">
              <div className="bg-white border border-[#E3E5E8] rounded-sm p-5">
                <h3 className="text-sm font-semibold text-[#1A1F36] mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-[#1A6FDB]" /> School Health Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#F4F6F9]">
                    <span className="text-xs text-[#8A94A6]">Total Students</span>
                    <span className="text-sm font-semibold text-[#1A1F36]">1,450</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F4F6F9]">
                    <span className="text-xs text-[#8A94A6]">Total Staff</span>
                    <span className="text-sm font-semibold text-[#1A1F36]">124</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F4F6F9]">
                    <span className="text-xs text-[#8A94A6]">Storage Usage</span>
                    <span className="text-sm font-semibold text-[#1A1F36]">45.2 GB / 100 GB</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-[#8A94A6]">Subscription</span>
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EDF7ED] text-[#2E7D32]">Active Pro</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-sm p-5">
                <h3 className="text-sm font-semibold text-[#991B1B] mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Emergency Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-xs font-medium text-[#991B1B] hover:bg-[#FEE2E2] rounded border border-[#FECACA] transition-all flex items-center gap-2">
                    <Power className="h-3.5 w-3.5" /> Force Logout All Users
                  </button>
                  <button onClick={handleToggleLock} disabled={!selectedAdmin} className="w-full text-left px-3 py-2 text-xs font-medium text-[#991B1B] hover:bg-[#FEE2E2] rounded border border-[#FECACA] transition-all flex items-center gap-2 disabled:opacity-50">
                    <Lock className="h-3.5 w-3.5" /> Toggle Admin Lock
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded border border-[#DC2626] transition-all flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Suspend Entire Tenant School
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACCESS CONTROL TAB */}
        {activeTab === 'access' && (
          <div className="bg-white border border-[#E3E5E8] rounded-sm">
             <div className="p-4 border-b border-[#E3E5E8] bg-[#F9FAFB] flex justify-between items-center">
               <div>
                  <h3 className="text-sm font-semibold text-[#1A1F36]">Granular Access Matrix</h3>
                  <p className="text-xs text-[#8A94A6] mt-0.5">Toggle specific CRUD permissions across all system modules for {selectedAdmin?.name || 'this administrator'}.</p>
               </div>
               <div className="flex gap-2">
                  <select className="h-8 px-2 rounded border border-[#C8CDD5] text-xs focus:outline-none">
                    <option>Apply Template: Full Access</option>
                    <option>Apply Template: Read-Only</option>
                    <option>Apply Template: HR Admin</option>
                  </select>
                  <button onClick={handleSavePermissions} disabled={!selectedAdmin || loading} className="h-8 px-4 rounded bg-[#1A1F36] hover:bg-[#2D3748] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50">
                    <Save className="h-3.5 w-3.5" /> Save Permissions
                  </button>
               </div>
             </div>
             
             <div className="overflow-x-auto p-0">
               <table className="w-full text-left text-xs border-collapse">
                 <thead>
                   <tr className="bg-white border-b border-[#E3E5E8]">
                     <th className="p-3 font-semibold text-[#4A5568] w-48 border-r border-[#E3E5E8]">System Module</th>
                     {PERMISSIONS.map(p => (
                       <th key={p} className="p-3 font-semibold text-[#4A5568] text-center">{p}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E3E5E8]">
                   {MODULES.map(module => (
                     <tr key={module} className="hover:bg-[#F9FAFB]">
                       <td className="p-3 font-medium text-[#1A1F36] border-r border-[#E3E5E8]">{module}</td>
                       {PERMISSIONS.map(p => (
                         <td key={p} className="p-3 text-center">
                           <input 
                             type="checkbox" 
                             checked={permissionsMatrix[module]?.[p] || false}
                             onChange={() => handleTogglePermission(module, p)}
                             className="w-3.5 h-3.5 rounded border-[#C8CDD5] text-[#1A6FDB] focus:ring-[#1A6FDB] cursor-pointer"
                           />
                         </td>
                       ))}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* LIVE TRACKING TAB */}
        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Activity Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[#E3E5E8] rounded-sm">
                <div className="p-4 border-b border-[#E3E5E8] bg-white flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-[#1A1F36] flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" /> Live Audit Feed
                  </h3>
                  <div className="flex gap-2">
                    <select className="h-8 px-2 rounded border border-[#C8CDD5] text-xs focus:outline-none">
                      <option>All Modules</option>
                      <option>Admissions</option>
                      <option>Fees</option>
                    </select>
                    <select className="h-8 px-2 rounded border border-[#C8CDD5] text-xs focus:outline-none">
                      <option>Last 24 Hours</option>
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9FAFB] border-b border-[#E3E5E8]">
                      <tr>
                        <th className="p-3 font-semibold text-[#4A5568]">Timestamp</th>
                        <th className="p-3 font-semibold text-[#4A5568]">Action Performed</th>
                        <th className="p-3 font-semibold text-[#4A5568]">Module</th>
                        <th className="p-3 font-semibold text-[#4A5568]">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E5E8]">
                      {[
                        { time: '10:42 AM', action: 'Approved Admission Application #A-1024', mod: 'Admissions', ip: '192.168.1.42' },
                        { time: '09:15 AM', action: 'Updated Fee Category "Tuition Fee Q1"', mod: 'Fees', ip: '192.168.1.42' },
                        { time: '08:30 AM', action: 'Exported Student Directory Report', mod: 'Reports', ip: '192.168.1.42' },
                        { time: 'Yesterday', action: 'Created new user role "Library Assistant"', mod: 'Settings', ip: '104.28.19.12' },
                      ].map((log, i) => (
                        <tr key={i} className="hover:bg-[#F9FAFB]">
                          <td className="p-3 text-[#8A94A6]">{log.time}</td>
                          <td className="p-3 font-medium text-[#1A1F36]">{log.action}</td>
                          <td className="p-3 text-[#4A5568]"><span className="bg-[#F4F6F9] px-2 py-0.5 rounded border border-[#E3E5E8]">{log.mod}</span></td>
                          <td className="p-3 text-[#8A94A6] font-mono">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col: Login History */}
            <div className="space-y-6">
              <div className="bg-white border border-[#E3E5E8] rounded-sm">
                <div className="p-4 border-b border-[#E3E5E8] bg-[#F9FAFB]">
                  <h3 className="text-sm font-semibold text-[#1A1F36]">Recent Login History</h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { status: 'success', time: 'Today, 08:29 AM', device: 'Chrome on Windows', loc: 'New York, USA', ip: '192.168.1.42' },
                    { status: 'success', time: 'Yesterday, 07:15 AM', device: 'Safari on iPhone', loc: 'New York, USA', ip: '104.28.19.12' },
                    { status: 'failed', time: 'Oct 12, 11:42 PM', device: 'Unknown Device', loc: 'Moscow, RU', ip: '45.12.33.11' },
                  ].map((login, i) => (
                    <div key={i} className="flex gap-3 pb-4 border-b border-[#E3E5E8] last:border-0 last:pb-0">
                      <div className={`mt-0.5 shrink-0 ${login.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {login.status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-[#1A1F36]">{login.time}</div>
                        <div className="text-[11px] text-[#4A5568] flex items-center gap-1"><MonitorSmartphone className="h-3 w-3 text-[#8A94A6]"/> {login.device}</div>
                        <div className="text-[11px] text-[#4A5568] flex items-center gap-1"><MapPin className="h-3 w-3 text-[#8A94A6]"/> {login.loc}</div>
                        <div className="text-[11px] text-[#8A94A6] flex items-center gap-1 font-mono"><Server className="h-3 w-3 text-[#8A94A6]"/> {login.ip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}