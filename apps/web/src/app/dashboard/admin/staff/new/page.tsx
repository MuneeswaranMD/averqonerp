'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, UserPlus, AlertCircle } from 'lucide-react';

export default function AddStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'TEACHER', // default
    designation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      const schoolId = userStr ? JSON.parse(userStr).schoolId : '';
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-school-id': schoolId,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess('Staff profile successfully created.');
        setTimeout(() => {
          router.push('/dashboard/admin'); // Or wherever appropriate
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create staff');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin" className="p-2 border border-[#E3E5E8] rounded-md hover:bg-[#F4F6F9] transition-colors">
            <ArrowLeft className="h-4 w-4 text-[#4A5568]" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
              Add New Staff
            </h1>
            <div className="text-xs text-[#8A94A6] mt-1">Create a new staff or teacher profile</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#FEF0F0] border border-[#F5C2C2] rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-[#C62828] shrink-0" />
          <div className="text-sm text-[#C62828] font-medium">{error}</div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-[#EDF7ED] border border-[#C8E6C9] rounded-lg flex items-center gap-3">
          <UserPlus className="h-5 w-5 text-[#2E7D32] shrink-0" />
          <div className="text-sm text-[#2E7D32] font-medium">{success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm">
        <div className="p-6 space-y-8">
          
          {/* Section 1 */}
          <section>
            <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">First Name <span className="text-[#C62828]">*</span></label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="e.g. Aditi" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Last Name <span className="text-[#C62828]">*</span></label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="e.g. Verma" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Email Address <span className="text-[#C62828]">*</span></label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="staff@school.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="+91 9876543210" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-[#4A5568]">Password <span className="text-[#C62828]">*</span></label>
                <input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="Assign an initial password" />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2 mb-4">Role & Designation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">System Role <span className="text-[#C62828]">*</span></label>
                <select required name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white">
                  <option value="TEACHER">Teacher</option>
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="LIBRARIAN">Librarian</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="HR_MANAGER">HR Manager</option>
                </select>
              </div>
              
              {formData.role === 'TEACHER' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4A5568]">Designation <span className="text-[#C62828]">*</span></label>
                  <input required={formData.role === 'TEACHER'} name="designation" value={formData.designation} onChange={handleChange} type="text" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="e.g. Senior Science Teacher" />
                </div>
              )}
            </div>
          </section>

        </div>

        <div className="px-6 py-4 border-t border-[#E3E5E8] bg-[#F7F8FA] rounded-b-lg flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-md text-sm font-semibold text-[#4A5568] hover:bg-[#EAECF0] transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm">
            {loading ? (
              <span className="h-4 w-4 border-2 border-t-white border-[#1A6FDB] rounded-full animate-spin"></span>
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create Staff Profile
          </button>
        </div>
      </form>
    </div>
  );
}
