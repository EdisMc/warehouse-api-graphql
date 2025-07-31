import { registerEnumType } from '@nestjs/graphql';

export enum UserRoleEnum {
  OWNER = 'OWNER',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

registerEnumType(UserRoleEnum, { name: 'UserRoleEnum' });
