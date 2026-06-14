'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, CheckCircle, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const loginResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(data.message || 'Authentication failed. Please verify credentials.');
      }

      setSuccess(`Authenticated successfully! Welcome back, ${data.user.email || data.user.id}.`);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => {
        switch (data.user.role) {
          case 'SUPER_ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'SCHOOL_ADMIN':
            router.push('/dashboard/school');
            break;
          case 'TEACHER':
            router.push('/dashboard/teacher');
            break;
          case 'STUDENT':
            router.push('/dashboard/student');
            break;
          case 'PARENT':
            router.push('/dashboard/parent');
            break;
          case 'DRIVER':
            router.push('/dashboard/transport/driver');
            break;
          default:
            router.push('/dashboard');
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Failed to establish connection to the auth API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1A1F36] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[#4A5568] hover:text-[#1A1F36] transition-colors mb-6 text-xs font-medium">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        {/* Card */}
        <div className="border border-[#E3E5E8] bg-white p-7 rounded-lg shadow-none">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden mb-3">
              <img src="/logo.png" alt="Averqon Logo" className="h-full w-full object-contain" />
            </div>
            <h2 className="text-lg font-semibold text-[#1A1F36]">Sign In to Portal</h2>
            <p className="text-[#8A94A6] text-xs mt-1 font-light">Access learning, billing, and reports</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* School Domain */}
            <div className="space-y-1.5">
              <label htmlFor="domain" className="block text-xs font-semibold text-[#4A5568]">
                School Subdomain
              </label>
              <input
                type="text"
                id="domain"
                required
                placeholder="e.g. greenschool.averqonerp.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
              />
            </div>

            {/* Login Identifier */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="block text-xs font-semibold text-[#4A5568]">
                Login ID / Email / Phone / Admission No
              </label>
              <input
                type="text"
                id="identifier"
                required
                placeholder="Enter email, phone, admission number, or ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-[#4A5568]">
                  Password
                </label>
                <a href="#" className="text-xs text-[#1A6FDB] hover:text-[#1558B0] transition-colors">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-sm text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
              />
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
              className="w-full h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-medium text-xs flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Verifying Session...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E3E5E8] text-center text-xs text-[#8A94A6] font-light">
            Don't have a workspace?{' '}
            <Link href="/register" className="text-[#1A6FDB] hover:text-[#1558B0] font-medium transition-colors">
              Onboard your school
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
