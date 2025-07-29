import { Category } from "src/modules/category/entities/category.entity";
import { ProductImage } from "src/modules/product-images/entities/product-image.entity";
import { Review } from "src/modules/reviews/entities/review.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    product_name: string;

    @Column()
    price: number;

    @Column()
    stock: number;
    
    @Column({nullable: true })
    discounted_price: number;

    @Column({nullable: true })
    description: string;


    @Column({ nullable: true })
    category_id: number;
    
    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;
    

    // relation
    @OneToMany(() => ProductImage, productImage => productImage.product, { cascade: ['remove'], onDelete: 'CASCADE' })
    images: ProductImage[];

    @OneToMany(() => Review, review => review.product, { cascade: ['remove'], onDelete: 'CASCADE' })
    reviews: Review[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }) 
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

}
