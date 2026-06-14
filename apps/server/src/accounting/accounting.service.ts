import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get cash flow and visual charts summary
  async getSummary(schoolId: string) {
    // Total income from FeePayments
    const payments = await this.prisma.feePayment.findMany({
      where: { schoolId },
      select: { amountPaid: true, paidAt: true },
    });

    const totalIncome = payments.reduce((acc, curr) => acc + Number(curr.amountPaid), 0);

    // Total expenses
    const expenses = await this.prisma.expense.findMany({
      where: { schoolId },
      select: { amount: true, date: true },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Grouping transactions by month for charts (last 6 months)
    const chartData = this.generateMonthlyFlow(payments, expenses);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      chartData,
    };
  }

  // Generate grouped monthly cash flows
  private generateMonthlyFlow(payments: any[], expenses: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // We want the last 6 months
    const last6 = Array.from({ length: 6 }, (_, i) => {
      const idx = (currentMonth - 5 + i + 12) % 12;
      return { month: months[idx], index: idx, income: 0, expense: 0 };
    });

    // Populate income
    payments.forEach(p => {
      const pDate = new Date(p.paidAt);
      const mIdx = pDate.getMonth();
      const match = last6.find(item => item.index === mIdx);
      if (match) {
        match.income += Number(p.amountPaid);
      }
    });

    // Populate expense
    expenses.forEach(e => {
      const eDate = new Date(e.date);
      const mIdx = eDate.getMonth();
      const match = last6.find(item => item.index === mIdx);
      if (match) {
        match.expense += Number(e.amount);
      }
    });

    return last6.map(({ month, income, expense }) => ({ name: month, income, expense }));
  }

  // 2. Get operational expenses list
  async getExpenses(schoolId: string) {
    return this.prisma.expense.findMany({
      where: { schoolId },
      orderBy: { date: 'desc' },
    });
  }

  // 3. Log new expense (Accountant / Admin)
  async createExpense(schoolId: string, dto: {
    title: string;
    amount: number;
    category: string;
    date: Date;
    paymentMethod: string;
    remarks?: string;
  }) {
    return this.prisma.expense.create({
      data: {
        schoolId,
        title: dto.title,
        amount: dto.amount,
        category: dto.category,
        date: new Date(dto.date),
        paymentMethod: dto.paymentMethod,
        remarks: dto.remarks,
      },
    });
  }
}
