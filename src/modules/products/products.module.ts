import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImagesModule } from '../product-images/product-images.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ProductImagesModule ,CategoryModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule { }
