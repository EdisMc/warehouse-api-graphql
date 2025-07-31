import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Partner } from './partner.entity';
import {
	CreatePartnerInput,
	createPartnerSchema,
	UpdatePartnerInput,
	updatePartnerSchema,
} from './partner.types';

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

  async create(input: CreatePartnerInput): Promise<Partner> {
    const parsed = createPartnerSchema.parse(input);
    const existing = await this.repo.findOne({
      where: { name: parsed.name, companyId: parsed.companyId },
    });
    if (existing)
      throw new ConflictException(
        `Partner with name '${parsed.name}' already exists for this company`,
      );
    const partner = this.repo.create(parsed);
    return this.repo.save(partner);
  }

  async update(id: string, input: UpdatePartnerInput): Promise<Partner> {
    const parsed = updatePartnerSchema.parse(input);
    const partner = await this.getById(id);
    if (parsed.name && parsed.name !== partner.name) {
      const existing = await this.repo.findOne({
        where: { name: parsed.name, companyId: partner.companyId },
      });
      if (existing)
        throw new ConflictException(
          `Partner with name '${parsed.name}' already exists for this company`,
        );
    }
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
