import mongoose from "mongoose";

export const connect = async () => {
 const { connection } = await mongoose.connect(process.env.MONGO_URI);
 console.log(`MongoDB connected with ${connection.host}`);
};
