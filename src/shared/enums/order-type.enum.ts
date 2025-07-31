import { registerEnumType } from '@nestjs/graphql';

export enum OrderTypeEnum {
  DELIVERY = 'delivery',
  SHIPMENT = 'shipment',
}

registerEnumType(OrderTypeEnum, { name: 'OrderTypeEnum' });
