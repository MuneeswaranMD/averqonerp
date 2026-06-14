'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, BookOpen, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function PublicAdmissionPage() {
  const [schoolId, setSchoolId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gradeRequested, setGradeRequested] = useState('10');
  const [parentContact, setParentContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(false);

    if (!schoolId) {
      setError('Please specify a School ID to submit your application.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/admission/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          gradeRequested,
          parentContact,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Application submission failed.');
      }

      setSuccess(`Application for ${firstName} ${lastName} submitted successfully! Status: PENDING.`);
      setFirstName('');
      setLastName('');
      setEmail('');
      setParentContact('');
    } catch (err: any) {
      setError(err.message || 'Connection failure to the Admission API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1A1F36] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[#4A5568] hover:text-[#1A1F36] transition-colors mb-6 text-xs font-medium">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        <div className="border border-[#E3E5E8] bg-white p-8 rounded-lg shadow-none">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-10 w-10 rounded-lg bg-[#1A6FDB] flex items-center justify-center mb-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1F36]">Digital Admission Form</h2>
            <p className="text-[#8A94A6] text-xs mt-1 font-light">Apply for student intake and track verification status</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* School Workspace ID */}
            <div className="space-y-1.5">
              <label htmlFor="schoolId" className="block text-xs font-semibold text-[#4A5568]">
                Target School ID
              </label>
              <input
                type="text"
                id="schoolId"
                required
                placeholder="Paste the target School UUID here"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
              />
              <p className="text-[10px] text-[#8A94A6] font-light">Admins can obtain their School ID directly from the system logs on their Dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="block text-xs font-semibold text-[#4A5568]">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  placeholder="Student First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="block text-xs font-semibold text-[#4A5568]">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  placeholder="Student Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-[#4A5568]">
                  Student Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="email@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                />
              </div>

              {/* Parent Phone */}
              <div className="space-y-1.5">
                <label htmlFor="parentContact" className="block text-xs font-semibold text-[#4A5568]">
                  Parent Phone
                </label>
                <input
                  type="text"
                  id="parentContact"
                  required
                  placeholder="Contact Number"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                />
              </div>
            </div>

            {/* Grade Requested */}
            <div className="space-y-1.5">
              <label htmlFor="grade" className="block text-xs font-semibold text-[#4A5568]">
                Grade Requested
              </label>
              <select
                id="grade"
                value={gradeRequested}
                onChange={(e) => setGradeRequested(e.target.value)}
                className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
              >
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="5">Grade 5</option>
                <option value="8">Grade 8</option>
                <option value="10">Grade 10</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 border-none font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-[#EDF7ED] text-[#2E7D32] text-xs flex items-start gap-1.5 border-none font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting Application...' : 'Submit Admission Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
