import mongoose from "mongoose";
import { OrderData } from "../types";
import { CartItem } from "../types";
export interface IOrderDataModel extends OrderData, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

export const MinimizedItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for the item."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price for the item."]
  }
});

const CartItemSchema = new mongoose.Schema<CartItem>({
  item: {
    type: MinimizedItemSchema,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema<IOrderDataModel>(
  {
    code: {
      type: Number,
      required: [true, "Please provide a numeric code for the order."],
    },
    status: {
      type: Number,
      required: [true, "Please provide a number for the status (1 - To pay; 2 - Payed; 3 - To produce; 4 - Done; 5 - Closed)"],
      default: 1,
      enum: [1, 2, 3, 4, 5],
    },
    total: {
      type: Number,
      required: [true, "Please provide a total for the order"],
    },
    cart: {
      type: Map,
      of: CartItemSchema,
      required: [true, "Please provide the cart info for the order"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrderDataModel>("Order", OrderSchema);
