import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI: string | undefined = process.env.MONGO_CONNECTION_STRING;

const connectDB = async (): Promise<void> => {
  try {
    if (!mongoURI) {
      throw new Error("MongoDB connection string is not defined in environment variables.");
    }
    await mongoose.connect(mongoURI);
    console.log(`MongoDB connected`);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Connection error: ${err.message}`);
    } else {
      console.error(`An unexpected error occurred`);
    }
    process.exit(1);
  }
};

export default connectDB;
