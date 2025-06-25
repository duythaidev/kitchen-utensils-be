import { Order } from 'src/modules/orders/entities/order.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity()
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @ManyToOne(() => Order, (order) => order.orderDetails)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    product_id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()   
    quantity: number;

    @Column()
    price: number; // giá tại thời điểm mua
}
