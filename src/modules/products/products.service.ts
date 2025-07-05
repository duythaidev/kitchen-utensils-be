import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoryService } from '../category/category.service';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoryService: CategoryService,
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
    if (createProductDto.category_id) {
      
      const category = await this.categoryService.findOne(createProductDto.category_id);
      if (category === null) {
        throw new BadRequestException('Danh mục không tồn tại');
      }
    }
    return this.productsRepository.save(createProductDto);
  }

  findAll() {
    return this.productsRepository.find({
      select: {
        id: true,
        product_name: true,
        price: true,
        discounted_price: true,
        description: true,
        stock: true,
        category: {
          id: true,
          category_name: true
        },
      },
      relations: {
        category: true,
        images: true // one to many
      },
    });
  }


  findCategory(id: number) {
    return this.productsRepository.find({ where: { category_id: id } });
  }



  findOne(id: number) {
    return this.productsRepository.findOne({ where: { id },
      select: {
        id: true,
        product_name: true,
        price: true,
        discounted_price: true,
        description: true,
        stock: true,
        category: {
          id: true,
          category_name: true
        },
      },
      relations: {
        category: true,
        images: true // one to many
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id: Not(id), product_name: updateProductDto.product_name } });
    if (product !== null) {
      throw new BadRequestException('Tên sản phẩm đã tồn tại');
    }
    if (updateProductDto.category_id) {
      const category = await this.categoryService.findOne(updateProductDto.category_id);
      if (category === null) {
        throw new BadRequestException('Danh mục không tồn tại');
      }
    }
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productsRepository.delete(id);
  }
}
