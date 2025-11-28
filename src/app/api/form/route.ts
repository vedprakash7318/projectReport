// ✅ Route Handler - app/api/form/route.ts
import connectDB from "@/lib/db";
import StudentForm from "@/models/StudentForm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { userId, step, data } = body;


  if (!userId || !step || !data) {
    return Response.json({ message: "Missing fields" }, { status: 400 });
  }

  let updateData = {};
  if (step === 1)
    updateData = {
      personalDetails: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        enrollmentNumber: data.enrollmentNumber,
        certificateNumber: data.certificateNumber,
        certificateImage: data.certificateImage || null,
      },
    };
  if (step === 2) updateData = { collegeInfo: data };
  if (step === 3) updateData = { projectDetails: data };
  if (step === 4) {
    // Generate unique projectId
    const projectId = `DCT-${userId}`;
    updateData = {
      projectAssets: data,
      projectId, // <-- add projectId here
    };
  }

  let form = await StudentForm.findOne({ userId });
  if (!form && step === 1) {
    form = await StudentForm.create({
      userId,
      personalDetails: data,
      currentStep: 2,
      status: "new",
    });
  } else if (form) {
    form = await StudentForm.findOneAndUpdate(
      { userId },
      {
        $set: {
          ...updateData,
          currentStep: step + 1,
          status: form.status || "new",
        },
      },
      { new: true }
    );
  } else if (!form && step !== 1) {
    return Response.json({ message: "Form not started yet" }, { status: 400 });
  }

  return Response.json({ message: "Step Saved", form });
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ message: "Missing userId" }, { status: 400 });
  }

  const form = await StudentForm.findOne({ userId });
  return Response.json({ form });
}
