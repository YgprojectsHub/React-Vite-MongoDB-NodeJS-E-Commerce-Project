dotenv.config();
import mongoose from "mongoose";
import dotenv from "dotenv";
import { logError } from "../helper/logError.js";

const db_link = process.env.DB_LINK;

const options = {
  maxPoolSize: 10, // Havuzdaki maksimum bağlantı sayısı
  minPoolSize: 5,  // Havuzdaki minimum bağlantı sayısı
  maxIdleTimeMS: 30000, // Bağlantının ne kadar süre boşta kalabileceği (ms)
  // connectTimeoutMS: 10000,
  // socketTimeoutMS: 45000,
};

const connect = async () => {
  try {
    await mongoose.connect(db_link, options);
    console.log("Connected to MongoDB. ☘️");
  } catch (err) {
    
    const errData = {
      base: "CONNECT",
      error: {
        message: err.message,
        stack: err.stack,
      },
    };

    logError(errData, true);
  }
};

export default connect;
