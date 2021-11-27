import mongoose, { Schema } from "mongoose";
import { DB_PASSWORD, DB_USER, DB_URI } from "./env";

main().catch((err) => console.log(err));

async function main() {
  const conn = await mongoose.connect(
    `mongodb+srv://${DB_URI}?retryWrites=true&w=majority`,
    {
      user: DB_USER,
      pass: DB_PASSWORD,
    }
  );
  const userSchema = new Schema({ name: String, email: String });
  const UserModel = conn.model("User", userSchema);
  console.log("Connected to MongoDB");
}
