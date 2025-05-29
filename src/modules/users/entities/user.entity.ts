import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    user_name: string;

    @Column({ nullable: true })
    age: number;
}
