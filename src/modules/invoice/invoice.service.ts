import { BaseService } from 'src/shared/services/base.service';
import { In, Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from '../order/order.entity';
import { Invoice } from './invoice.entity';

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

  async create(data: Partial<Invoice>): Promise<Invoice> {
    const existing = await this.repo.findOne({
      where: { invoiceNumber: data.invoiceNumber },
    });
    if (existing)
      throw new ConflictException(
        `Invoice with number '${data.invoiceNumber}' already exists`,
      );
    return super.create(data);
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const invoice = await this.getById(id);
    if (data.invoiceNumber && data.invoiceNumber !== invoice.invoiceNumber) {
      const existing = await this.repo.findOne({
        where: { invoiceNumber: data.invoiceNumber },
      });
      if (existing)
        throw new ConflictException(
          `Invoice with number '${data.invoiceNumber}' already exists`,
        );
    }
    return super.update(id, data);
  }
}
