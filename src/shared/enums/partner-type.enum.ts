import { registerEnumType } from '@nestjs/graphql';

export enum PartnerTypeEnum {
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
}

registerEnumType(PartnerTypeEnum, { name: 'PartnerTypeEnum' });
