'use client';

import { useEffect, useState } from 'react';
import { Bus as BusIcon, AlertTriangle, ShieldAlert, CheckCircle, Navigation, MapPin, Users, Phone } from 'lucide-react';

interface StudentPassenger {
  id: string;
  name: string;
  grade: string;
  stopName: string;
  parentContact: string;
  status: 'PENDING' | 'BOARDED' | 'ABSENT';
}

const mockPassengers: StudentPassenger[] = [
  { id: '1', name: 'Rahul Sharma', grade: 'Grade 10', stopName: 'North Chennai Square', parentContact: '9840123456', status: 'PENDING' },
  { id: '2', name: 'Priya Patel', grade: 'Grade 8', stopName: 'Central Library Plaza', parentContact: '9840234567', status: 'PENDING' },
  { id: '3', name: 'Arjun Das', grade: 'Grade 10', stopName: 'Campus West Gate', parentContact: '9840345678', status: 'PENDING' },
];

export default function DriverDashboard() {
  const [user, setUser] = useState<any>(null);
  
  // Trip states
  const [tripActive, setTripActive] = useState(false);
  const [passengers, setPassengers] = useState<StudentPassenger[]>(mockPassengers);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [emergencyActive, setEmergencyActive] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleStartStopTrip = () => {
    setTripActive(prev => !prev);
    setAlertSuccess(tripActive ? 'Trip ended successfully.' : 'Trip started! GPS coordinates are transmitting.');
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const handleBoarding = (id: string, status: 'BOARDED' | 'ABSENT' | 'PENDING') => {
    setPassengers(prev =>
      prev.map(p => p.id === id ? { ...p, status } : p)
    );
  };

  const handleEmergency = () => {
    setEmergencyActive(prev => !prev);
    setAlertSuccess(emergencyActive ? 'Emergency alert deactivated.' : 'EMERGENCY BROADCAST TRANSMITTED! Campus control notified.');
    setTimeout(() => setAlertSuccess(null), 4000);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Driver Transit Workspace</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">
            averqonerp &gt; Driver Transit Portal
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF0F0] text-[#C62828] text-xs font-semibold uppercase tracking-wider">
          Driver View
        </div>
      </div>

      {alertSuccess && (
        <div className={`p-3 rounded-md text-xs flex items-start gap-1.5 font-medium border-none ${
          emergencyActive || alertSuccess.includes('ended')
            ? 'bg-[#FEF0F0] text-[#C62828]'
            : 'bg-[#EDF7ED] text-[#2E7D32]'
        }`}>
          {emergencyActive ? <ShieldAlert className="h-4 w-4 shrink-0" /> : <CheckCircle className="h-4 w-4 shrink-0" />}
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Transit Controls & Route summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transit Actions */}
        <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="h-4.5 w-4.5 text-[#1A6FDB]" /> Transit Control
          </h3>

          <div className="space-y-3">
            <button
              onClick={handleStartStopTrip}
              className={`w-full h-10 px-4 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border ${
                tripActive 
                  ? 'bg-[#FEF0F0] text-[#C62828] border-[#C62828] hover:bg-red-50'
                  : 'bg-[#EDF7ED] text-[#2E7D32] border-[#2E7D32] hover:bg-green-50'
              }`}
            >
              <BusIcon className="h-4 w-4" /> {tripActive ? 'Stop Journey Trip' : 'Start Journey Trip'}
            </button>

            <button
              onClick={handleEmergency}
              className={`w-full h-10 px-4 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border ${
                emergencyActive 
                  ? 'bg-[#C62828] text-white border-[#C62828]'
                  : 'bg-white text-[#C62828] border-[#E3E5E8] hover:bg-[#FEF0F0]'
              }`}
            >
              <AlertTriangle className="h-4 w-4" /> {emergencyActive ? 'Deactivate Emergency Alert' : 'Trigger EMERGENCY Alert'}
            </button>
          </div>

          <div className="p-3 border border-[#E3E5E8] bg-[#F4F6F9] rounded-md text-xs text-[#4A5568] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8A94A6]">GPS Status:</span>
              <span className={`font-semibold ${tripActive ? 'text-[#2E7D32]' : 'text-[#8A94A6]'}`}>
                {tripActive ? '● Transmitting' : '○ Standby'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A94A6]">Assigned Vehicle:</span>
              <span className="font-semibold text-[#1A1F36]">TN-07-AL-4920</span>
            </div>
          </div>
        </div>

        {/* Route stop details */}
        <div className="lg:col-span-2 p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-2 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-4.5 w-4.5 text-[#1A6FDB]" /> Active Route Schedule
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#8A94A6]">Route Name</span>
              <div className="font-semibold text-[#1A1F36] mt-0.5">Route A - North Chennai</div>
            </div>
            <div>
              <span className="text-[#8A94A6]">Start Point</span>
              <div className="font-semibold text-[#1A1F36] mt-0.5">North Chennai Square</div>
            </div>
            <div>
              <span className="text-[#8A94A6]">Destination</span>
              <div className="font-semibold text-[#1A1F36] mt-0.5">Campus Main Gate</div>
            </div>
            <div>
              <span className="text-[#8A94A6]">Stops Total</span>
              <div className="font-semibold text-[#1A1F36] mt-0.5">3 Stations</div>
            </div>
          </div>
        </div>

      </div>

      {/* Student Passenger Checklist */}
      <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] font-semibold text-[#1A1F36] text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#8A94A6]" /> Student Passenger Intake Roll-Call</span>
          <span className="text-[10px] text-[#8A94A6] uppercase font-mono">Trip: {tripActive ? 'In Progress' : 'Idle'}</span>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[11px] tracking-wider select-none">
              <th className="p-3.5 pl-4">Student Name</th>
              <th className="p-3.5">Grade</th>
              <th className="p-3.5">Intake Stop</th>
              <th className="p-3.5">Parent Contact</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 pr-4 text-right">Intake Boarding Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
            {passengers.map((passenger) => (
              <tr key={passenger.id} className="hover:bg-[#F7F8FA] transition-colors">
                <td className="p-3.5 pl-4 font-semibold text-[#1A1F36]">{passenger.name}</td>
                <td className="p-3.5 text-[#4A5568]">{passenger.grade}</td>
                <td className="p-3.5 font-medium text-[#4A5568]">{passenger.stopName}</td>
                <td className="p-3.5 text-[#1A6FDB] font-mono flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" /> {passenger.parentContact}
                </td>
                <td className="p-3.5">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                    passenger.status === 'PENDING' ? 'bg-[#FFF8E6] text-[#B45309]' :
                    passenger.status === 'BOARDED' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                    'bg-[#FEF0F0] text-[#C62828]'
                  }`}>
                    {passenger.status}
                  </span>
                </td>
                <td className="p-3.5 pr-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleBoarding(passenger.id, 'BOARDED')}
                      className={`h-7 px-3 rounded text-[11px] font-semibold border transition-all ${
                        passenger.status === 'BOARDED'
                          ? 'bg-[#EDF7ED] text-[#2E7D32] border-[#2E7D32]/40 shadow-none'
                          : 'border-[#E3E5E8] bg-white text-[#8A94A6] hover:text-[#4A5568]'
                      }`}
                    >
                      Boarded
                    </button>
                    <button
                      onClick={() => handleBoarding(passenger.id, 'ABSENT')}
                      className={`h-7 px-3 rounded text-[11px] font-semibold border transition-all ${
                        passenger.status === 'ABSENT'
                          ? 'bg-[#FEF0F0] text-[#C62828] border-[#C62828]/40 shadow-none'
                          : 'border-[#E3E5E8] bg-white text-[#8A94A6] hover:text-[#4A5568]'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
