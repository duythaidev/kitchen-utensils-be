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
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class CartDetailsService {

  constructor(
    @InjectRepository(CartDetail)
    private cartDetailsRepository: Repository<CartDetail>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly orderDetailsService: OrderDetailsService,
    private readonly pricingService: PricingService,

  ) { }

  async clearCart(cart: Cart, address: string) {
    const cartItems = await this.cartDetailsRepository.find({ where: { cart: { id: cart.id } } });
    // console.log(cartItems.forEach(item => console.log(item.)));
    const total_price = this.pricingService.calculateTotalVAT(cartItems);
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
    return `This action returns all cartDetails`;
  }

  async addProductToCart(cart: Cart, product_id: number, quantity: number) {
    const product = await this.productsService.findOne(product_id);
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
