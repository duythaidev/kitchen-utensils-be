import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { CartDetailsModule } from '../cart_details/cart_details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UsersModule,
    CartDetailsModule 
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule { }
