import mongoose from "mongoose";
import "dotenv/config";

//const username = process.env.MONGO_USERNAME;
//const password = process.env.MONGO_PASSWORD;
//console.log(username, password);
const connString = process.env.MONGO_CONNSTRING;

export async function connect() {
  try {
    await mongoose.connect(connString, { useNewUrlParser: true });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.log(error);
  }
}
