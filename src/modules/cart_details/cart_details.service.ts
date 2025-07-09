import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCartDetailDto } from './dto/update-cart_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartDetail } from './entities/cart_detail.entity';
import { Cart } from '../carts/entities/cart.entity';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

@Injectable()
export class CartDetailsService {

  constructor(
    @InjectRepository(CartDetail)
    private cartDetailsRepository: Repository<CartDetail>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly orderDetailsService: OrderDetailsService,
  ) { }

  async clearCart(cart: Cart, address: string) {
    console.log('>>> cart', cart)
    const cartItems = await this.cartDetailsRepository.find({
      where: {
        cart_id: cart.id
      },
      relations: {
        product: true
      }
    });
    // console.log(cartItems.forEach(item => console.log(item.)));
    console.log('>>> cartItems', cartItems)
    const total_price = cartItems.reduce((total, item) => total + (item.product?.discounted_price || item.product?.price) * item.quantity, 0);
    console.log('>>> total_price', total_price)
    const createOrderDto: CreateOrderDto = {
      address,
      total_price,
      user_id: cart.user.id
    }
    // Tạo order
    const newOrder = await this.ordersService.create(createOrderDto)
    // Thêm chi tiết đơn hàng vào
    const cartDetailEntities = await this.orderDetailsService.createMany(cartItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    })));

    // await this.orderDetailsService.createMany(cartDetailEntities);
    await this.cartDetailsRepository.remove(cartItems)
    return newOrder;
  }

  findAll() {
    return this.cartDetailsRepository.find()
  }

  getProductsInCart(cart_id: number) {
    return this.cartDetailsRepository.find(
      {
        where: { cart_id },
        relations: {
          product: { // product : true
            images: true // product relations : {images: true}
          },
        }
      })
  }

  async addProductToCart(cart: Cart, product_id: number, quantity: number) {
    const product = await this.productsService.findOne(product_id);
    if (!product) {
      throw new BadRequestException('Not found product')
    }
    const cartDetail = await this.cartDetailsRepository.findOne({ where: { cart_id: cart.id, product_id } })
    if (cartDetail) {
      cartDetail.quantity += quantity
      return this.cartDetailsRepository.save(cartDetail)
    }
    return this.cartDetailsRepository.save({ cart, quantity: quantity, product })
  }


  findOne(id: number) {
    return `This action returns a #${id} cartDetail`;
  }

  update(updateCartDetailDto: UpdateCartDetailDto) {
    return this.cartDetailsRepository.update(updateCartDetailDto.product_id, { quantity: updateCartDetailDto.quantity })
  }

  updateQuantity(product_id: number, quantity: number, cart_id: number) {
    return this.cartDetailsRepository.update({ cart_id, product_id }, {
      quantity
    })
  }

  removeProductFromCart(product_id: number, cart_id: number) {
    return this.cartDetailsRepository.delete({ cart_id, product_id })
  }
}
