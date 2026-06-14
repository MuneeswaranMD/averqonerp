import Link from 'next/link';
import { Shield, BookOpen, CreditCard, Users, GraduationCap, ArrowRight, Zap, HelpCircle } from 'lucide-react';

const roles = [
  {
    name: 'Super Admin',
    desc: 'Configure multi-tenancy, manage system logs, and view campus metrics.',
    icon: Shield,
    textColor: 'text-[#1A6FDB]',
    bg: 'bg-[#EDF3FF]',
  },
  {
    name: 'Staff / Teacher',
    desc: 'Record classroom roll-call, grade coursework, and upload study material.',
    icon: BookOpen,
    textColor: 'text-[#2E7D32]',
    bg: 'bg-[#EDF7ED]',
  },
  {
    name: 'Accountant',
    desc: 'Manage fee invoice ledgers, expenses, and track collection summaries.',
    icon: CreditCard,
    textColor: 'text-[#B45309]',
    bg: 'bg-[#FFF8E6]',
  },
  {
    name: 'Parent Portal',
    desc: 'Verify fee balances, attendance calendars, and real-time announcements.',
    icon: Users,
    textColor: 'text-[#C62828]',
    bg: 'bg-[#FEF0F0]',
  },
  {
    name: 'Student Portal',
    desc: 'Submit assignments, download files, and view term exam marks.',
    icon: GraduationCap,
    textColor: 'text-[#1A6FDB]',
    bg: 'bg-[#EDF3FF]',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1A1F36] flex flex-col font-sans">
      {/* Header (Top Bar) */}
      <header className="h-14 bg-white border-b border-[#E3E5E8] flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#1A6FDB] flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1A1F36]">
            averqon<span className="text-[#1A6FDB] font-medium">erp</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-[#4A5568] hover:text-[#1A1F36] transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-medium text-xs flex items-center justify-center transition-colors">
            Register School
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 py-16 max-w-5xl flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF3FF] text-[#1A6FDB] text-xs font-semibold uppercase tracking-wider mb-6">
          Multi-Tenant Infrastructure
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1A1F36] mb-4 max-w-3xl leading-snug">
          The Clean, Simple way to manage your Campus.
        </h1>

        <p className="text-base text-[#4A5568] max-w-xl mb-10 font-normal leading-relaxed">
          A minimalist school ERP connecting administrators, instructors, accounts managers, parent guardians, and students under a secure workspace.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
          <Link
            href="/login"
            className="h-10 px-6 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            Launch System Demo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admission"
            className="h-10 px-6 rounded-md border border-[#E3E5E8] bg-white hover:bg-[#F4F6F9] text-[#4A5568] font-medium text-sm flex items-center justify-center transition-colors"
          >
            Submit Admission Form
          </Link>
        </div>

        {/* Roles Segment */}
        <div className="w-full">
          <h2 className="text-lg font-semibold text-[#1A1F36] mb-8 text-left border-b border-[#E3E5E8] pb-2">
            Integrated Workspace Modules
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.name}
                  className="p-5 rounded-lg border border-[#E3E5E8] bg-white text-left flex flex-col justify-between hover:border-[#C8CDD5] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all"
                >
                  <div>
                    <div className={`h-10 w-10 rounded-md ${role.bg} ${role.textColor} flex items-center justify-center mb-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A1F36] mb-1.5">
                      {role.name}
                    </h3>
                    <p className="text-xs text-[#4A5568] leading-relaxed font-normal">
                      {role.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-[#E3E5E8] flex items-center justify-center text-xs text-[#8A94A6] bg-white">
        &copy; {new Date().getFullYear()} averqonerp. Flat minimalist school infrastructure.
      </footer>
    </div>
  );
}
