import { Product } from "src/modules/products/entities/product.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Entity } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    category_name: string;

    @Column({ nullable: true })
    image_url: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[]
}
