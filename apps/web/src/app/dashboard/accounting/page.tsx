'use client';

import { useEffect, useState } from 'react';
import { Landmark, AlertCircle, CheckCircle, Activity, PlusCircle, TrendingUp, HelpCircle } from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: string;
  category: string;
  date: string;
  paymentMethod: string;
  remarks: string | null;
}

interface MonthFlow {
  name: string;
  income: number;
  expense: number;
}

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  chartData: MonthFlow[];
}

export default function AccountingPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Utility');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [remarks, setRemarks] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      // Fetch summary
      const sumRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/accounting/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
      });
      const sumData = await sumRes.json();
      if (!sumRes.ok) throw new Error(sumData.message || 'Failed to load ledger summary.');
      setSummary(sumData);

      // Fetch expenses
      const expRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/accounting/expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
      });
      const expData = await expRes.json();
      if (!expRes.ok) throw new Error(expData.message || 'Failed to load expenses.');
      setExpenses(expData);

    } catch (err: any) {
      setError(err.message || 'Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/accounting/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          date,
          paymentMethod,
          remarks: remarks || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to record cost.');

      setSuccess('Operational expense logged successfully.');
      setTitle('');
      setAmount('');
      setRemarks('');
      
      // Refresh summaries
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to submit expense.');
    } finally {
      setSubmitting(false);
    }
  };

  // Find max value in chart data to scale pure CSS bars
  const getMaxChartVal = () => {
    if (!summary || !summary.chartData) return 10000;
    let max = 1000;
    summary.chartData.forEach(item => {
      if (item.income > max) max = item.income;
      if (item.expense > max) max = item.expense;
    });
    return max;
  };

  const maxChartVal = getMaxChartVal();

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">School Accounting Ledger</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">
            averqonerp &gt; Financial Ledger
          </div>
        </div>
        <div className="text-xs text-[#8A94A6] font-mono select-none">
          Treasury Workspace
        </div>
      </div>

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8A94A6]">
          <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
          <span className="text-xs font-medium">Loading ledger statements...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Ledger Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Gross Income</span>
                <div className="text-2xl font-bold text-[#2E7D32] mt-2 font-mono">
                  ₹{summary?.totalIncome.toLocaleString()}
                </div>
              </div>
              <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Gross Expenses</span>
                <div className="text-2xl font-bold text-[#C62828] mt-2 font-mono">
                  ₹{summary?.totalExpenses.toLocaleString()}
                </div>
              </div>
              <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg flex flex-col justify-between h-28">
                <span className="text-xs font-semibold text-[#8A94A6] uppercase tracking-wider">Net Profit</span>
                <div className={`text-2xl font-bold mt-2 font-mono ${
                  (summary?.netProfit ?? 0) >= 0 ? 'text-[#1A6FDB]' : 'text-[#C62828]'
                }`}>
                  ₹{summary?.netProfit.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Custom Bar Chart Card */}
            <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4">
              <h3 className="text-xs font-bold text-[#8A94A6] uppercase tracking-wider border-b border-[#E3E5E8] pb-1.5 flex items-center gap-1.5 select-none">
                <Activity className="h-4 w-4 text-[#1A6FDB]" /> Cash Flow Trend (Last 6 Months)
              </h3>
              
              {summary && summary.chartData && (
                <div className="flex flex-col space-y-4 pt-4">
                  {/* Grid of months */}
                  <div className="h-44 flex items-end justify-between px-4 border-b border-[#C8CDD5] pb-2">
                    {summary.chartData.map((month) => {
                      const incPct = `${Math.min(100, Math.max(5, (month.income / maxChartVal) * 100))}%`;
                      const expPct = `${Math.min(100, Math.max(5, (month.expense / maxChartVal) * 100))}%`;
                      return (
                        <div key={month.name} className="flex flex-col items-center gap-1.5 w-1/6 group relative">
                          
                          {/* Tooltips */}
                          <div className="absolute bottom-48 bg-[#1A1F36] text-white text-[10px] rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 space-y-0.5 font-mono shadow-md pointer-events-none select-none border border-[#E3E5E8]/10 text-center w-28">
                            <div className="font-bold text-[#8A94A6]">{month.name} Details</div>
                            <div className="text-[#EDF7ED]">In: ₹{month.income}</div>
                            <div className="text-[#FEF0F0]">Out: ₹{month.expense}</div>
                          </div>

                          {/* Dual Bars */}
                          <div className="flex gap-1 h-36 items-end justify-center w-full">
                            {/* Income Bar (Green) */}
                            <div 
                              style={{ height: incPct }} 
                              className="w-3.5 bg-[#2E7D32]/85 hover:bg-[#2E7D32] rounded-t-sm transition-all" 
                              title={`Income: ₹${month.income}`}
                            />
                            {/* Expense Bar (Red) */}
                            <div 
                              style={{ height: expPct }} 
                              className="w-3.5 bg-[#C62828]/85 hover:bg-[#C62828] rounded-t-sm transition-all" 
                              title={`Expense: ₹${month.expense}`}
                            />
                          </div>

                          {/* Month Label */}
                          <span className="text-[10px] font-semibold text-[#4A5568]">{month.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="flex gap-4 text-[10px] font-semibold text-[#8A94A6] justify-center pt-1.5 select-none">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#2E7D32]" /> Gross Receipts</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#C62828]" /> Operational Expenses</span>
                  </div>
                </div>
              )}
            </div>

            {/* Expense Transaction History */}
            <div className="border border-[#E3E5E8] bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[#E3E5E8] bg-[#F4F6F9] font-semibold text-[#1A1F36] text-xs">
                Ledger Cost Accounts
              </div>
              
              {expenses.length === 0 ? (
                <div className="text-center py-12 text-[#8A94A6] text-xs">
                  No costs recorded in this academic period.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#C8CDD5] bg-[#F4F6F9] text-[#4A5568] font-semibold uppercase text-[11px] tracking-wider select-none">
                      <th className="p-3.5 pl-4">Cost Title</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Logged Date</th>
                      <th className="p-3.5 pr-4 text-right">Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E5E8] text-[#1A1F36]">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-[#F7F8FA] transition-colors">
                        <td className="p-3.5 pl-4 font-semibold text-[#1A1F36]">
                          <div>{exp.title}</div>
                          {exp.remarks && <div className="text-[10px] text-[#8A94A6] font-normal mt-0.5">"{exp.remarks}"</div>}
                        </td>
                        <td className="p-3.5 font-medium text-[#4A5568]">{exp.category}</td>
                        <td className="p-3.5 text-[#4A5568] uppercase font-mono">{exp.paymentMethod}</td>
                        <td className="p-3.5 text-[#4A5568]">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="p-3.5 pr-4 text-right font-mono font-bold text-[#C62828]">-₹{parseFloat(exp.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

          {/* Cost Logging Form */}
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4 h-fit">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1F36] flex items-center gap-2 border-b border-[#E3E5E8] pb-2">
                <PlusCircle className="h-4.5 w-4.5 text-[#1A6FDB]" /> Log Operational Cost
              </h3>
              <p className="text-xs text-[#8A94A6] mt-1 font-light">Record operational payments and costs</p>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="title" className="block text-xs font-semibold text-[#4A5568]">
                  Cost Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  placeholder="e.g. Electric bill May"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="category" className="block text-xs font-semibold text-[#4A5568]">
                  Expense Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                >
                  <option value="Salary">Salary payments</option>
                  <option value="Utility">Utilities (Power, Water)</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Rent">Campus Rental</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="amount" className="block text-xs font-semibold text-[#4A5568]">
                  Amount Paid (INR)
                </label>
                <input
                  type="number"
                  id="amount"
                  required
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all font-mono"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="date" className="block text-xs font-semibold text-[#4A5568]">
                  Payment Date
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="method" className="block text-xs font-semibold text-[#4A5568]">
                  Payment Mode
                </label>
                <select
                  id="method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                >
                  <option value="UPI">UPI Payment</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Cash">Cash Ledger</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="remarks" className="block text-xs font-semibold text-[#4A5568]">
                  Remarks / Notes
                </label>
                <textarea
                  id="remarks"
                  placeholder="Additional cost details"
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="block w-full p-2.5 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] font-semibold text-white text-xs transition-colors flex items-center justify-center"
              >
                {submitting ? 'Logging Transaction...' : 'Record cost Item'}
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
