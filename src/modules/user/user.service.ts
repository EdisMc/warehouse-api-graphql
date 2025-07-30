import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo, 'User');
  }

  async findAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'name', 'email', 'role', 'companyId'],
    });
  }

  async getByEmail(email: string, withPassword = false) {
    return this.repo.findOne({
      where: { email },
      select: withPassword
        ? ['id', 'email', 'password', 'name', 'role', 'companyId']
        : ['id', 'email', 'name', 'role', 'companyId'],
    });
  }

  async getAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'email', 'name', 'role', 'companyId'],
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: data.email } });
    if (existing)
      throw new ConflictException(
        `User with email '${data.email}' already exists`,
      );
    return super.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.getById(id);
    if (data.email && data.email !== user.email) {
      const existing = await this.repo.findOne({
        where: { email: data.email },
      });
      if (existing)
        throw new ConflictException(
          `User with email '${data.email}' already exists`,
        );
    }
    return super.update(id, data);
  }
}
