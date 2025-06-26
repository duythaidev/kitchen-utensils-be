import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image_url: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    product_id: number;

    @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ default: false })
    isMain: boolean;
}
