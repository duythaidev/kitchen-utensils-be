import { Injectable, BadRequestException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, In, LessThanOrEqual, Like, MoreThanOrEqual, Not, Raw, Repository } from 'typeorm'
import { Product } from './entities/product.entity'
import { CategoryService } from '../category/category.service'
import { FilterProductDto } from './dto/filter-product.dto'
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
    })



    if (isExist !== null) {
      throw new BadRequestException('Tên sản phẩm đã tồn tại')
    }
    if (createProductDto.category_id) {

      const category = await this.categoryService.findOne(createProductDto.category_id)
      if (category === null) {
        throw new BadRequestException('Danh mục không tồn tại')
      }
    }
    return this.productsRepository.save(createProductDto)
  }

  async getFilteredProducts(query: FilterProductDto) {

    // class already parse pricefrom , priceto to 0
    const { keyword, sort, priceSort, priceFrom, priceTo, categoryId, page, limit } = query
    // console.log(query)
    const pageNumber = page ? page : 1
    const limitNumber = limit ? limit : 6


    const where: any = {}

    const qb = this.productsRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.images", "images")
      .leftJoinAndSelect("product.reviews", "reviews")
      .addSelect("COALESCE(product.discounted_price, product.price)", "effective_price")

    if (keyword) {
      qb.andWhere("LOWER(product.product_name) LIKE :keyword", { keyword: `%${keyword.toLowerCase()}%` })
    }

    if (priceFrom && priceTo) {
      if (priceFrom !== 0 && priceTo !== 0) {
        qb.andWhere("COALESCE(product.discounted_price, product.price) BETWEEN :from AND :to", {
          from: priceFrom,
          to: priceTo,
        })
      } else if (priceFrom !== 0) {
        qb.andWhere("COALESCE(product.discounted_price, product.price) >= :from", { from: priceFrom })
      } else if (priceTo !== 0) {
        qb.andWhere("COALESCE(product.discounted_price, product.price) <= :to", { to: priceTo })
      }
    }

    if (categoryId) {
      qb.andWhere("category.id = :category", { category: categoryId })
    }

    // // console.log("priceSort", priceSort)
    if (sort === "newest") {
      qb.orderBy("product.created_at", "DESC")
    }

    if (priceSort === "lth") {
      qb.orderBy("effective_price", "ASC")
    } else if (priceSort === "htl") {
      qb.orderBy("effective_price", "DESC")
    }

    const [items, total] = await qb
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount()

    const reviews = items.map(item => {
      const totalReviews = item.reviews.length
      const averageRating = totalReviews > 0 ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

      return {
        totalReviews,
        averageRating
      }
    })

    return {
      data: items,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    }
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
        images: true, // one to many
        reviews: true, // one to many
      },
    })
  }


  findCategory(id: number) {
    return this.productsRepository.find({ where: { category_id: id } })
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
    })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id: Not(id), product_name: updateProductDto.product_name } })
    if (product !== null) {
      throw new BadRequestException('Tên sản phẩm đã tồn tại')
    }
    if (updateProductDto.category_id) {
      const category = await this.categoryService.findOne(updateProductDto.category_id)
      if (category === null) {
        throw new BadRequestException('Danh mục không tồn tại')
      }
    }
    return this.productsRepository.update(id, updateProductDto)
  }

  remove(id: number) {
    return this.productsRepository.delete(id)
  }

  async getTopRatedProducts() {
    const products = await this.productsRepository.find({
      relations: {
        reviews: true,
        images: true,
      },
    })
    const topRatedProducts = products.sort((a, b) => b.reviews.reduce((sum, review) => sum + review.rating, 0) / b.reviews.length - a.reviews.reduce((sum, review) => sum + review.rating, 0) / a.reviews.length).slice(0, 5)
    // console.log(topRatedProducts)
    return topRatedProducts
  }
}
