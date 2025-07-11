import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { ProductImage } from './entities/product-image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProductImage])],
    controllers: [ProductImagesController],
    providers: [ProductImagesService],
    exports: [ProductImagesService],
})
export class ProductImagesModule { }
