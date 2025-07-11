import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, Like, Repository } from 'typeorm';
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


  async getRevenueStats(range: '7d' | '30d' | '90d') {
    const now = new Date();
    const endDate = new Date(now); // giữ lại mốc hiện tại
    let startDate: Date;
    let totalDays = 7;

    if (range === '7d') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6); // lấy 7 ngày bao gồm hôm nay
      totalDays = 7;
    } else if (range === '30d') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29); // 30 ngày
      totalDays = 30;
    } else {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 89); // 90 ngày
      totalDays = 90;
    }

    const orders = await this.orderRepository.find({
      where: {
        created_at: Between(startDate, endDate),
        status: 'delivered',
      },
      select: ['created_at', 'total_price'],
    });

    // Gom revenue theo ngày
    const revenueByDate: Record<string, number> = {};

    for (const order of orders) {
      const dateStr = order.created_at.toISOString().slice(0, 10); // YYYY-MM-DD
      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + order.total_price;
    }

    // Tạo danh sách ngày liên tục để đảm bảo không thiếu ngày
    const result: { date: string; revenue: number }[] = [];

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      result.push({
        date: key,
        revenue: revenueByDate[key] || 0,
      });
    }

    return result;
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
