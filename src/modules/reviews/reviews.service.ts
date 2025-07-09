import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) { }

  async create(createReviewDto: CreateReviewDto, userId: number) {
    try {
      const existingReview = await this.reviewRepository.findOne({
        where: {
          user_id: userId,
          product_id: createReviewDto.product_id,
        },
      });

      if (existingReview) {
        throw new BadRequestException('You have already reviewed this product');
      }

      const review = this.reviewRepository.create({
        ...createReviewDto,
        user_id: userId,
      });
      
      return await this.reviewRepository.save(review)
    } catch (error) {
      Logger.log("error", error)
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create review');
    }
  }

  async findAll() {
    try {
      return await this.reviewRepository.find({
        relations: {
          user: true,
          product: true,
        },
        order: {
          created_at: 'DESC',
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch reviews');
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id },
        relations: {
          user: true,
          product: true,  
        },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      return review;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch review');
    }
  }

  async findByProduct(productId: number) {
    try {
      return await this.reviewRepository.find({
        where: { product_id: productId },
        relations: {
          user: true,
          product: true,
        },
        order: {
          created_at: 'DESC',
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch product reviews');
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      if (review.user_id !== userId) {
        throw new BadRequestException('You can only update your own reviews');
      }

      await this.reviewRepository.update(id, updateReviewDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update review');
    }
  }

  async remove( productId: number, userId: number) {
    try {
      const review = await this.reviewRepository.findOne({
        where: { product_id: productId, user_id: userId },
      });

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      if (review.user_id !== userId) {
        throw new BadRequestException('You can only delete your own reviews');
      }

      await this.reviewRepository.delete(review.id);
      return { message: 'Review deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete review');
    }
  }

  async getProductRating(productId: number) {
    const reviews = await this.reviewRepository.find({ where: { product_id: productId } });
    const rate = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    return { reviews, averageRating: rate };
  }
}
