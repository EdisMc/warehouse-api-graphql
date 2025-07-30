import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from './company.entity';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(@InjectRepository(Company) repo: Repository<Company>) {
    super(repo, 'Company');
  }

  async findById(id: string): Promise<Company | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Company>): Promise<Company> {
    const existing = await this.repo.findOne({ where: { name: data.name } });
    if (existing)
      throw new ConflictException(`Company with name '${data.name}' exists!`);
    return super.create(data);
  }
}
