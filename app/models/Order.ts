import mongoose from "mongoose";
import { Items } from "./Item";

export interface Orders extends mongoose.Document {
    code: number;
    total: number;
    cart: { 
        [key: string] : {item: Items, quantity: number };
    }
}

const OrderSchema = new mongoose.Schema<Orders>({
  code: {
    type: Number,
    required: [true, "Please provide a number for the order."],
  },
  total: {
    type: Number,
    required: [true, "Please provide a total for the order"],
  },
  cart: {
    required: [true, "Please provide the cart info for the order"],
  }
});

export default mongoose.models.Order || mongoose.model<Orders>("Order", OrderSchema);