import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartDetailsService } from './cart_details.service';
import { CreateCartDetailDto } from './dto/create-cart_detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart_detail.dto';

@Controller('cart-details')
export class CartDetailsController {
  constructor(private readonly cartDetailsService: CartDetailsService) {}

  // @Get()
  // findAll() {
  //   return this.cartDetailsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartDetailsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDetailDto: UpdateCartDetailDto) {
  //   return this.cartDetailsService.update(+id, updateCartDetailDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartDetailsService.removeProductFromCart(+id);
  // }
}
