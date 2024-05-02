import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserModel extends Document {
  _id: Types.ObjectId;
  username: string;
  eloRating: number;
  rankingPlace: number;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  eloRating: {
    type: Number,
    default: 1200,
  },
  rankingPlace: {
    type: Number,
    default: null,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v: string) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  if (typeof this.password === 'string') {
    this.password = await bcrypt.hash(this.password, salt);
  }
  this.updatedAt = new Date();
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};



export const User = mongoose.model<IUserModel>('User', userSchema);
