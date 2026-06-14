'use client';

import { useState } from 'react';
import { ClipboardCheck, UploadCloud, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function CreateAssignmentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E5E8] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36] flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-[#1A6FDB]" />
            Create Assignment
          </h1>
          <div className="text-xs text-[#8A94A6] mt-1">Distribute new homework or project tasks to your students</div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/teacher/assignments/review"
            className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            Cancel
          </Link>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-[#EDF7ED] border border-[#C8E6C9] text-[#2E7D32] rounded-md text-xs font-medium flex items-center gap-2">
          <Save className="h-4 w-4" /> Assignment created and published successfully!
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E3E5E8] rounded-lg shadow-sm">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4A5568]">Assignment Title *</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Chapter 4 Math Exercises"
                className="w-full px-3 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4A5568]">Target Class *</label>
              <select 
                required
                className="w-full px-3 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
              >
                <option value="">Select a class...</option>
                <option value="10-A">Class 10-A (Mathematics)</option>
                <option value="9-B">Class 9-B (Physics)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4A5568]">Due Date *</label>
              <input 
                required
                type="date" 
                className="w-full px-3 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#4A5568]">Maximum Marks</label>
              <input 
                type="number" 
                placeholder="100"
                className="w-full px-3 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A5568]">Description & Instructions</label>
            <textarea 
              rows={5}
              placeholder="Provide detailed instructions for the assignment..."
              className="w-full px-3 py-2 text-xs border border-[#C8CDD5] rounded-md focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all bg-white resize-none"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4A5568]">Attachments</label>
            <div className="border-2 border-dashed border-[#C8CDD5] rounded-lg p-8 flex flex-col items-center justify-center bg-[#F7F8FA] hover:bg-[#F4F6F9] transition-colors cursor-pointer group">
              <UploadCloud className="h-8 w-8 text-[#8A94A6] group-hover:text-[#1A6FDB] transition-colors mb-2" />
              <div className="text-xs font-semibold text-[#1A1F36]">Click to upload or drag and drop</div>
              <div className="text-[10px] text-[#8A94A6] mt-1">PDF, DOCX, or Images (Max 10MB)</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#E3E5E8] bg-[#F7F8FA] rounded-b-lg flex items-center justify-end gap-3">
          <button 
            type="button"
            className="h-9 px-4 rounded-md border border-[#C8CDD5] bg-white text-[#4A5568] hover:bg-[#F4F6F9] text-xs font-semibold transition-colors shadow-sm"
          >
            Save as Draft
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="h-9 px-6 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] disabled:bg-[#8A94A6] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            {loading ? <div className="h-4 w-4 rounded-full border-2 border-t-white border-white/30 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Publishing...' : 'Publish Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
