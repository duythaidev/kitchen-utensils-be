import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const isExist = await this.productsRepository.findOne({
      where: {
        product_name: createProductDto.product_name,
      },
    });

    if (isExist !== null) {
      throw new BadRequestException('Tên sản phẩm đã tồn tại');
    }

    return this.productsRepository.save(createProductDto);
  }

  findAll() {
    return this.productsRepository.find({
      select: {
        id: true,
        product_name: true,
        price: true
      },
      relations: {
        category: true
      },
    });
  }


  findCategory(id: number) {
    return this.productsRepository.find({ where: { category_id: id } });
  }



  findOne(id: number) {
    return this.productsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id: Not(id), product_name: updateProductDto.product_name } });
    if (product !== null) {
      throw new BadRequestException('Tên sản phẩm đã tồn tại');
    }
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}
