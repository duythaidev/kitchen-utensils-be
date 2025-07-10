import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoryService } from '../category/category.service';
import { FilterProductDto } from './dto/filter-product.dto';
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

  async getFilteredProducts(query: FilterProductDto) {
    const { keyword, sort, priceSort, priceFrom, priceTo, category, page, limit } = query;
    console.log(query)
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 6;

    const where: any = {};

    if (keyword) {
      where.product_name = Like(`%${keyword.toLowerCase()}%`);
    }

    if (priceFrom !== undefined && priceTo !== undefined) {
      where.price = Between(+priceFrom, +priceTo);
    } else if (priceFrom !== undefined) {
      where.price = MoreThanOrEqual(+priceFrom);
    } else if (priceTo !== undefined) {
      where.price = LessThanOrEqual(+priceTo);
    }

    if (category && category.length > 0) {
      where.category = { id: In(category) };
    }
    

    // Sắp xếp
    const order: any = {};
    if (priceSort) {
      order.discounted_price = priceSort === 'lth' ? 'ASC' : 'DESC';
      order.price = priceSort === 'lth' ? 'ASC' : 'DESC';
    }
    console.log(order)


    if (sort === 'newest') {
      order.created_at = 'DESC';
    }
    //  else if (sort === 'bestseller') {
    //   order.stars = 'DESC'; 
    // }

    const [items, total] = await this.productsRepository.findAndCount({
      where,
      relations: {
        category: true,
        images: true,
      },
      order,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      select: {
        id: true,
        product_name: true,
        price: true,
        discounted_price: true,
        stock: true,
        description: true,
        category: {
          id: true,
          category_name: true,
        },
      },
    });
    console.log(items.length)

    return {
      data: items,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
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
    return this.productsRepository.findOne({
      where: { id },
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
