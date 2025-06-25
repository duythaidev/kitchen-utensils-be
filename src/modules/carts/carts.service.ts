import { BadRequestException, Injectable } from '@nestjs/common';
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
    private readonly cartDetailsService: CartDetailsService
  ) { }

  async create(user_id: number) {

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

  async checkOut(user_id: number, address:string) {
    const cart = await this.cartsRepository.findOne({ where: { id: user_id } });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    return this.cartDetailsService.clearCart(cart, address);
  }
}
