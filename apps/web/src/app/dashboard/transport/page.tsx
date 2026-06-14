'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bus, MapPin, Users, AlertTriangle, Activity, BarChart3,
  Settings, UserCheck, GraduationCap, CheckCircle, Clock,
  TrendingUp, Shield, Wrench, Phone
} from 'lucide-react';

const vehiclesList = [
  { reg: 'TN-07-AL-4920', route: 'Route A — North Chennai', driver: 'Rajan Kumar', students: 28, status: 'ON_ROUTE' },
  { reg: 'TN-07-BK-1234', route: 'Route B — East Zone', driver: 'Murugan S.', students: 24, status: 'STANDBY' },
  { reg: 'TN-07-CX-5678', route: 'Route C — South Campus', driver: 'Senthil R.', students: 32, status: 'ON_ROUTE' },
  { reg: 'TN-07-DL-9012', route: 'Route D — West District', driver: 'Anand P.', students: 21, status: 'MAINTENANCE' },
];

const alertsList = [
  { message: 'Route A bus delayed by 12 minutes', level: 'warning', time: '10 min ago' },
  { message: 'Vehicle TN-07-DL-9012 maintenance due', level: 'error', time: '1 hr ago' },
  { message: 'Route C completed morning pickup', level: 'success', time: '2 hrs ago' },
];

