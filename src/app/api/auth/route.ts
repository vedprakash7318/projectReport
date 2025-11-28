import connectDB from "@/lib/db";
import Auth from "@/models/Auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const data = await Auth.find()

  return Response.json({ data });
}


