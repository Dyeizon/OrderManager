import mongoose from "mongoose";

export interface Counters extends mongoose.Document {
  _id: string,
  sequence_number: number,
}

export const CountersSchema = new mongoose.Schema<Counters>({
  _id: {
    type: String, 
    required: [true, "Please provide a name for the counter."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  sequence_number: {
    type: Number,
    required: [true, "Please provide a sequence number for the counter"],
  }
});

export default mongoose.models.Counters || mongoose.model<Counters>("Counters", CountersSchema);