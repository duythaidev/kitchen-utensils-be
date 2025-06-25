import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) { }
  create(createReviewDto: CreateReviewDto) {
    // const review = await this.reviewsRepository.findOne({ where: { product_id: createReviewDto.product_id, user_id: createReviewDto.user_id } });
    // if (review) {
    //   throw new Error('You have already reviewed this product');
    // }
    return this.reviewsRepository.save(createReviewDto);
  }

  findAll() {
    return this.reviewsRepository.find();
  }

  findOne(id: number) {
    return this.reviewsRepository.findOne({ where: { id } });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.reviewsRepository.update(id, updateReviewDto);
  }

  remove(id: number) {
    return this.reviewsRepository.delete(id);
  }

  async getProductRating(productId: number) {
    const reviews = await this.reviewsRepository.find({ where: { product_id: productId } });
    const rate = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    return { reviews, averageRating: rate };
  }
}
