import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductImagesService {
    constructor(
        @InjectRepository(ProductImage)
        private productImageRepository: Repository<ProductImage>,
    ) { }

    async create(product_id: number, isMain: boolean[], listImageUrl: string[]) {
        const productImages = listImageUrl.map((imageUrl, index) => {
            return this.productImageRepository.create({
                product_id,
                image_url: imageUrl,
                is_main: isMain[index],

            });
        });
        const productImagesEntities = this.productImageRepository.create(productImages);
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

    // async update(id: number, updateProductImageDto: UpdateProductImageDto) {
    //     const productImage = await this.findOne(id);
    //     return await this.productImageRepository.update(productImage, updateProductImageDto);
    // }

    async remove(id: number) {
        const productImage = await this.findOne(id);
        return await this.productImageRepository.remove(productImage);
    }
}
