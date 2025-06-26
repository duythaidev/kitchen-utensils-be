import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetail } from './entities/order-detail.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
  ) { }

  create(createOrderDetailDto: CreateOrderDetailDto) {
    const orderDetail = this.orderDetailsRepository.create(createOrderDetailDto);
    return this.orderDetailsRepository.save(orderDetail);
  }

  findAll() {
    return this.orderDetailsRepository.find();
  }

  findOne(id: number) {
    return this.orderDetailsRepository.findOne({ where: { id } });
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return this.orderDetailsRepository.update(id, updateOrderDetailDto);
  }

  remove(id: number) {
    return this.orderDetailsRepository.delete(id);
  }
  async createMany(orderDetails: CreateOrderDetailDto[]) {
    return this.orderDetailsRepository.insert(orderDetails);
  }
}
