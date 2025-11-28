import connectDB from "@/lib/db";
import StudentForm from "@/models/StudentForm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  if (!status) {
    return Response.json({ message: "Missing status" }, { status: 400 });
  }

  const count = await StudentForm.countDocuments({ status });
  return Response.json({ count });
}
