import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudentForm from "@/models/StudentForm";
import cloudinary from "@/lib/cloudinary";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  const { id } = await context.params;

  await connectDB();

  try {
    const student = await StudentForm.findById(id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { message: "Error fetching student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const body = await request.json();
    const updated = await StudentForm.findByIdAndUpdate(id, body, { new: true });

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
// export async function PATCH(
//   request: NextRequest,
//   context: RouteParams
// ) {
//   const { id } = await context.params;
//   await connectDB();
// if (!id) {
//       return NextResponse.json({ message: "id not found" }, { status: 400 });
//     }
//   try {
//     const updated = await StudentForm.findByIdAndUpdate(id, { $inc: { isPrint: 1 } }, { new: true });

//     if (!updated) {
//       return NextResponse.json({ message: "Student not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: "Student updated successfully",
//       student: updated,
//     });
//   } catch (error) {
//     console.error("Error updating student:", error);
//     return NextResponse.json(
//       { message: "Error updating student" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const student = await StudentForm.findById(id);

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Delete collegeLogo
    const collegeLogoId = student.collegeInfo?.collegeLogo?.public_id;
    if (collegeLogoId) {
      try {
        await cloudinary.uploader.destroy(collegeLogoId);
      } catch (error) {
        console.error("Error deleting college logo from Cloudinary:", error);
      }
    }

    // Delete uiScreenshots
    const uiScreenshots = student.projectAssets?.uiScreenshots || [];
    for (const img of uiScreenshots) {
      if (img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error("Cloudinary delete error (uiScreenshot):", err);
        }
      }
    }

    // Delete dfdDiagram
    const dfdId = student.projectAssets?.dfdDiagram?.public_id;
    if (dfdId) {
      try {
        await cloudinary.uploader.destroy(dfdId);
      } catch (err) {
        console.error("Cloudinary delete error (dfdDiagram):", err);
      }
    }

    // Delete erDiagram
    const erId = student.projectAssets?.erDiagram?.public_id;
    if (erId) {
      try {
        await cloudinary.uploader.destroy(erId);
      } catch (err) {
        console.error("Cloudinary delete error (erDiagram):", err);
      }
    }

    // Delete student from DB
    await StudentForm.findByIdAndDelete(id);

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { message: "Error deleting student" },
      { status: 500 }
    );
  }
}