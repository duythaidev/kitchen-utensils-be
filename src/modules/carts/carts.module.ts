import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetailsModule } from '../cart_details/cart_details.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    CartDetailsModule,
    UsersModule
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule { }
