import mongoose from "mongoose";

export interface Items extends mongoose.Document {
  name: string;
  category: string;
  price: number;
}

const ItemSchema = new mongoose.Schema<Items>({
  name: {
    type: String,
    required: [true, "Please provide a name for the item."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category for the item."],
    maxlength: [60, "Category cannot be more than 200 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price for the item."]
  }
});

export default mongoose.models.Item || mongoose.model<Items>("Item", ItemSchema);