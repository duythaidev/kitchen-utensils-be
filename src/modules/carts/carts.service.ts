import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartDetailsService } from '../cart_details/cart_details.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartsService {

  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    private readonly usersService: UsersService,
    private readonly cartDetailsService: CartDetailsService,
  ) { }

  private async create(user_id: number) {

    const cart = await this.findOne(user_id)
    if (cart) {
      throw new BadRequestException('Cart already exits')
    }
    const user = await this.usersService.findOne(user_id);
    if (!user) {
      throw new BadRequestException('Not found user')
    }
    return this.cartsRepository.save({ user });
  }

  findAll() {
    return this.cartsRepository.find();
  }

  async findOne(user_id: number) {
    return this.cartsRepository.findOne({ where: { user_id } });
  }

  

  async addToCart(updateCartDto: UpdateCartDto, user_id: number) {
    // Tim cart
    let cart = await this.findOne(user_id);

    // Ko thay thi tao
    if (!cart) {
      cart = await this.create(user_id)
    }

    return this.cartDetailsService.addProductToCart(cart, updateCartDto.product_id, updateCartDto.quantity)
  }

  async getProducstInCart(user_id: number) {
    let cart = await this.findOne(user_id);
    // console.log("cart", cart)
    // Ko thay thi tao
    if (!cart) {
      cart = await this.create(user_id)
    }
    return this.cartDetailsService.getProductsInCart(cart.id)
  }

  async removeFromCart(product_id: number, user_id: number) {
    const cart = await this.findOne(user_id)
    if (!cart) {
      throw new BadRequestException('Cart not found')
    }
    return this.cartDetailsService.removeProductFromCart(product_id, cart.id)
  }

  async updateQuantity(product_id: number, quantity: number, user_id: number) {

    const cart = await this.findOne(user_id)
    if (!cart) {
      throw new BadRequestException('Cart not found')
    }
    return this.cartDetailsService.updateQuantity(product_id, quantity, cart.id)
  }

  async checkOut(user_id: number, address: string) {
    const cart = await this.cartsRepository.findOne({ where: { user_id },
      relations: {
        user: true
      }
    });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    return this.cartDetailsService.clearCart(cart, address);
  }
}
