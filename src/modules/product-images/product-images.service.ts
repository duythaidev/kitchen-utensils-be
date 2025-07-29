import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImagesService {
    constructor(
        @InjectRepository(ProductImage)
        private productImageRepository: Repository<ProductImage>,
    ) { }

    async create(product_id: number, isMain: number, listImageUrl: string[]) {
        // console.log("service: ", product_id, isMain, listImageUrl)
        const productImages = listImageUrl.map((imageUrl, index) => {
            return this.productImageRepository.create({
                product_id,
                image_url: imageUrl,
                is_main: isMain === index,

            });
        });
        const productImagesEntities = this.productImageRepository.create(productImages);
        // console.log("service: ", productImagesEntities)
        return await this.productImageRepository.insert(productImagesEntities);
    }

    async findAll() {
        return await this.productImageRepository.find();
    }

    async findByProductId(product_id: number) {
        return await this.productImageRepository.find({
            where: { product_id },
        });
    }

    async findOne(id: number) {
        const productImage = await this.productImageRepository.findOne({
            where: { id },
        });
        if (!productImage) {
            throw new NotFoundException(`Product image with ID ${id} not found`);
        }
        return productImage;
    }

    async update(product_id: number, isMain: number, listImageUrl: string[]) {
        // console.log("service: ", product_id, isMain, listImageUrl)
        
        const isExist = await this.findByProductId(product_id);

        if (isExist === null) {
            throw new NotFoundException(`Product image with product_id ${product_id} not found`);
        }

        if (isExist.length > 3) {
            throw new NotFoundException(`Product images should only have max of 3 images`);
        }
        
        await this.productImageRepository.delete({ product_id });

        const newProductImages = listImageUrl.map((imageUrl, index) => {
            return this.productImageRepository.create({
                product_id,
                image_url: imageUrl,
                is_main: isMain === index,

            });
        });
        const newProductImagesEntities = await this.productImageRepository.save(newProductImages);
        return newProductImagesEntities;
    }

    async remove(id: number) {
        const productImage = await this.findOne(id);
        return await this.productImageRepository.remove(productImage);
    }
}
