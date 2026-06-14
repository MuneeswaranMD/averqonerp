import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get invoices for a specific student
  async getStudentInvoices(schoolId: string, userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.feeInvoice.findMany({
      where: { schoolId, studentId: student.id },
      include: { category: true, payments: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  // 2. Get all invoices (Admin/Accountant)
  async getInvoices(schoolId: string) {
    return this.prisma.feeInvoice.findMany({
      where: { schoolId },
      include: {
        category: true,
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
            class: true,
          },
        },
      },
      orderBy: { dueDate: 'desc' },
    });
  }

  // 3. Create invoice (Admin/Accountant)
  async createInvoice(schoolId: string, dto: {
    studentId: string;
    categoryName: string;
    amount: number;
    dueDate: Date;
  }) {
    // Resolve active academic year
    const academicYear = await this.prisma.academicYear.findFirst({
      where: { schoolId, isActive: true },
    });
    if (!academicYear) {
      throw new BadRequestException('No active academic year found. Please configure one.');
    }

    // Find or create FeeCategory
    let category = await this.prisma.feeCategory.findFirst({
      where: { schoolId, name: dto.categoryName },
    });
    if (!category) {
      category = await this.prisma.feeCategory.create({
        data: { schoolId, name: dto.categoryName, amount: dto.amount },
      });
    }

    return this.prisma.feeInvoice.create({
      data: {
        schoolId,
        studentId: dto.studentId,
        academicYearId: academicYear.id,
        categoryId: category.id,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        status: InvoiceStatus.UNPAID,
      },
    });
  }

  // 4. Pay invoice (Mock Razorpay integration)
  async payInvoice(schoolId: string, invoiceId: string, dto: { paymentMethod: string }) {
    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id: invoiceId, schoolId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice has already been paid');
    }

    // Create a mock transaction ID resembling Razorpay order/payment formats
    const transactionId = `pay_mock_${Date.now().toString().slice(-8)}`;

    return this.prisma.$transaction(async (tx) => {
      // Create payment receipt
      const payment = await tx.feePayment.create({
        data: {
          schoolId,
          invoiceId,
          amountPaid: invoice.amount,
          paymentMethod: dto.paymentMethod,
          transactionId,
        },
      });

      // Update invoice status
      await tx.feeInvoice.update({
        where: { id: invoiceId },
        data: { status: InvoiceStatus.PAID },
      });

      return payment;
    });
  }
}
