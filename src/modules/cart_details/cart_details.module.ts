import { Module } from '@nestjs/common';
import { CartDetailsService } from './cart_details.service';
import { CartDetailsController } from './cart_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetail } from './entities/cart_detail.entity';
import { ProductsModule } from '../products/products.module';
import { OrderDetailsModule } from '../order-details/order-details.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartDetail]),
    ProductsModule,
    OrdersModule,
    OrderDetailsModule,
  ],
  controllers: [CartDetailsController],
  providers: [CartDetailsService],
  exports: [CartDetailsService]
})
export class CartDetailsModule { }
