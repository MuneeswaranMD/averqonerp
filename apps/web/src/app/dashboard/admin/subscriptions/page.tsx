import { Settings } from 'lucide-react';

export default function PlaceholderPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#1A6FDB]" />
            Subscription Management
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Manage billing and active subscription plans for schools.</div>
        </div>
      </div>
      
      <div className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-[#C8CDD5] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#1A1F36]">Module Initialization</h3>
          <p className="text-sm text-[#8A94A6] max-w-sm mx-auto mt-2">
            This module is being connected to the new multi-tenant backend architecture. 
            Full functionality will be available shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
