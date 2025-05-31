import { Module } from '@nestjs/common';
import { CartDetailsService } from './cart_details.service';
import { CartDetailsController } from './cart_details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetail } from './entities/cart_detail.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartDetail,Product])],
  controllers: [CartDetailsController],
  providers: [CartDetailsService],
  exports: [CartDetailsService]
})
export class CartDetailsModule { }
