import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }


  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    console.log(createReviewDto, req.user.id)
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(+productId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewsService.update(+id, updateReviewDto);
  // }

  @Delete()
  deleteReview(@Body() body: { product_id: number }, @Req() req: any) {
    if (typeof body.product_id !== 'number') {
      throw new BadRequestException('Product ID is required');
    }

    return this.reviewsService.remove(body.product_id, req.user.id);
  }
}
