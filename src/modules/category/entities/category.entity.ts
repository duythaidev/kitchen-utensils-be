import { Product } from "src/modules/products/entities/product.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    category_name: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[]
}
