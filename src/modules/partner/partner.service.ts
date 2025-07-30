import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Partner } from './partner.entity';

@Injectable()
export class PartnerService extends BaseService<Partner> {
  constructor(@InjectRepository(Partner) repo: Repository<Partner>) {
    super(repo, 'Partner');
  }

  async getAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'name', 'type', 'companyId'],
    });
  }

  async findById(id: string): Promise<Partner | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'name', 'type', 'companyId'],
    });
  }

  async create(data: Partial<Partner>): Promise<Partner> {
    const existing = await this.repo.findOne({
      where: { name: data.name, companyId: data.companyId },
    });
    if (existing)
      throw new ConflictException(
        `Partner with name '${data.name}' already exists for this company`,
      );
    return super.create(data);
  }

  async update(id: string, data: Partial<Partner>): Promise<Partner> {
    const partner = await this.getById(id);
    if (data.name && data.name !== partner.name) {
      const existing = await this.repo.findOne({
        where: { name: data.name, companyId: partner.companyId },
      });
      if (existing)
        throw new ConflictException(
          `Partner with name '${data.name}' already exists for this company`,
        );
    }
    return super.update(id, data);
  }
}