export default function TransportManagerDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return null;

  const kpiCards = [
    { label: 'Total Vehicles', value: '12', sub: '1 in maintenance', color: 'text-[#1A1F36]', iconBg: 'bg-[#EDF3FF]', iconColor: 'text-[#1A6FDB]', icon: Bus },
    { label: 'Active Routes', value: '8', sub: '3 on the road now', color: 'text-[#2E7D32]', iconBg: 'bg-[#EDF7ED]', iconColor: 'text-[#2E7D32]', icon: MapPin },
    { label: 'Total Drivers', value: '14', sub: '12 active today', color: 'text-[#1A1F36]', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]', icon: UserCheck },
    { label: 'Students Enrolled', value: '248', sub: 'In transport', color: 'text-[#1A6FDB]', iconBg: 'bg-[#EDF3FF]', iconColor: 'text-[#1A6FDB]', icon: GraduationCap },
    { label: 'Active Alerts', value: '2', sub: '1 critical, 1 warning', color: 'text-[#C62828]', iconBg: 'bg-[#FEF0F0]', iconColor: 'text-[#C62828]', icon: AlertTriangle },
    { label: 'Fuel Cost (MTD)', value: '₹42K', sub: 'Budget: ₹50K', color: 'text-[#B45309]', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]', icon: Activity },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Transport Management Dashboard</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">averqonerp › Transport Module</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#FFF8E6] text-[#B45309] text-xs font-semibold uppercase tracking-wider">
          Transport Manager
        </span>
      </div>

      {/* Alert Banner */}
      <div className="p-4 bg-[#FEF8F8] border border-[#F5C2C2] rounded-lg flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-[#C62828] shrink-0" />
        <div className="text-xs text-[#C62828] font-medium">
          Route A bus is delayed — 12 minutes behind schedule · Vehicle TN-07-DL-9012 maintenance due today
        </div>
        <Link href="/dashboard/transport/alerts" className="ml-auto text-xs text-[#1A6FDB] font-semibold hover:underline shrink-0">
          View Alerts →
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-4 border border-[#E3E5E8] bg-white rounded-lg flex flex-col gap-2.5 hover:border-[#C8CDD5] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-wider leading-tight">{card.label}</span>
                <div className={`h-7 w-7 rounded-md ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
              <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-[10px] text-[#8A94A6]">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-5">

          {/* Vehicle Fleet Status */}
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider flex items-center gap-1.5">
                <Bus className="h-3.5 w-3.5" /> Fleet Status
              </span>
              <Link href="/dashboard/transport/vehicles" className="text-[11px] text-[#1A6FDB] font-medium hover:underline">Manage vehicles</Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E3E5E8] bg-[#F4F6F9]">
                  <th className="p-3 pl-4 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Vehicle</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Route</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Driver</th>
                  <th className="p-3 text-left text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Students</th>
                  <th className="p-3 pr-4 text-right text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E8]">
                {vehiclesList.map((v) => (
                  <tr key={v.reg} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="p-3 pl-4 font-mono font-semibold text-[#1A1F36]">{v.reg}</td>
                    <td className="p-3 text-[#4A5568]">{v.route}</td>
                    <td className="p-3 text-[#4A5568]">{v.driver}</td>
                    <td className="p-3 text-[#4A5568] font-semibold">{v.students}</td>
                    <td className="p-3 pr-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'ON_ROUTE' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                        v.status === 'MAINTENANCE' ? 'bg-[#FEF0F0] text-[#C62828]' :
                        'bg-[#F4F6F9] text-[#4A5568]'
                      }`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Module Access */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Transport Modules</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Vehicles', href: '/dashboard/transport/vehicles', icon: Bus, color: 'text-[#1A6FDB]', bg: 'bg-[#EDF3FF]', desc: 'Fleet management' },
                { label: 'Routes', href: '/dashboard/transport', icon: MapPin, color: 'text-[#2E7D32]', bg: 'bg-[#EDF7ED]', desc: 'Route planning' },
                { label: 'Drivers', href: '/dashboard/transport/drivers', icon: UserCheck, color: 'text-[#B45309]', bg: 'bg-[#FFF8E6]', desc: 'Driver roster' },
                { label: 'Live Tracking', href: '/dashboard/transport/tracking', icon: Activity, color: 'text-[#7C3AED]', bg: 'bg-[#F3EEFF]', desc: 'GPS monitor' },
                { label: 'Students', href: '/dashboard/transport/students', icon: GraduationCap, color: 'text-[#0891B2]', bg: 'bg-[#EFF8FB]', desc: 'Enrolled students' },
                { label: 'Alerts', href: '/dashboard/transport/alerts', icon: AlertTriangle, color: 'text-[#C62828]', bg: 'bg-[#FEF0F0]', desc: 'Active alerts' },
                { label: 'Reports', href: '/dashboard/transport/reports', icon: BarChart3, color: 'text-[#4A5568]', bg: 'bg-[#F4F6F9]', desc: 'Analytics' },
                { label: 'Settings', href: '/dashboard/settings/access-control', icon: Settings, color: 'text-[#4A5568]', bg: 'bg-[#F4F6F9]', desc: 'Configuration' },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.label}
                    href={m.href}
                    className="p-3.5 border border-[#E3E5E8] hover:border-[#1A6FDB] rounded-lg transition-all space-y-2 block hover:bg-[#F7F9FD] group"
                  >
                    <div className={`h-7 w-7 rounded-md ${m.bg} flex items-center justify-center`}>
                      <Icon className={`h-3.5 w-3.5 ${m.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1A1F36] group-hover:text-[#1A6FDB] transition-colors">{m.label}</div>
                      <div className="text-[10px] text-[#8A94A6]">{m.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Panel */}
        <div className="space-y-5">

          {/* Alerts */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Active Alerts
            </h3>
            <div className="space-y-2">
              {alertsList.map((alert) => (
                <div key={alert.message} className={`p-3 rounded-md border text-xs ${
                  alert.level === 'error' ? 'border-[#F5C2C2] bg-[#FEF8F8]' :
                  alert.level === 'warning' ? 'border-[#F5E6C0] bg-[#FFFDF0]' :
                  'border-[#C6E6CB] bg-[#EDF7ED]'
                }`}>
                  <div className={`font-semibold ${
                    alert.level === 'error' ? 'text-[#C62828]' :
                    alert.level === 'warning' ? 'text-[#B45309]' :
                    'text-[#2E7D32]'
                  }`}>{alert.message}</div>
                  <div className="text-[10px] text-[#8A94A6] mt-0.5">{alert.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Availability */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2">Driver Status</h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Rajan Kumar', route: 'Route A', status: 'ON_DUTY', phone: '98401 23456' },
                { name: 'Murugan S.', route: 'Route B', status: 'STANDBY', phone: '98402 34567' },
                { name: 'Senthil R.', route: 'Route C', status: 'ON_DUTY', phone: '98403 45678' },
                { name: 'Anand P.', route: 'Route D', status: 'LEAVE', phone: '98404 56789' },
              ].map((driver) => (
                <div key={driver.name} className="flex items-center justify-between py-1.5 border-b border-[#E3E5E8] last:border-0">
                  <div>
                    <div className="font-semibold text-[#1A1F36]">{driver.name}</div>
                    <div className="text-[10px] text-[#8A94A6]">{driver.route}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    driver.status === 'ON_DUTY' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                    driver.status === 'LEAVE' ? 'bg-[#FEF0F0] text-[#C62828]' :
                    'bg-[#F4F6F9] text-[#4A5568]'
                  }`}>
                    {driver.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Route Progress */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Route Coverage
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { route: 'Route A', pct: 65 },
                { route: 'Route B', pct: 0 },
                { route: 'Route C', pct: 100 },
              ].map((r) => (
                <div key={r.route} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A5568]">{r.route}</span>
                    <span className={`font-bold ${r.pct === 100 ? 'text-[#2E7D32]' : r.pct > 0 ? 'text-[#1A6FDB]' : 'text-[#8A94A6]'}`}>{r.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#E3E5E8] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${r.pct === 100 ? 'bg-[#2E7D32]' : r.pct > 0 ? 'bg-[#1A6FDB]' : 'bg-[#E3E5E8]'}`}
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
