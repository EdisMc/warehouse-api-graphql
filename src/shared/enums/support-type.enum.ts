import { registerEnumType } from '@nestjs/graphql';

export enum SupportTypeEnum {
  SOLID = 'solid',
  LIQUID = 'liquid',
}

registerEnumType(SupportTypeEnum, { name: 'SupportTypeEnum' });
