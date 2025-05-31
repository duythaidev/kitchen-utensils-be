import { CartDetail } from "src/modules/cart_details/entities/cart_detail.entity";
import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, { cascade: true }) // specify inverse side as a second parameter
    @JoinColumn({ name: "user_id" })  // This matches @PrimaryColumn name
    user: User

    @OneToMany(() => CartDetail, (cart_detail) => cart_detail.cart)
    cart_detail: CartDetail[]
}