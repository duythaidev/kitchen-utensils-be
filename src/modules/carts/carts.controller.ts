import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Post()
  addToCart(@Body() updateCartDto: UpdateCartDto, @Req() req: any) {
    console.log(updateCartDto, 'req.user', req.user)
    return this.cartsService.addToCart(updateCartDto, req.user.id);
  }

  // @Get()
  // findAll() {
  //   return this.cartsService.findAll();
  // }


  @UseGuards(JwtAuthGuard)
  @Get() 
  getCart(@Req() req: any) {
    console.log(req.user)
    return this.cartsService.getProducstInCart(req.user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') user_id: string) {
  //   return this.cartsService.findOne(+user_id);
  // }

  @Get(':id')
  getProductsInCart(@Param('id') user_id: string) {
    return this.cartsService.getProducstInCart(+user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.cartsService.removeFromCart(+id, req.user.id);
  }

  @Post('checkout')
  async checkout(@Body() body: { userId: number; address: string }) {
    const { userId, address } = body;
    return this.cartsService.checkOut(userId, address);
  }
}
