import { NextRequest, NextResponse } from "next/server";
import StudentForm from "@/models/StudentForm";
import connectDB from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // params को await करना ज़रूरी है
  const { id } = await context.params;

  const body = await request.json();
  const { pdfSendStudent } = body;

  if (typeof pdfSendStudent === "undefined") {
    return NextResponse.json(
      { message: "pdfSendStudent is required" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const updated = await StudentForm.findByIdAndUpdate(
      id,
      { pdfSendStudent },
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
