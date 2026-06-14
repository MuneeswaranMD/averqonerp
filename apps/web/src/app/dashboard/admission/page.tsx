'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, AlertCircle, CheckCircle, Shield } from 'lucide-react';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gradeRequested: string;
  parentContact: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
}

export default function AdminAdmissionPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        throw new Error('Unauthorized session. Please login.');
      }
      
      const user = JSON.parse(userStr);

      const res = await fetch('http://localhost:3001/api/v1/admission/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to retrieve applications.');
      }

      setApps(data);
    } catch (err: any) {
      setError(err.message || 'Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`http://localhost:3001/api/v1/admission/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Action failed.');
      }

      if (status === 'APPROVED') {
        setSuccess(`Application approved! Student account created under email: ${data.user.email} (Default Password: ${data.user.defaultPassword})`);
      } else {
        setSuccess('Application rejected successfully.');
      }
      
      fetchApplications();
    } catch (err: any) {
      setError(err.message || 'Failed to update application status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Admissions Intake Queue</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">
            averqonerp &gt; Admissions Queue
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EDF3FF] text-[#1A6FDB] text-xs font-semibold uppercase tracking-wider">
          <Shield className="h-3.5 w-3.5" /> Super Admin View
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 border-none font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-md bg-[#EDF7ED] text-[#2E7D32] text-xs flex items-start gap-1.5 border-none font-medium">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span className="leading-relaxed">{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8A94A6]">
          <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
          <span className="text-xs font-medium">Retrieving student intakes...</span>
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#E3E5E8] bg-white rounded-lg text-[#8A94A6] font-normal text-xs">
          No admission applications found in this workspace.
        </div>
      ) : (
        <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[11px] tracking-wider select-none">
                <th className="p-3.5 pl-4">Student Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Grade</th>
                <th className="p-3.5">Parent Contact</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
              {apps.map((app) => (
                <tr key={app.id} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="p-3.5 pl-4 font-semibold text-[#1A1F36]">{app.firstName} {app.lastName}</td>
                  <td className="p-3.5 text-[#4A5568]">{app.email}</td>
                  <td className="p-3.5 font-medium text-[#4A5568]">Grade {app.gradeRequested}</td>
                  <td className="p-3.5 text-[#4A5568] font-mono">{app.parentContact}</td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      app.status === 'PENDING' ? 'bg-[#FFF8E6] text-[#B45309]' :
                      app.status === 'APPROVED' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                      'bg-[#FEF0F0] text-[#C62828]'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    {app.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(app.id, 'APPROVED')}
                          className="h-7 w-7 rounded border border-[#E3E5E8] bg-white text-[#2E7D32] hover:bg-[#EDF7ED] transition-colors flex items-center justify-center"
                          title="Approve & Create Student Account"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'REJECTED')}
                          className="h-7 w-7 rounded border border-[#E3E5E8] bg-white text-[#C62828] hover:bg-[#FEF0F0] transition-colors flex items-center justify-center"
                          title="Reject Application"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
