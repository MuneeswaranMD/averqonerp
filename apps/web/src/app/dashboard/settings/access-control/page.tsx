'use client';

import { useEffect, useState } from 'react';
import { 
  Shield, Users, Activity, Key, Award, AlertCircle, 
  CheckCircle, Plus, Trash2, Save, Search, RefreshCw, Smartphone
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface CustomRole {
  id: string;
  name: string;
  permissions: { permission: Permission }[];
  _count: { users: number };
}

interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  customRole: { id: string; name: string } | null;
  _count: { userPermissions: number };
}

interface UserOverrideItem {
  permissionId: string;
  name: string;
  description: string;
  overrideState: boolean | null; // true, false, or null (default)
}

interface PendingExamResult {
  id: string;
  marksObtained: string;
  maxMarks: string;
  exam: { id: string; name: string };
  subject: { id: string; name: string };
  student: { user: { firstName: string; lastName: string } };
}

interface LoginActivityLog {
  id: string;
  ipAddress: string | null;
  device: string | null;
  location: string | null;
  loginTime: string;
  user: { email: string; firstName: string; lastName: string };
}

interface AuditLogItem {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: { email: string; firstName: string; lastName: string };
}

export default function AccessControlPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'overrides' | 'exams' | 'logins' | 'audits'>('roles');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ─── TABS DATA STATE ──────────────────────────────────────
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [catalog, setCatalog] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string[]>([]); // permission names

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [userOverrides, setUserOverrides] = useState<UserOverrideItem[]>([]);
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<string>('none');
  const [searchTerm, setSearchTerm] = useState('');

  const [pendingExams, setPendingExams] = useState<PendingExamResult[]>([]);
  const [loginActivities, setLoginActivities] = useState<LoginActivityLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // ─── FETCH ON TAB CHANGE ──────────────────────────────────
  useEffect(() => {
    setError(null);
    setSuccess(null);
    if (activeTab === 'roles') {
      fetchRolesAndCatalog();
    } else if (activeTab === 'overrides') {
      fetchUsersAndCatalog();
    } else if (activeTab === 'exams') {
      fetchPendingExams();
    } else if (activeTab === 'logins') {
      fetchLoginActivities();
    } else if (activeTab === 'audits') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  // ─── ROLES TAB METHODS ────────────────────────────────────
  const fetchRolesAndCatalog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const pRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/permissions`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const pData = await pRes.json();
      if (!pRes.ok) throw new Error(pData.message || 'Failed to load permissions catalog.');
      setCatalog(pData);

      const rRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/roles`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const rData = await rRes.json();
      if (!rRes.ok) throw new Error(rData.message || 'Failed to load custom roles.');
      setRoles(rData);

      if (rData.length > 0) {
        handleSelectRole(rData[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Network failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: CustomRole) => {
    setSelectedRole(role);
    setSelectedRolePermissions(role.permissions.map(p => p.permission.name));
  };

  const handleToggleRolePermission = (permName: string) => {
    setSelectedRolePermissions(prev => 
      prev.includes(permName) 
        ? prev.filter(p => p !== permName) 
        : [...prev, permName]
    );
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId
        },
        body: JSON.stringify({
          name: selectedRole.name,
          permissionNames: selectedRolePermissions
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save role settings.');
      }

      setSuccess(`Permissions for custom role "${selectedRole.name}" updated successfully.`);
      fetchRolesAndCatalog();
    } catch (err: any) {
      setError(err.message || 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId
        },
        body: JSON.stringify({
          name: newRoleName,
          permissionNames: []
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create role.');

      setSuccess(`Custom role "${newRoleName}" created successfully.`);
      setNewRoleName('');
      fetchRolesAndCatalog();
    } catch (err: any) {
      setError(err.message || 'Creation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this custom role? This will unassign it from all users.')) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/roles/${roleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete role.');
      }

      setSuccess('Custom role removed successfully.');
      fetchRolesAndCatalog();
    } catch (err: any) {
      setError(err.message || 'Deletion failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─── USER OVERRIDES METHODS ───────────────────────────────
  const fetchUsersAndCatalog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      // Fetch custom roles list first
      const rRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/roles`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const rData = await rRes.json();
      if (rRes.ok) setRoles(rData);

      const uRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/users`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const uData = await uRes.json();
      if (!uRes.ok) throw new Error(uData.message || 'Failed to load school users.');
      setUsers(uData);

      if (uData.length > 0) {
        handleSelectUser(uData[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Network failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (targetUser: UserSummary) => {
    setSelectedUser(targetUser);
    setSelectedUserRoleId(targetUser.customRole?.id || 'none');
    
    // Fetch individual user overrides
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/users/${targetUser.id}/overrides`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const data = await res.json();
      if (res.ok) {
        setUserOverrides(data);
      }
    } catch (err) {
      console.error('Failed to fetch user overrides', err);
    }
  };

  const handleOverrideChange = (permissionId: string, value: boolean | null) => {
    setUserOverrides(prev => 
      prev.map(o => o.permissionId === permissionId ? { ...o, overrideState: value } : o)
    );
  };

  const handleSaveUserPermissions = async () => {
    if (!selectedUser) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      // 1. Save user Custom Role definition
      const roleIdPayload = selectedUserRoleId === 'none' ? null : selectedUserRoleId;
      const roleRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId
        },
        body: JSON.stringify({ customRoleId: roleIdPayload })
      });

      if (!roleRes.ok) {
        const rData = await roleRes.json();
        throw new Error(rData.message || 'Failed to update custom role assignment.');
      }

      // 2. Save user individual granular permission overrides
      const overridePayload = userOverrides.map(o => ({
        permissionName: o.name,
        allowed: o.overrideState
      }));

      const overrideRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/users/${selectedUser.id}/overrides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId
        },
        body: JSON.stringify({ overrides: overridePayload })
      });

      if (!overrideRes.ok) {
        const oData = await overrideRes.json();
        throw new Error(oData.message || 'Failed to save individual permission overrides.');
      }

      setSuccess(`Access settings and override policies for ${selectedUser.firstName} ${selectedUser.lastName} updated successfully.`);
      fetchUsersAndCatalog();
    } catch (err: any) {
      setError(err.message || 'Failed to update overrides.');
    } finally {
      setLoading(false);
    }
  };

  // ─── PENDING EXAMS METHODS ────────────────────────────────
  const fetchPendingExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/exams/results/pending`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch pending results.');
      setPendingExams(data);
    } catch (err: any) {
      setError(err.message || 'Network failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveExams = async (examId: string, subjectId: string, examName: string, subjectName: string) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/exams/results/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId
        },
        body: JSON.stringify({ examId, subjectId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to publish scores.');
      }

      setSuccess(`Results for ${examName} - ${subjectName} have been approved and published to candidate portals.`);
      fetchPendingExams();
    } catch (err: any) {
      setError(err.message || 'Approval request failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─── DIAGNOSTIC HISTORY FETCH ─────────────────────────────
  const fetchLoginActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/login-activities`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch logins log.');
      setLoginActivities(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/access-control/audit-logs`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-school-id': user.schoolId }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch audit trails.');
      setAuditLogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Group pending results by exam and subject
  const getGroupedPendingExams = () => {
    const groups: Record<string, { examId: string; subjectId: string; examName: string; subjectName: string; count: number; items: PendingExamResult[] }> = {};
    
    pendingExams.forEach(item => {
      const key = `${item.exam.id}-${item.subject.id}`;
      if (!groups[key]) {
        groups[key] = {
          examId: item.exam.id,
          subjectId: item.subject.id,
          examName: item.exam.name,
          subjectName: item.subject.name,
          count: 0,
          items: []
        };
      }
      groups[key].count += 1;
      groups[key].items.push(item);
    });

    return Object.values(groups);
  };

  const groupedPendingExams = getGroupedPendingExams();
  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Access Control & Security Settings</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">
            averqonerp &gt; Global Administration &gt; Governance
          </div>
        </div>
        <div className="text-xs text-[#8A94A6] font-mono select-none">
          Governance & Auditing Module
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="p-3.5 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-2 border-none font-medium transition-all">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-md bg-[#EDF7ED] text-[#2E7D32] text-xs flex items-start gap-2 border-none font-medium transition-all">
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs list - Zoho Flat style */}
      <div className="flex border-b border-[#E3E5E8] overflow-x-auto select-none bg-white p-1 rounded-t-md">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'roles'
              ? 'border-[#1A6FDB] text-[#1A6FDB]'
              : 'border-transparent text-[#8A94A6] hover:text-[#1A1F36]'
          }`}
        >
          <Shield className="h-4 w-4" /> Custom Roles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('overrides')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'overrides'
              ? 'border-[#1A6FDB] text-[#1A6FDB]'
              : 'border-transparent text-[#8A94A6] hover:text-[#1A1F36]'
          }`}
        >
          <Key className="h-4 w-4" /> User Overrides Policy
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'exams'
              ? 'border-[#1A6FDB] text-[#1A6FDB]'
              : 'border-transparent text-[#8A94A6] hover:text-[#1A1F36]'
          }`}
        >
          <Award className="h-4 w-4" /> Marks Approval Queue
        </button>
        <button
          onClick={() => setActiveTab('logins')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'logins'
              ? 'border-[#1A6FDB] text-[#1A6FDB]'
              : 'border-transparent text-[#8A94A6] hover:text-[#1A1F36]'
          }`}
        >
          <Smartphone className="h-4 w-4" /> Device Login History
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'audits'
              ? 'border-[#1A6FDB] text-[#1A6FDB]'
              : 'border-transparent text-[#8A94A6] hover:text-[#1A1F36]'
          }`}
        >
          <Activity className="h-4 w-4" /> Audit Ledger Trails
        </button>
      </div>

      {/* ─── TAB CONTENTS ──────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-[#8A94A6]">
          <div className="h-7 w-7 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3.5" />
          <span className="text-xs font-semibold">Updating compliance logs...</span>
        </div>
      )}

      {!loading && activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Roles list */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
            <div className="border-b border-[#E3E5E8] pb-2">
              <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Custom School Roles</h3>
            </div>
            
            <form onSubmit={handleCreateRole} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Exam Coordinator"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="flex-1 h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] transition-all"
              />
              <button
                type="submit"
                className="h-9 px-3.5 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </form>

            {roles.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#8A94A6]">
                No custom roles defined. Add one above.
              </div>
            ) : (
              <div className="space-y-1.5 pt-2">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r)}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all border ${
                      selectedRole?.id === r.id
                        ? 'bg-[#E8F0FD] border-[#1A6FDB] text-[#1A6FDB]'
                        : 'border-[#E3E5E8] hover:bg-[#F4F6F9] text-[#1A1F36]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{r.name}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5">
                        {r._count.users} Assigned User(s) • {r.permissions.length} Rule(s)
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(r.id);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove custom role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-2 p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
            <div className="border-b border-[#E3E5E8] pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">
                {selectedRole ? `Permissions Matrix: ${selectedRole.name}` : 'Role Permissions Matrix'}
              </h3>
              {selectedRole && (
                <button
                  onClick={handleSaveRolePermissions}
                  className="h-8 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </button>
              )}
            </div>

            {!selectedRole ? (
              <div className="text-center py-16 text-xs text-[#8A94A6]">
                Select a custom role from the list to manage its rules and capabilities.
              </div>
            ) : (
              <div className="border border-[#E3E5E8] rounded-md overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[10px] tracking-wider select-none">
                      <th className="p-3 pl-4 w-1/12 text-center">Allow</th>
                      <th className="p-3 w-1/3">Permission Rule</th>
                      <th className="p-3 pr-4">Functionality Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
                    {catalog.map((p) => {
                      const isChecked = selectedRolePermissions.includes(p.name);
                      return (
                        <tr key={p.id} className="hover:bg-[#F7F8FA] transition-all">
                          <td className="p-3 pl-4 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleRolePermission(p.name)}
                              className="h-4 w-4 text-[#1A6FDB] border-[#C8CDD5] rounded focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-semibold text-[#1A6FDB] font-mono text-[11px]">
                            {p.name}
                          </td>
                          <td className="p-3 pr-4 text-[#4A5568] text-xs">
                            {p.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === 'overrides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* User selector */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
            <div className="border-b border-[#E3E5E8] pb-2">
              <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">School Staff & Members</h3>
            </div>
            
            <div className="flex items-center bg-[#F4F6F9] border border-[#E3E5E8] rounded-md px-3 py-1.5 gap-2">
              <Search className="h-4 w-4 text-[#8A94A6]" />
              <input
                type="text"
                placeholder="Filter members by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none w-full"
              />
            </div>

            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pt-1">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  className={`p-3 rounded-md cursor-pointer transition-all border ${
                    selectedUser?.id === u.id
                      ? 'bg-[#E8F0FD] border-[#1A6FDB] text-[#1A6FDB]'
                      : 'border-[#E3E5E8] hover:bg-[#F4F6F9] text-[#1A1F36]'
                  }`}
                >
                  <div className="text-xs font-semibold">{u.firstName} {u.lastName}</div>
                  <div className="text-[10px] text-[#8A94A6] mt-0.5">{u.email}</div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EDF3FF] text-[#1A6FDB] uppercase">
                      {u.role}
                    </span>
                    {u.customRole && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFF8E6] text-[#B45309] uppercase">
                        {u.customRole.name}
                      </span>
                    )}
                    {u._count.userPermissions > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FEF0F0] text-[#C62828] uppercase">
                        {u._count.userPermissions} Override(s)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overrides manager */}
          <div className="lg:col-span-2 p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-5">
            <div className="border-b border-[#E3E5E8] pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">
                {selectedUser ? `Access Policies: ${selectedUser.firstName} ${selectedUser.lastName}` : 'Direct Overrides'}
              </h3>
              {selectedUser && (
                <button
                  onClick={handleSaveUserPermissions}
                  className="h-8 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="h-3.5 w-3.5" /> Save Overrides
                </button>
              )}
            </div>

            {!selectedUser ? (
              <div className="text-center py-16 text-xs text-[#8A94A6]">
                Select a staff member from the list to audit and configure custom override rules.
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Custom Role dropdown selector */}
                <div className="p-4 bg-[#F4F6F9] border border-[#E3E5E8] rounded-lg space-y-2">
                  <label htmlFor="customRoleSelect" className="block text-xs font-semibold text-[#4A5568]">
                    Custom Role Group Template
                  </label>
                  <select
                    id="customRoleSelect"
                    value={selectedUserRoleId}
                    onChange={(e) => setSelectedUserRoleId(e.target.value)}
                    className="block w-full max-w-sm h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] transition-all"
                  >
                    <option value="none">No Custom Role Override (Use Standard Default)</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name} Template</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#8A94A6] leading-relaxed">
                    Setting a custom role template assigns all role permissions. You can still explicitly block or allow individual permissions below as user-specific overrides.
                  </p>
                </div>

                {/* Overrides Table */}
                <div className="border border-[#E3E5E8] rounded-md overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[10px] tracking-wider select-none">
                        <th className="p-3 w-1/3">Permission Name</th>
                        <th className="p-3 w-1/2">Description</th>
                        <th className="p-3 pr-4 text-center w-1/4">Override Setting</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
                      {userOverrides.map((o) => (
                        <tr key={o.permissionId} className="hover:bg-[#F7F8FA] transition-all">
                          <td className="p-3 font-semibold text-[#1A6FDB] font-mono text-[11px]">
                            {o.name}
                          </td>
                          <td className="p-3 text-[#4A5568] text-xs">
                            {o.description}
                          </td>
                          <td className="p-3 pr-4 text-center">
                            <div className="inline-flex rounded-md border border-[#C8CDD5] bg-white p-0.5 text-xs select-none">
                              <button
                                type="button"
                                onClick={() => handleOverrideChange(o.permissionId, null)}
                                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                                  o.overrideState === null
                                    ? 'bg-[#EAECF0] text-[#1A1F36]'
                                    : 'text-[#8A94A6] hover:text-[#1A1F36]'
                                }`}
                              >
                                Default
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOverrideChange(o.permissionId, true)}
                                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                                  o.overrideState === true
                                    ? 'bg-[#EDF7ED] text-[#2E7D32]'
                                    : 'text-[#8A94A6] hover:text-[#2E7D32]'
                                }`}
                              >
                                Allow
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOverrideChange(o.permissionId, false)}
                                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                                  o.overrideState === false
                                    ? 'bg-[#FEF0F0] text-[#C62828]'
                                    : 'text-[#8A94A6] hover:text-[#C62828]'
                                }`}
                              >
                                Block
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {!loading && activeTab === 'exams' && (
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
          <div className="border-b border-[#E3E5E8] pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Exam Results Publication Approvals</h3>
              <p className="text-xs text-[#8A94A6] mt-1">Review marks entered by teachers and authorize their official publication.</p>
            </div>
            <button
              onClick={fetchPendingExams}
              className="h-8 w-8 flex items-center justify-center border border-[#E3E5E8] rounded-md text-[#4A5568] hover:bg-[#F4F6F9] transition-colors"
              title="Refresh queue"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {groupedPendingExams.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#8A94A6]">
              All submitted marksheets have been approved. No pending evaluations in queue.
            </div>
          ) : (
            <div className="space-y-4">
              {groupedPendingExams.map((group, idx) => (
                <div key={`${group.examId}-${group.subjectId}`} className="border border-[#E3E5E8] rounded-lg overflow-hidden">
                  
                  {/* Group header */}
                  <div className="p-4 bg-[#F4F6F9] border-b border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#1A1F36]">{group.examName}</div>
                      <div className="text-[10px] text-[#8A94A6] mt-0.5 font-medium uppercase tracking-wider">
                        Subject: {group.subjectName} • {group.count} student scores pending
                      </div>
                    </div>
                    <button
                      onClick={() => handleApproveExams(group.examId, group.subjectId, group.examName, group.subjectName)}
                      className="h-8 px-4 rounded-md bg-[#2E7D32] hover:bg-[#2563EB] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors w-fit shadow-sm border-none"
                    >
                      <CheckCircle className="h-4.5 w-4.5" /> Approve & Publish Marksheet
                    </button>
                  </div>

                  {/* Group details list */}
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E3E5E8] text-[#8A94A6] font-semibold text-[10px] tracking-wider select-none bg-white">
                        <th className="p-3 pl-5">Student Name</th>
                        <th className="p-3 text-center">Marks Obtained</th>
                        <th className="p-3 text-center">Max Marks</th>
                        <th className="p-3 pr-5 text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E5E8] bg-white text-[#1A1F36]">
                      {group.items.map((item) => {
                        const marks = parseFloat(item.marksObtained);
                        const max = parseFloat(item.maxMarks);
                        const pct = max > 0 ? (marks / max) * 100 : 0;
                        return (
                          <tr key={item.id} className="hover:bg-[#F7F8FA]">
                            <td className="p-3 pl-5 font-semibold text-[#1A1F36]">
                              {item.student.user.firstName} {item.student.user.lastName}
                            </td>
                            <td className="p-3 text-center font-mono font-medium">
                              {item.marksObtained}
                            </td>
                            <td className="p-3 text-center font-mono text-[#4A5568]">
                              {item.maxMarks}
                            </td>
                            <td className="p-3 pr-5 text-right font-mono text-[#4A5568]">
                              {pct.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'logins' && (
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
          <div className="border-b border-[#E3E5E8] pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Device Login Activity Log</h3>
            <button
              onClick={fetchLoginActivities}
              className="h-8 w-8 flex items-center justify-center border border-[#E3E5E8] rounded-md text-[#4A5568] hover:bg-[#F4F6F9] transition-colors"
              title="Refresh logs"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {loginActivities.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#8A94A6]">
              No recent login activities registered.
            </div>
          ) : (
            <div className="border border-[#E3E5E8] rounded-md overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[10px] tracking-wider select-none">
                    <th className="p-3.5 pl-4">Staff Member</th>
                    <th className="p-3.5">Email Address</th>
                    <th className="p-3.5">IP Address</th>
                    <th className="p-3.5 w-1/3">Client Agent (Device)</th>
                    <th className="p-3.5 pr-4 text-right">Login Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
                  {loginActivities.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="p-3.5 pl-4 font-semibold text-[#1A1F36]">
                        {log.user.firstName} {log.user.lastName}
                      </td>
                      <td className="p-3.5 font-medium text-[#4A5568]">{log.user.email}</td>
                      <td className="p-3.5 font-mono text-[#8A94A6]">
                        {log.ipAddress || '0.0.0.0'}
                      </td>
                      <td className="p-3.5 text-[#4A5568] break-all max-w-[200px]" title={log.device || ''}>
                        {log.device || 'Direct Console'}
                      </td>
                      <td className="p-3.5 pr-4 text-right font-medium text-[#8A94A6]">
                        {new Date(log.loginTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'audits' && (
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
          <div className="border-b border-[#E3E5E8] pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider">Administrative Audit Ledger Trail</h3>
            <button
              onClick={fetchAuditLogs}
              className="h-8 w-8 flex items-center justify-center border border-[#E3E5E8] rounded-md text-[#4A5568] hover:bg-[#F4F6F9] transition-colors"
              title="Refresh ledger"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {auditLogs.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#8A94A6]">
              No audit logs captured in the current administrative period.
            </div>
          ) : (
            <div className="border border-[#E3E5E8] rounded-md overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[10px] tracking-wider select-none">
                    <th className="p-3.5 pl-4">Actor</th>
                    <th className="p-3.5">Action Code</th>
                    <th className="p-3.5 w-2/5">Modified Parameters / Details</th>
                    <th className="p-3.5 pr-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="p-3.5 pl-4 font-semibold text-[#1A1F36]">
                        <div>{log.user.firstName} {log.user.lastName}</div>
                        <div className="text-[10px] text-[#8A94A6] font-normal mt-0.5">{log.user.email}</div>
                      </td>
                      <td className="p-3.5 font-bold text-[#1A6FDB]">{log.action}</td>
                      <td className="p-3.5 text-[#4A5568] font-mono text-[10px] break-all leading-normal">
                        {log.details || 'N/A'}
                      </td>
                      <td className="p-3.5 pr-4 text-right font-medium text-[#8A94A6]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
