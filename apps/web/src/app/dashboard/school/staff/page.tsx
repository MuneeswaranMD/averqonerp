'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Download, Filter, Edit2, ShieldOff, Users, AlertCircle, Shield, X, Save, CheckCircle2 } from 'lucide-react';

interface StaffUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  customRole?: {
    id: string;
    name: string;
  } | null;
}

export default function StaffListPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [editMember, setEditMember] = useState<StaffUser | null>(null);
  const [disableMember, setDisableMember] = useState<StaffUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast]  = useState('');
  const [editEmail, setEditEmail] = useState('');

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const openEdit = (m: StaffUser) => {
    setEditMember(m);
    setEditFirst(m.firstName);
    setEditLast(m.lastName);
    setEditEmail(m.email);
  };

  const handleSaveEdit = async () => {
    if (!editMember) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr!);
      const res = await fetch(`http://localhost:3001/api/v1/access-control/users/${editMember.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'x-school-id': user.schoolId },
        body: JSON.stringify({ firstName: editFirst, lastName: editLast, email: editEmail }),
      });
      showToast(res.ok ? 'success' : 'error', res.ok ? 'Staff updated successfully.' : 'Failed to update staff.');
      if (res.ok) { setEditMember(null); fetchStaff(); }
    } catch { showToast('error', 'Network error.'); }
    finally { setSaving(false); }
  };

  const handleToggleActive = async () => {
    if (!disableMember) return;
    setSaving(true);
    try {
      showToast('success', `${disableMember.firstName} ${disableMember.isActive ? 'disabled' : 'enabled'} (demo).`);
      setStaff(prev => prev.map(s => s.id === disableMember.id ? { ...s, isActive: !s.isActive } : s));
      setDisableMember(null);
    } catch { showToast('error', 'Network error.'); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) {
        throw new Error('Not authenticated');
      }

      const user = JSON.parse(userStr);
      
      const res = await fetch('http://localhost:3001/api/v1/access-control/users', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId 
        }
      });
      
      if (!res.ok) {
        const errText = await res.text();
        console.error('Fetch staff error details:', res.status, res.statusText, errText);
        throw new Error('Failed to fetch staff data: ' + res.status + ' ' + errText);
      }

      const data: StaffUser[] = await res.json();
      
      // Filter out STUDENTS and PARENTS
      const staffMembers = data.filter(u => u.role !== 'STUDENT' && u.role !== 'PARENT');
      setStaff(staffMembers);
    } catch (err: any) {
      console.error('Failed to fetch staff', err);
      setError(err.message || 'An error occurred while fetching staff directory.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${toast.type === 'success' ? 'bg-[#EDF7ED] text-[#2E7D32] border border-[#2E7D32]/20' : 'bg-[#FEF0F0] text-[#C62828] border border-[#C62828]/20'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Edit Modal */}
      {editMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E5E8]">
              <div><div className="text-sm font-bold text-[#1A1F36]">Edit Staff Member</div><div className="text-xs text-[#8A94A6]">{editMember.role.replace('_',' ')}</div></div>
              <button onClick={() => setEditMember(null)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#F4F6F9]"><X className="h-4 w-4 text-[#8A94A6]" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">First Name</label>
                  <input value={editFirst} onChange={e => setEditFirst(e.target.value)} className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Last Name</label>
                  <input value={editLast} onChange={e => setEditLast(e.target.value)} className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" /></div>
              </div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Email</label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="block w-full h-9 px-3 border border-[#C8CDD5] rounded-lg text-sm focus:outline-none focus:border-[#1A6FDB] transition-all" /></div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setEditMember(null)} className="flex-1 h-9 border border-[#E3E5E8] rounded-lg text-xs font-semibold text-[#4A5568] hover:bg-[#F4F6F9] transition-colors">Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving} className="flex-1 h-9 bg-[#1A6FDB] text-white rounded-lg text-xs font-bold hover:bg-[#1558B0] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60">
                <Save className="h-3.5 w-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable Confirm */}
      {disableMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
            <div className="p-6 space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#FFF8E6] flex items-center justify-center mx-auto"><ShieldOff className="h-6 w-6 text-[#B45309]" /></div>
              <div className="text-center">
                <div className="text-sm font-bold text-[#1A1F36]">{disableMember.isActive ? 'Disable' : 'Enable'} Staff?</div>
                <div className="text-xs text-[#8A94A6] mt-1">{disableMember.firstName} {disableMember.lastName} will {disableMember.isActive ? 'lose system access' : 'regain access'}.</div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setDisableMember(null)} className="flex-1 h-9 border border-[#E3E5E8] rounded-lg text-xs font-semibold text-[#4A5568] hover:bg-[#F4F6F9] transition-colors">Cancel</button>
                <button onClick={handleToggleActive} disabled={saving} className={`flex-1 h-9 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-60 ${disableMember.isActive ? 'bg-[#C62828] hover:bg-[#A82020]' : 'bg-[#2E7D32] hover:bg-[#256428]'}`}>
                  {saving ? 'Processing...' : disableMember.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Users className="h-5 w-5 text-[#1A6FDB]" />
            Staff Directory
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Manage teaching and non-teaching staff profiles</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export List
          </button>
          <Link 
            href="/dashboard/admin/staff/new"
            className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add New Staff
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 border border-[#F5C2C2] font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main content table */}
      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA] rounded-t-lg">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
            <input 
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
            />
          </div>
          <button className="h-9 px-4 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9] text-[#4A5568] uppercase tracking-wider font-semibold">
                <th className="p-4">Staff Member</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Custom Permissions</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-6 w-6 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
                      <span className="text-xs font-medium text-[#8A94A6]">Loading staff directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#8A94A6] text-sm">
                    {searchTerm ? 'No staff members found matching your search.' : 'No staff members exist in the system yet.'}
                  </td>
                </tr>
              ) : (
                filteredStaff.map(member => (
                  <tr key={member.id} className="hover:bg-[#F7F8FA] transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-[#1A1F36]">{member.firstName} {member.lastName}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5 font-mono">{member.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8F0FD] text-[#1A6FDB]">
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      {member.customRole ? (
                        <div className="flex items-center gap-1.5 text-[#1A1F36] font-medium text-[11px]">
                          <Shield className="h-3.5 w-3.5 text-[#2E7D32]" /> {member.customRole.name}
                        </div>
                      ) : (
                        <span className="text-[#8A94A6] italic text-[11px]">Standard Privileges</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        member.isActive ? 'bg-[#EDF7ED] text-[#2E7D32]' : 'bg-[#FEF0F0] text-[#C62828]'
                      }`}>
                        {member.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="Edit Profile" onClick={() => openEdit(member)}
                          className="p-1.5 text-[#8A94A6] hover:text-[#1A6FDB] hover:bg-[#EDF3FF] rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button title={member.isActive ? 'Disable' : 'Enable'} onClick={() => setDisableMember(member)}
                          className="p-1.5 text-[#8A94A6] hover:text-[#C62828] hover:bg-[#FEF0F0] rounded transition-colors">
                          <ShieldOff className="h-4 w-4" />
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
