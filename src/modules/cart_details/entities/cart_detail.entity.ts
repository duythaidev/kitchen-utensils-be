import { Cart } from "src/modules/carts/entities/cart.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class CartDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    product_id: number

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product: Product

    @Column({ default: 1 })
    quantity: number

    @Column()
    cart_id: number

    @ManyToOne(() => Cart, cart => cart.cart_detail)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;
}
