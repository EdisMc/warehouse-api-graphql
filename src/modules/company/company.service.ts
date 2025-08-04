import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from './company.entity';
import {
	CreateCompanyInput,
	createCompanySchema,
	UpdateCompanyInput,
	updateCompanySchema,
} from './company.types';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(@InjectRepository(Company) repo: Repository<Company>) {
    super(repo, 'Company');
  }

  async findById(id: string): Promise<Company | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Company | null> {
    return this.repo.findOne({ where: { name } });
  }

  async create(input: CreateCompanyInput): Promise<Company> {
    const parsed = createCompanySchema.parse(input);
    const existing = await this.repo.findOne({ where: { name: parsed.name } });
    if (existing)
      throw new ConflictException(`Company with name '${parsed.name}' exists!`);
    const company = this.repo.create(parsed);
    return this.repo.save(company);
  }

  async update(id: string, input: UpdateCompanyInput): Promise<Company> {
    const parsed = updateCompanySchema.parse(input);
    const company = await this.getById(id);
    if (parsed.name && parsed.name !== company.name) {
      const existing = await this.repo.findOne({
        where: { name: parsed.name },
      });
      if (existing)
        throw new ConflictException(
          `Company with name '${parsed.name}' exists!`,
        );
    }
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
