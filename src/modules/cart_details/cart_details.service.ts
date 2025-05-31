import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDetailDto } from './dto/create-cart_detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CartDetail } from './entities/cart_detail.entity';
import { Cart } from '../carts/entities/cart.entity';

@Injectable()
export class CartDetailsService {
  constructor(
    @InjectRepository(CartDetail)
    private cartDetailsRepository: Repository<CartDetail>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

  ) { }
 
  findAll() {
    return `This action returns all cartDetails`;
  }

  async addProductToCart(cart: Cart, product_id: number, quantity: number) {
    const product = await this.productsRepository.findOne({ where: { id: product_id } })
    if (!product) {
      throw new BadRequestException('Not found product')
    }
    return this.cartDetailsRepository.save({ cart, quantity: quantity, product })
  }


  findOne(id: number) {
    return `This action returns a #${id} cartDetail`;
  }

  update(id: number, updateCartDetailDto: UpdateCartDetailDto) {
    return `This action updates a #${id} cartDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartDetail`;
  }
}
