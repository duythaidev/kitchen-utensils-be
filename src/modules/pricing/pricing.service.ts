import { Injectable } from "@nestjs/common";
import { CartDetail } from "src/modules/cart_details/entities/cart_detail.entity";

@Injectable()
export class PricingService {
  calculateTotalVAT(cartItems: CartDetail[]): number {
    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const vat = subtotal * 0.1;
    return subtotal + vat;
  }
}