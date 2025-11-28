import { NextRequest, NextResponse } from "next/server";
import StudentForm from "@/models/StudentForm";
import connectDB from "@/lib/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};
// Connect to MongoDB

export async function PATCH(
  request: NextRequest,
   context: RouteParams
) {
 const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ message: "id not found" }, { status: 400 });
  }

  await connectDB();

  try {
    const updated = await StudentForm.findByIdAndUpdate(
      id,
      { $inc: { isPrint: 1 } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Student updated successfully",
      student: updated,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { message: "Error updating student" },
      { status: 500 }
    );
  }
}