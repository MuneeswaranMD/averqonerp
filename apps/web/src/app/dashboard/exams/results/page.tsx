'use client';

import { useEffect, useState } from 'react';
import { Award, AlertCircle, Printer } from 'lucide-react';

interface ResultItem {
  id: string;
  marksObtained: string;
  maxMarks: string;
  grade: string;
  exam: { name: string };
  subject: { name: string; code: string };
}

interface ResultsData {
  student: {
    admissionNo: string;
    rollNo: string | null;
    className: string;
  };
  results: ResultItem[];
  gpa: number;
  grade: string;
  percentage: number;
  totalMarksObtained: number;
  totalMaxMarks: number;
}

export default function ExamResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        if (!token || !userStr) throw new Error('Unauthorized');
        const user = JSON.parse(userStr);
        setUserEmail(user.email);
        setUserName(`${user.firstName} ${user.lastName}`);

        const res = await fetch('http://localhost:3001/api/v1/exams/my-results', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-school-id': user.schoolId,
          },
        });

        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || 'Failed to load results.');
        setData(resData);
      } catch (err: any) {
        setError(err.message || 'Connection failure.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0 print:space-y-4">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3 print:hidden">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Academic Results Marksheet</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">
            averqonerp &gt; Exam Results
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="h-9 px-4 rounded-md border border-[#E3E5E8] bg-white text-[#4A5568] hover:bg-[#F4F6F9] font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Printer className="h-3.5 w-3.5" /> Print Marksheet
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-[#FEF0F0] text-[#C62828] text-xs flex items-start gap-1.5 border-none font-medium print:hidden">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8A94A6] print:hidden">
          <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
          <span className="text-xs font-medium">Processing GPA sheets...</span>
        </div>
      ) : !data || data.results.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#E3E5E8] bg-white rounded-lg text-[#8A94A6] font-normal text-xs print:hidden">
          No examination results registered for this profile yet.
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Marksheet Title for print */}
          <div className="hidden print:block text-center space-y-1 pb-4 border-b border-[#C8CDD5]">
            <h1 className="text-2xl font-bold text-[#1A1F36]">AVERQON ERP INSTITUTIONAL REPORT</h1>
            <p className="text-sm text-[#4A5568]">Official Academic Transcript</p>
          </div>

          {/* Student Info Card */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
            <h3 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-1.5 uppercase tracking-wider">Candidate Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#8A94A6]">Student Name</span>
                <div className="font-semibold text-[#1A1F36] mt-0.5">{userName}</div>
              </div>
              <div>
                <span className="text-[#8A94A6]">Email Address</span>
                <div className="font-semibold text-[#1A1F36] mt-0.5">{userEmail}</div>
              </div>
              <div>
                <span className="text-[#8A94A6]">Academic Class</span>
                <div className="font-semibold text-[#1A1F36] mt-0.5">{data.student.className}</div>
              </div>
              <div>
                <span className="text-[#8A94A6]">Admission / Roll No</span>
                <div className="font-semibold text-[#1A1F36] mt-0.5">{data.student.admissionNo} {data.student.rollNo ? `/ #${data.student.rollNo}` : ''}</div>
              </div>
            </div>
          </div>

          {/* Performance Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
              <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Cumulative GPA</span>
              <div className="text-2xl font-bold text-[#1A6FDB] mt-2">
                {data.gpa.toFixed(2)} / 4.00
              </div>
            </div>
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
              <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Overall Grade</span>
              <div className="text-2xl font-bold text-[#2E7D32] mt-2">
                Grade {data.grade}
              </div>
            </div>
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
              <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Net Percentage</span>
              <div className="text-2xl font-bold text-[#B45309] mt-2">
                {data.percentage.toFixed(1)}%
              </div>
            </div>
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
              <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Total Marks</span>
              <div className="text-2xl font-bold text-[#1A1F36] mt-2 font-mono">
                {data.totalMarksObtained} / {data.totalMaxMarks}
              </div>
            </div>
          </div>

          {/* Marks Listing */}
          <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] font-semibold text-[#1A1F36] text-xs">
              Subject Marksheet
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[11px] tracking-wider select-none">
                  <th className="p-3.5 pl-4">Subject Name</th>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Exam Term</th>
                  <th className="p-3.5 text-center">Marks Obtained</th>
                  <th className="p-3.5 text-center">Max Marks</th>
                  <th className="p-3.5 text-center">Percentage</th>
                  <th className="p-3.5 pr-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
                {data.results.map((res) => {
                  const marksObt = Number(res.marksObtained);
                  const maxMarks = Number(res.maxMarks);
                  const pct = maxMarks > 0 ? (marksObt / maxMarks) * 100 : 0;
                  return (
                    <tr key={res.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="p-3.5 pl-4 font-semibold text-[#1A1F36]">{res.subject.name}</td>
                      <td className="p-3.5 font-mono text-[#8A94A6]">{res.subject.code}</td>
                      <td className="p-3.5 text-[#4A5568]">{res.exam.name}</td>
                      <td className="p-3.5 text-center font-mono font-medium text-[#1A1F36]">{res.marksObtained}</td>
                      <td className="p-3.5 text-center font-mono text-[#4A5568]">{res.maxMarks}</td>
                      <td className="p-3.5 text-center font-mono text-[#4A5568]">{pct.toFixed(1)}%</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          res.grade === 'F' ? 'bg-[#FEF0F0] text-[#C62828]' :
                          res.grade === 'D' ? 'bg-[#FFF8E6] text-[#B45309]' :
                          'bg-[#EDF7ED] text-[#2E7D32]'
                        }`}>
                          {res.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="hidden print:flex justify-between items-center text-xs text-[#8A94A6] mt-16 pt-8 border-t border-[#E3E5E8]">
            <div>Report generated dynamically via averqonerp System.</div>
            <div className="border-b border-[#8A94A6] w-48 text-center pb-1 font-semibold text-[#1A1F36]">Authorized Signature</div>
          </div>
        </div>
      )}

    </div>
  );
}
