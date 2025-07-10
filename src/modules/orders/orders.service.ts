import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Like, Repository } from 'typeorm';
import { FilterOrderDto } from './dto/filter-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) { }

  create(createOrderDto: CreateOrderDto) {
    return this.orderRepository.save(createOrderDto);
  }

  async getFilteredOrders(filterDto: FilterOrderDto) {
    const { keyword, page, limit } = filterDto;

    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 10;

    const where: any = {};

    if (keyword) {
      where.user.user_name = Like(`%${keyword.toLowerCase()}%`);
    }

    const [result, total] = await this.orderRepository.findAndCount(
      {
        where,
        take: limitNumber,
        skip: (pageNumber - 1) * limitNumber,
        relations: {
          user: true,
          orderDetails: {
            product: {
              images: true,
            },
          },
        },
      }
    );

    return {
      data: result,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber
      }
    };
  }


  findAll() {
    return this.orderRepository.find({
      relations: {
        user: true,
        orderDetails: {
          product: {
            images: true,
          },
        },
      },
    });
  }

  findAllWithCondition(query: any) {
    return this.orderRepository.find(query);
  }

  findOne(id: number) {
    return this.orderRepository.findOne({ where: { id } });
  }

  findUserOrdersHistory(user_id: number) {
    return this.orderRepository.find({
      where: { user_id },
      relations: {
        orderDetails: {
          product: {
            images: true,
          },
        },
      }
    });
  }

  updateStatus(id: number, status: string) {
    return this.orderRepository.update(id, { status });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.update(id, updateOrderDto);
  }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }
}
