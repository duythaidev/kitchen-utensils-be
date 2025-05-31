import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CartDetail } from '../cart_details/entities/cart_detail.entity';
import { Product } from '../products/entities/product.entity';
import { CartDetailsModule } from '../cart_details/cart_details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartDetail, Product, User]),
    CartDetailsModule
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule { }
