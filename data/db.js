import mongoose from "mongoose";
import "dotenv/config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;
