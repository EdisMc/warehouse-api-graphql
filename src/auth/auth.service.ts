import * as bcrypt from 'bcrypt';
import { CompanyService } from 'src/modules/company/company.service';
import { UserService } from 'src/modules/user/user.service';
import { UserRoleEnum } from 'src/shared/enums/user-role.enum';

import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginInput, RegisterInput } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const existingCompany = await this.companyService.findByName(
      input.companyName,
    );
    if (existingCompany) throw new ConflictException('Company already exists!');
    const existingUser = await this.userService.getByEmail(input.email);
    if (existingUser) throw new ConflictException('Registration failed!');

    const company = await this.companyService.create({
      name: input.companyName,
    });

    const user = await this.userService.create({
      email: input.email,
      name: input.name,
      password: input.password,
      companyId: company.id,
      role: UserRoleEnum.OWNER,
    });

    const payload = {
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(input: LoginInput) {
    const user = await this.userService.getByEmail(input.email, true);
    if (!user) throw new UnauthorizedException('Invalid email or password!');
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password!');
    const payload = {
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
