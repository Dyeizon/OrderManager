// eslint-disable-next-line
import mongoose, { CallbackError } from "mongoose";
import bcrypt from 'bcrypt';

export interface Users extends mongoose.Document {
  username: string;
  password: string;
  privilegeLevel: number;
}

const UserSchema = new mongoose.Schema<Users>({
  username: {
    type: String,
    required: [true, "Please provide a name for the user."],
    maxlength: [60, "Name cannot be more than 60 characters"],
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: [true, "Please provide a password for the item."],
  },
  privilegeLevel: {
    type: Number,
    required: [true, "Please provide a privilege level for the item."],
    default: 1,
    enum: [1, 2, 3],
  }
});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
        // eslint-disable-next-line
    } catch (error: CallbackError | any) {
        next(error);
    }
})

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);