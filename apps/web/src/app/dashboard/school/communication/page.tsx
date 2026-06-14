'use client';

import { useState, useEffect } from 'react';
import { 
  Megaphone, MessageSquare, FileText, Send, 
  Search, Filter, Plus, Bell, Smartphone, 
  Mail, Calendar, Clock, User, Users
} from 'lucide-react';

// --- MOCK DATA LAYER ---
// This layer is designed to be easily swapped with real API calls later.

type CommType = 'ANNOUNCEMENT' | 'MESSAGE' | 'CIRCULAR';
type ChannelType = 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';

interface Communication {
  id: string;
  type: CommType;
  title: string;
  preview: string;
  sender: string;
  date: string;
  channels: ChannelType[];
  targetAudience: string;
  status: 'SENT' | 'DRAFT' | 'SCHEDULED';
}

const MOCK_DATA: Communication[] = [
  {
    id: '1',
    type: 'ANNOUNCEMENT',
    title: 'School Closed for Winter Break',
    preview: 'Please note that the school will remain closed from Dec 24th to Jan 2nd...',
    sender: 'Principal Office',
    date: '2026-12-20T10:00:00Z',
    channels: ['IN_APP', 'EMAIL', 'PUSH'],
    targetAudience: 'All Parents & Staff',
    status: 'SENT',
  },
  {
    id: '2',
    type: 'CIRCULAR',
    title: 'Revised Examination Guidelines',
    preview: 'The examination committee has updated the guidelines for the upcoming finals...',
    sender: 'Examination Board',
    date: '2026-11-15T09:30:00Z',
    channels: ['IN_APP', 'EMAIL'],
    targetAudience: 'Grade 10-12 Students',
    status: 'SENT',
  },
  {
    id: '3',
    type: 'MESSAGE',
    title: 'Urgent: Bus Route 4 Delay',
    preview: 'Bus route 4 is experiencing a 15-minute delay due to heavy traffic on Main St...',
    sender: 'Transport Admin',
    date: '2026-06-14T08:15:00Z',
    channels: ['SMS', 'WHATSAPP', 'PUSH'],
    targetAudience: 'Route 4 Parents',
    status: 'SENT',
  },
];

export default function CommunicationHubPage() {
  const [activeTab, setActiveTab] = useState<CommType>('ANNOUNCEMENT');
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Future-proofing: Store user/tenant info
  const [schoolId, setSchoolId] = useState<string>('');

  useEffect(() => {
    // Simulate API Fetch
    const fetchCommunications = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setSchoolId(JSON.parse(userStr).schoolId);
        }
        
        // Mock network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setCommunications(MOCK_DATA);
      } catch (err) {
        console.error('Failed to load communications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, []);

  const filteredItems = communications.filter(c => 
    c.type === activeTab &&
    (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.preview.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getChannelIcon = (channel: ChannelType) => {
    switch(channel) {
      case 'EMAIL': return <Mail className="h-3 w-3" />;
      case 'SMS': return <Smartphone className="h-3 w-3" />;
      case 'WHATSAPP': return <MessageSquare className="h-3 w-3" />;
      case 'PUSH': return <Bell className="h-3 w-3" />;
      case 'IN_APP': return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#1A6FDB]" />
            Communication Hub
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Manage school-wide announcements, messages, and circulars</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
            <Send className="h-3.5 w-3.5" /> Compose New
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
        {/* Tabs & Search Toolbar */}
        <div className="border-b border-[#E3E5E8] bg-[#F7F8FA] flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 gap-4">
          <div className="flex items-center">
            <button 
              onClick={() => setActiveTab('ANNOUNCEMENT')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ANNOUNCEMENT' ? 'border-[#1A6FDB] text-[#1A6FDB]' : 'border-transparent text-[#4A5568] hover:text-[#1A1F36]'}`}
            >
              <Megaphone className="h-4 w-4" /> Announcements
            </button>
            <button 
              onClick={() => setActiveTab('MESSAGE')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'MESSAGE' ? 'border-[#1A6FDB] text-[#1A6FDB]' : 'border-transparent text-[#4A5568] hover:text-[#1A1F36]'}`}
            >
              <MessageSquare className="h-4 w-4" /> Direct Messages
            </button>
            <button 
              onClick={() => setActiveTab('CIRCULAR')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'CIRCULAR' ? 'border-[#1A6FDB] text-[#1A6FDB]' : 'border-transparent text-[#4A5568] hover:text-[#1A1F36]'}`}
            >
              <FileText className="h-4 w-4" /> Circulars
            </button>
          </div>

          <div className="flex items-center gap-3 pb-3 sm:pb-0 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]" />
              <input 
                type="text"
                placeholder="Search communications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
              />
            </div>
            <button className="h-8 w-8 flex items-center justify-center rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] hover:bg-[#F4F6F9] transition-colors shrink-0">
              <Filter className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-[#8A94A6]">
               <div className="h-6 w-6 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
               <span className="text-xs font-medium">Loading records...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#8A94A6] space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#F4F6F9] flex items-center justify-center border border-[#E3E5E8]">
                {activeTab === 'ANNOUNCEMENT' && <Megaphone className="h-5 w-5 text-[#8A94A6]" />}
                {activeTab === 'MESSAGE' && <MessageSquare className="h-5 w-5 text-[#8A94A6]" />}
                {activeTab === 'CIRCULAR' && <FileText className="h-5 w-5 text-[#8A94A6]" />}
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-[#1A1F36]">No {activeTab.toLowerCase()}s found</h3>
                <p className="text-xs mt-1">You haven't sent any {activeTab.toLowerCase()}s yet.</p>
              </div>
              <button className="mt-2 text-xs font-semibold text-[#1A6FDB] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Create First {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map(item => (
                <div key={item.id} className="p-4 border border-[#E3E5E8] rounded-md hover:border-[#1A6FDB]/40 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-[#1A1F36] group-hover:text-[#1A6FDB] transition-colors">{item.title}</h4>
                    <span className="text-[10px] text-[#8A94A6] flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A5568] mb-4 line-clamp-2 leading-relaxed">
                    {item.preview}
                  </p>
                  <div className="flex items-center justify-between border-t border-[#E3E5E8] pt-3">
                    <div className="flex items-center gap-4 text-[11px] text-[#8A94A6]">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> By: {item.sender}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> To: {item.targetAudience}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.channels.map(ch => (
                        <div key={ch} className="h-6 w-6 rounded-full bg-[#F4F6F9] border border-[#E3E5E8] flex items-center justify-center text-[#4A5568]" title={ch}>
                          {getChannelIcon(ch)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
