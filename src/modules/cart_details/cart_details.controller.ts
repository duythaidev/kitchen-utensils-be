import { Controller, Get, Body, Put } from '@nestjs/common';
import { CartDetailsService } from './cart_details.service';
import { UpdateCartDetailDto } from './dto/update-cart_detail.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart-details')
export class CartDetailsController {
  constructor(private readonly cartDetailsService: CartDetailsService) {}

  @Get()
  findAll() {
    return this.cartDetailsService.findAll();
  }

  @Put()
  update(@Body() updateCartDetailDto: UpdateCartDetailDto) {
    return this.cartDetailsService.update(updateCartDetailDto);
  }
}
