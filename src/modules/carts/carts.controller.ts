import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  create(@Body() user_id: number) {
    return this.cartsService.create(user_id);
  }

  @Post()
  addToCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.addToCart(updateCartDto);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') user_id: string) {
    return this.cartsService.findOne(+user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
