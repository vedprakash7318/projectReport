import connectDB from "@/lib/db";
import StudentForm from "@/models/StudentForm";
import { NextRequest } from "next/server";
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  const { id } = await context.params;
  await connectDB();
  const { status } = await request.json();

  if (!["new", "accept", "reject","isSendToPrint","isSendToStudent"].includes(status)) {
    return Response.json({ message: "Invalid status" }, { status: 400 });
  }

  const updated = await StudentForm.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) {
    return Response.json({ message: "Student not found" }, { status: 404 });
  }

  return Response.json({ message: "Status updated successfully", student: updated });
}
