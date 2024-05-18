import mongoose from "mongoose"
import { MONGODB_URL } from "../utility/config";

export function connectMongodb(){
  mongoose.set("strictQuery", false);
  mongoose.connect(MONGODB_URL as string, {autoIndex: false})
    .then(() => console.log("MongoDB connected successfully..."))
    .catch((err) => console.log("MongoDB Error just occured " + err))
}

export const connection = mongoose.connection

export default mongoose
