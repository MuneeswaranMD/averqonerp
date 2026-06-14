'use client';

import { useEffect, useState } from 'react';
import { CreditCard, PlusCircle, AlertCircle, CheckCircle, Receipt, Landmark } from 'lucide-react';

interface Invoice {
  id: string;
  amount: string;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  category: { name: string };
  student?: {
    user: { firstName: string; lastName: string; email: string };
    class: { name: string };
  };
  payments: any[];
}

export default function FeesDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states for creating invoice
  const [studentId, setStudentId] = useState('');
  const [categoryName, setCategoryName] = useState('Quarter 1 Tuition');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);
      setRole(user.role);

      const isStaff = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT', 'TEACHER'].includes(user.role);
      const endpoint = isStaff
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fees/invoices`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fees/my-invoices`;

      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load invoices.');
      setInvoices(data);
    } catch (err: any) {
      setError(err.message || 'Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePay = async (invoiceId: string) => {
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/fees/pay/${invoiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
        body: JSON.stringify({ paymentMethod: 'Razorpay (UPI/Netbanking)' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed.');

      setSuccess(`Payment successful via Razorpay! Transaction ID: ${data.transactionId}`);
      fetchInvoices();
    } catch (err: any) {
      setError(err.message || 'Failed to process payment.');
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('Unauthorized');
      const user = JSON.parse(userStr);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/fees/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-school-id': user.schoolId,
        },
        body: JSON.stringify({
          studentId,
          categoryName,
          amount: parseFloat(amount),
          dueDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Creation failed.');

      setSuccess('Invoice successfully generated for student.');
      setStudentId('');
      setAmount('');
      setDueDate('');
      fetchInvoices();
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice.');
    }
  };

  const isBillingStaff = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(role);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E3E5E8] pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1F36]">Fee Invoices Desk</h1>
          <div className="text-xs text-[#8A94A6] mt-0.5">
            averqonerp &gt; Fee Invoices
          </div>
        </div>
        <div className="text-xs text-[#8A94A6] font-mono select-none">
          Billing Workspace
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
          <span className="leading-relaxed">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-[#1A1F36] border-b border-[#E3E5E8] pb-1.5">Active Invoices</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#8A94A6]">
              <div className="h-8 w-8 rounded-full border-2 border-t-[#1A6FDB] border-[#E3E5E8] animate-spin mb-3" />
              <span className="text-xs font-medium">Fetching invoices...</span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#E3E5E8] bg-white rounded-lg text-[#8A94A6] font-normal text-xs">
              No invoices found in this workspace.
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-5 border border-[#E3E5E8] bg-white rounded-lg hover:border-[#C8CDD5] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-[#1A6FDB]" />
                      <span className="font-semibold text-[#1A1F36] text-sm">{inv.category.name}</span>
                    </div>
                    <div className="text-xs text-[#8A94A6]">
                      Due Date: <span className="font-mono">{new Date(inv.dueDate).toLocaleDateString()}</span>
                    </div>
                    {isBillingStaff && inv.student && (
                      <div className="text-xs text-[#4A5568] mt-1">
                        Student: <span className="text-[#1A1F36] font-semibold">{inv.student.user.firstName} {inv.student.user.lastName}</span> ({inv.student.class.name})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                    <div className="text-right">
                      <div className="font-semibold text-base text-[#1A1F36] font-mono">₹{inv.amount}</div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mt-1 ${
                        inv.status === 'PAID' ? 'bg-[#EDF7ED] text-[#2E7D32]' :
                        'bg-[#FEF0F0] text-[#C62828]'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    {inv.status !== 'PAID' && !isBillingStaff && (
                      <button
                        onClick={() => handlePay(inv.id)}
                        className="h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] font-semibold text-white text-xs transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="h-3.5 w-3.5" /> Pay Now
                      </button>
                    )}
                    
                    {inv.status === 'PAID' && (
                      <div className="p-2 rounded bg-[#EDF7ED] text-[#2E7D32]" title="Payment Receipt Generated">
                        <Receipt className="h-4.5 w-4.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar / Create Invoice */}
        {isBillingStaff && (
          <div className="p-5 border border-[#E3E5E8] bg-white rounded-lg space-y-4 h-fit">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1F36] flex items-center gap-2 border-b border-[#E3E5E8] pb-2">
                <PlusCircle className="h-4.5 w-4.5 text-[#1A6FDB]" /> Generate Fee Invoice
              </h3>
              <p className="text-xs text-[#8A94A6] mt-1 font-light">Generate student ledger collections</p>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="studentId" className="block text-xs font-semibold text-[#4A5568]">
                  Student UUID
                </label>
                <input
                  type="text"
                  id="studentId"
                  required
                  placeholder="Paste Student Profile ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all font-mono"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="category" className="block text-xs font-semibold text-[#4A5568]">
                  Fee Category
                </label>
                <select
                  id="category"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                >
                  <option value="Quarter 1 Tuition">Quarter 1 Tuition</option>
                  <option value="Quarter 2 Tuition">Quarter 2 Tuition</option>
                  <option value="Admission Fees">Admission Fees</option>
                  <option value="Transportation Fees">Transportation Fees</option>
                  <option value="LMS Lab Fees">LMS Lab Fees</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="amount" className="block text-xs font-semibold text-[#4A5568]">
                  Amount (INR)
                </label>
                <input
                  type="number"
                  id="amount"
                  required
                  placeholder="e.g. 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] placeholder-[#B8BCC8] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all font-mono"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="dueDate" className="block text-xs font-semibold text-[#4A5568]">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="block w-full h-9 px-3 border border-[#C8CDD5] bg-white rounded-md text-xs text-[#1A1F36] focus:outline-none focus:border-[#1A6FDB] focus:ring-[3px] focus:ring-[#1A6FDB]/12 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full h-9 px-4 rounded-md bg-[#1A6FDB] hover:bg-[#1558B0] font-semibold text-white text-xs transition-colors flex items-center justify-center"
              >
                Generate Invoice
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
