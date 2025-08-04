import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './auth.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput) {
    const { accessToken } = await this.authService.login(input);
    return accessToken;
  }

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput) {
    const { accessToken } = await this.authService.register(input);
    return accessToken;
  }
}
