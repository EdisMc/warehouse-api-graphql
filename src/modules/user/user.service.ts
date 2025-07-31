import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import {
	CreateUserInput,
	createUserSchema,
	UpdateUserInput,
	updateUserSchema,
} from './user.types';

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

  async create(input: CreateUserInput): Promise<User> {
    const parsed = createUserSchema.parse(input);
    const existing = await this.repo.findOne({
      where: { email: parsed.email },
    });
    if (existing) {
      throw new ConflictException(
        `User with email '${parsed.email}' already exists`,
      );
    }
    parsed.password = await bcrypt.hash(parsed.password, 10);
    const user = this.repo.create(parsed);
    return this.repo.save(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const parsed = updateUserSchema.parse(input);
    const user = await this.getById(id);
    if (parsed.email && parsed.email !== user.email) {
      const existing = await this.repo.findOne({
        where: { email: parsed.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `User with email '${parsed.email}' already exists`,
        );
      }
    }
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
