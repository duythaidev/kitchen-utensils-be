import { Cart } from "src/modules/carts/entities/cart.entity";
import { PrimaryGeneratedColumn, Column, Entity, UpdateDateColumn, CreateDateColumn, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    user_name?: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ nullable: true })
    address?: string;

    // @Column({
    //     nullable: true,
    //     type: "longblob",
    // })
    // avatar?: Buffer

    @Column({ nullable: true })
    avatar_url?: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;

}
