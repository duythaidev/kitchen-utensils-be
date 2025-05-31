import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { CartDetail } from '../cart_details/entities/cart_detail.entity';
import { Product } from '../products/entities/product.entity';
import { CartDetailsService } from '../cart_details/cart_details.service';

@Injectable()
export class CartsService {

  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CartDetail)
    private cartDetailsRepository: Repository<CartDetail>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly cartDetailsService: CartDetailsService


  ) { }

  async create(user_id: number) {

    const cart = await this.findOne(user_id)
    if (cart) {
      throw new BadRequestException('Cart already exits')
    }
    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new BadRequestException('Not found user')
    }
    return this.cartsRepository.save({ user });
  }

  findAll() {
    return `This action returns all carts`;
  }

  async findOne(user_id: number) {
    return this.cartsRepository.findOne({ where: { id: user_id } });
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  async addToCart(updateCartDto: UpdateCartDto) {
    // Tim cart
    let cart = await this.cartsRepository.findOne({ where: { id: updateCartDto.user_id } });

    // Ko thay thi tao
    if (!cart) {
      cart = await this.create(updateCartDto.user_id)
    }

    return this.cartDetailsService.addProductToCart(cart, updateCartDto.product_id, updateCartDto.quantity)
  }

  removeFromCart(updateCartDto: UpdateCartDto) {

    return `This action updates a #${updateCartDto.product_id} cart`;
  }
}
