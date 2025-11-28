// ✅ Mongoose Model - models/StudentForm.ts
import mongoose, { Schema, Document } from "mongoose";

export interface Auth extends Document {
  email: string;
  password: string;
}

const AuthSchema = new Schema<Auth>(
  {
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Auth ||
  mongoose.model<Auth>("Auth", AuthSchema);
