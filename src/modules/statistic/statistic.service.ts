import { BadRequestException, Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { MoreThan } from 'typeorm';

@Injectable()
export class StatisticService {
    constructor(
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
        private readonly ordersService: OrdersService,
    ) { }

    async getStatisticsThisMonth() {

        const ordersIn2Month = await this.ordersService.findAllWithCondition({
            where: {
                status: 'delivered',
                created_at: MoreThan(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
            },
        });
        const newUsersIn2Month = await this.usersService.findAllWithCondition({
            where: {
                created_at: MoreThan(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
            },
        });
        
        // console.log(ordersIn2Month, newUsersIn2Month);
        // so luong don hang trong 2 thang
        const ordersThisMonth = ordersIn2Month.filter((order) => order.created_at > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const ordersLastMonth = ordersIn2Month.filter((order) => order.created_at < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        
        // so luong don hang da huy trong 2 thang
        const cancledOrdersThisMonth = ordersThisMonth.filter((order) => order.status === 'cancelled');
        const cancledOrdersLastMonth = ordersLastMonth.filter((order) => order.status === 'cancelled');
        
        // tong doanh thu trong 2 thang
        const totalRevenueThisMonth = ordersThisMonth.reduce((acc, order) => acc + order.total_price, 0);
        const totalRevenueLastMonth = ordersLastMonth.reduce((acc, order) => acc + order.total_price, 0);

        // so luong user trong 2 thang
        const usersThisMonth = newUsersIn2Month.filter((user) => user.created_at > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const usersLastMonth = newUsersIn2Month.filter((user) => user.created_at < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        
        return {
            revenue: { totalRevenue: totalRevenueThisMonth, percent: totalRevenueLastMonth ? (totalRevenueThisMonth - totalRevenueLastMonth / totalRevenueLastMonth) * 100 : 0 },
            users: { totalUsers: usersThisMonth.length, percent: usersLastMonth.length ? (usersThisMonth.length - usersLastMonth.length / usersLastMonth.length) * 100 : 0 },
            orders: { totalOrders: ordersThisMonth.length, percent: ordersLastMonth.length ? (ordersThisMonth.length - ordersLastMonth.length / ordersLastMonth.length) * 100 : 0 },
            cancledOrders: { totalCancledOrders: cancledOrdersThisMonth.length, percent: cancledOrdersLastMonth.length ? (cancledOrdersThisMonth.length - cancledOrdersLastMonth.length / cancledOrdersLastMonth.length) * 100 : 0 },
        };
    }
    async getPeriodStatistics(query: any) {
        if (!query.range || !['7d', '30d', '90d'].includes(query.range)) {
            throw new BadRequestException('Invalid range parameter');
        }
        return this.ordersService.getRevenueStats(query.range);
    }
}
