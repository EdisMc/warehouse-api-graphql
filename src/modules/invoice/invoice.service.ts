import { BaseService } from 'src/shared/services/base.service';
import { In, Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from '../order/order.entity';
import { Invoice } from './invoice.entity';
import {
	CreateInvoiceInput,
	createInvoiceSchema,
	UpdateInvoiceInput,
	updateInvoiceSchema,
} from './invoice.types';

@Injectable()
export class InvoiceService extends BaseService<Invoice> {
  constructor(@InjectRepository(Invoice) repo: Repository<Invoice>) {
    super(repo, 'Invoice');
  }

  async findByOrder(orderId: string): Promise<Invoice | null> {
    return this.repo.findOne({ where: { orderId } });
  }

  async getAllByCompany(companyId: string) {
    const orders = await this.repo.manager.find(Order, {
      where: { companyId },
      select: ['id'],
    });
    const orderIds = orders.map((order) => order.id);

    if (orderIds.length === 0) return [];

    return this.repo.find({
      where: { orderId: In(orderIds) },
      select: ['id', 'orderId', 'invoiceNumber', 'issueDate'],
    });
  }

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const parsed = createInvoiceSchema.parse(input);
    const existing = await this.repo.findOne({
      where: { invoiceNumber: parsed.invoiceNumber },
    });
    if (existing)
      throw new ConflictException(
        `Invoice with number '${parsed.invoiceNumber}' already exists`,
      );
    const invoice = this.repo.create(parsed);
    return this.repo.save(invoice);
  }

  async update(id: string, input: UpdateInvoiceInput): Promise<Invoice> {
    const parsed = updateInvoiceSchema.parse(input);
    const invoice = await this.getById(id);
    if (
      parsed.invoiceNumber &&
      parsed.invoiceNumber !== invoice.invoiceNumber
    ) {
      const existing = await this.repo.findOne({
        where: { invoiceNumber: parsed.invoiceNumber },
      });
      if (existing)
        throw new ConflictException(
          `Invoice with number '${parsed.invoiceNumber}' already exists`,
        );
    }
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
