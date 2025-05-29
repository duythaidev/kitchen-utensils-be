import { Category } from "src/modules/category/entities/category.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";

export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_name: string;

    @ManyToOne(() => Category, category => category.products)
    category: Category;

}
