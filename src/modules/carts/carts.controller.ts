import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  // @Post()
  // create(@Body() user_id: number) {
  //   return this.cartsService.create(user_id);
  // }


  @Post()
  addToCart(@Body() updateCartDto: UpdateCartDto, @Req() req: any) {
    console.log(updateCartDto, 'req.user', req.user)
    return this.cartsService.addToCart(updateCartDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }


  // 
  // @Get() 
  // getCart(@Req() req: any) {
  //   console.log(req.user)
  //   return this.cartsService.getProducstInCart(req.user.id);
  // }


  @Get('me')
  getCartMe(@Req() req: any) {
    return this.cartsService.getProducstInCart(req.user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') user_id: string) {
  //   return this.cartsService.findOne(+user_id);
  // }

  // @Get(':id')
  // getProductsInCart(@Param('id') user_id: string) {
  //   return this.cartsService.getProducstInCart(+user_id);
  // }

  @Delete()
  remove(@Body() body: { product_id: number }, @Req() req: any) {
    console.log(body, 'body', req.user.id)

    return this.cartsService.removeFromCart(body.product_id, req.user.id);
  }

  @Put()
  updateQuantity(@Body() body: { product_id: number, quantity: number }, @Req() req: any) {
    return this.cartsService.updateQuantity(body.product_id, body.quantity, req.user.id);
  }


  @Post('checkout')
  async checkout(@Body() body: { address: string }, @Req() req: any) {
    const { address } = body;
    // console.log('>>> req.user', req.user, 'address', address)
    return this.cartsService.checkOut(req.user.id, address);
  }
}
