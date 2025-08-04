import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/orderItem/orderItem.module';
import { PartnerModule } from './modules/partner/partner.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    CompanyModule,
    UserModule,
    ProductModule,
    WarehouseModule,
    PartnerModule,
    OrderModule,
    OrderItemModule,
    InvoiceModule,
    ReportsModule,
  ],
})
export class AppModule {}
