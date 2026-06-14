'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, School, Mail, KeyRound, User, AlertCircle, CheckCircle, Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState('');
  const [domain, setDomain] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/register-school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolName,
          domain,
          adminEmail,
          adminPassword,
          adminFirstName,
          adminLastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Onboarding failed. Please try again.');
      }

      setSuccess(`School "${schoolName}" successfully onboarded!`);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSchoolName('');
      setDomain('');
      setAdminEmail('');
      setAdminPassword('');
      setAdminFirstName('');
      setAdminLastName('');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to establish connection to the auth API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1A1F36] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl my-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[#4A5568] hover:text-[#1A1F36] transition-colors mb-6 text-xs font-medium">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        {/* Card */}
        <div className="border border-[#E3E5E8] bg-white p-8 rounded-lg shadow-none">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-10 w-10 rounded-lg bg-[#1A6FDB] flex items-center justify-center mb-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1F36]">Onboard Your School</h2>
            <p className="text-[#8A94A6] text-xs mt-1 font-light">Create a dedicated ERP workspace for your campus</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 1: School Identity */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#1A6FDB] uppercase tracking-wider border-b border-[#E3E5E8] pb-1">1. School Information</h3>
                
                {/* School Name */}
                <div className="space-y-1.5">
                  <label htmlFor="schoolName" className="block text-xs font-semibold text-[#4A5568]">
                    School Name
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    required
                    placeholder="e.g. Green Valley Academy"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                  />
                </div>

                {/* Subdomain */}
                <div className="space-y-1.5">
                  <label htmlFor="domain" className="block text-xs font-semibold text-[#4A5568]">
                    Workspace Domain
                  </label>
                  <input
                    type="text"
                    id="domain"
                    required
                    placeholder="e.g. greenvalley.averqonerp.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                  />
                </div>
              </div>

              {/* Section 2: Admin credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#1A6FDB] uppercase tracking-wider border-b border-[#E3E5E8] pb-1">2. Super Admin Account</h3>
                
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="adminFirstName" className="block text-xs font-semibold text-[#4A5568]">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="adminFirstName"
                      required
                      placeholder="John"
                      value={adminFirstName}
                      onChange={(e) => setAdminFirstName(e.target.value)}
                      className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="adminLastName" className="block text-xs font-semibold text-[#4A5568]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="adminLastName"
                      required
                      placeholder="Doe"
                      value={adminLastName}
                      onChange={(e) => setAdminLastName(e.target.value)}
                      className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                    />
                  </div>
                </div>

                {/* Admin Email */}
                <div className="space-y-1.5">
                  <label htmlFor="adminEmail" className="block text-xs font-semibold text-[#4A5568]">
                    Super Admin Email
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    required
                    placeholder="admin@school.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                  />
                </div>

                {/* Admin Password */}
                <div className="space-y-1.5">
                  <label htmlFor="adminPassword" className="block text-xs font-semibold text-[#4A5568]">
                    Portal Password
                  </label>
                  <input
                    type="password"
                    id="adminPassword"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="p-3 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 border-none font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-[#EDF7ED] text-[#2E7D32] text-xs flex items-start gap-1.5 border-none font-medium">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {loading ? 'Configuring ERP Environment...' : 'Initialize School & Owner Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E3E5E8] text-center text-xs text-[#8A94A6] font-light">
            Already have a school workspace?{' '}
            <Link href="/login" className="text-[#1A6FDB] hover:text-[#1558B0] font-medium transition-colors">
              Sign in to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
