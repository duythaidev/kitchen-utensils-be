import { PrimaryGeneratedColumn, Column, Entity, UpdateDateColumn, CreateDateColumn, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    user_name?: string;

    @Column({ default: true, nullable: true })
    is_active: boolean;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true , default: "user"})
    role?: string;

    @Column({ nullable: true , default: "local"})
    auth_provider?: string;

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
