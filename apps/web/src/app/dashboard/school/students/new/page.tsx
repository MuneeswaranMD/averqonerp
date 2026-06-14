'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, UserPlus, AlertCircle } from 'lucide-react';

export default function AddStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch classes and sections from the server
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [sections, setSections] = useState<Array<{ id: string; name: string; classId: string }>>([]);;
  const [fetchError, setFetchError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      setFetchError('Session not initialized');
      return;
    }

    const user = JSON.parse(userStr);

    const fetchData = async () => {
      try {
        const [classRes, secRes] = await Promise.all([
          fetch('http://localhost:3001/api/v1/classes', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'x-school-id': user.schoolId
            }
          }),
          fetch('http://localhost:3001/api/v1/sections', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'x-school-id': user.schoolId
            }
          })
        ]);
        if (!classRes.ok || !secRes.ok) {
          throw new Error('Failed to load reference data');
        }
        const classData = await classRes.json();
        const secData = await secRes.json();
        setClasses(classData);
        setSections(secData);
      } catch (e: any) {
        console.error(e);
        setFetchError(e?.message || 'Error loading classes/sections');
      }
    };
    fetchData();
  }, []);


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    classId: '',
    sectionId: '',
    rollNo: '',
    parentName: '',
    parentContact: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      
      // In a real implementation, classId and sectionId should be actual UUIDs from the DB
      // For this UI mockup, we will pass empty strings if they aren't selected to trigger validation errors,
      // but in reality we need real IDs.

      const res = await fetch('http://localhost:3001/api/v1/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard/school/students');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create student');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset section when class changes
      ...(name === 'classId' ? { sectionId: '' } : {}),
    }));
  };

  // Filter sections by the currently-selected class
  const filteredSections = formData.classId
    ? sections.filter(s => s.classId === formData.classId)
    : sections;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/school/students" className="p-2 border border-[#E3E5E8] rounded-md hover:bg-[#F4F6F9] transition-colors">
            <ArrowLeft className="h-4 w-4 text-[#4A5568]" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
              Enroll New Student
            </h1>
            <div className="text-xs text-[#8A94A6] mt-1">Create a new student profile and generate login credentials</div>
          </div>
        </div>
      </div>

        {error && (
          <div className="p-4 bg-[#FEF0F0] border border-[#F5C2C2] rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-[#C62828] shrink-0" />
            <div className="text-sm text-[#C62828] font-medium">{error}</div>
          </div>
        )}
        {fetchError && (
          <div className="p-4 bg-[#FFF4E5] border border-[#FFCC80] rounded-lg flex items-center gap-3 mt-2">
            <AlertCircle className="h-5 w-5 text-[#E65100] shrink-0" />
            <div className="text-sm text-[#E65100] font-medium">{fetchError}</div>
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
                <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="e.g. Rahul" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Last Name <span className="text-[#C62828]">*</span></label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="e.g. Sharma" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Student Email <span className="text-[#C62828]">*</span></label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="student@school.com" />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2 mb-4">Academic Placement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Class Grade <span className="text-[#C62828]">*</span></label>
                <select required name="classId" value={formData.classId} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white">
                  <option value="">Select Class...</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Section <span className="text-[#C62828]">*</span></label>
                <select required name="sectionId" value={formData.sectionId} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white">
                  <option value="">Select Section...</option>
                  {filteredSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Roll Number (Optional)</label>
                <input name="rollNo" value={formData.rollNo} onChange={handleChange} type="text" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="e.g. 104" />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2 mb-4">Guardian Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Primary Guardian Name <span className="text-[#C62828]">*</span></label>
                <input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="e.g. Ramesh Sharma" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A5568]">Contact Number <span className="text-[#C62828]">*</span></label>
                <input required name="parentContact" value={formData.parentContact} onChange={handleChange} type="tel" className="w-full px-3 py-2 text-sm border border-[#E3E5E8] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-1 focus:ring-[#1A6FDB] transition-all bg-[#F4F6F9] focus:bg-white" placeholder="+91 9876543210" />
              </div>
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
            Enroll Student
          </button>
        </div>
      </form>
    </div>
  );
}
