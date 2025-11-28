// import { NextRequest, NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     // const folder = formData.get("folder") as string || "general";
//     const publicId = formData.get("publicId") as string | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const uploadOptions = {
//       folder: `student-portal`,
//       ...(publicId && { public_id: publicId }), // For updates
//       overwrite: !!publicId, // Allow overwriting existing files
//       invalidate: true // Refresh CDN cache
//     };

//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         uploadOptions,
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }
//       ).end(buffer);
//     });

//     return NextResponse.json({
//       url: (result as any).secure_url,
//       public_id: (result as any)?.public_id,
//       original_filename: (result as any)?.original_filename
//     });
//   } catch (err) {
//   console.error("Upload error:", err);
//   return NextResponse.json(
//     {
//       error: "Upload failed",
//       details: err instanceof Error ? err.message : "Unknown error occurred"
//     },
//     { status: 500 }
//   );
// }
// }

import { NextRequest, NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
// Multer middleware ko handle karne ke liye helper function
const runMiddleware = (req: NextRequest, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Uploads directory ensure karein with proper error handling
    const uploadsDir = path.join(process.cwd(), "public/uploads");

    // Directory create karein agar nahi hai toh
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("Uploads directory created:", uploadsDir);
    }

    // Check if directory was created successfully
    if (!fs.existsSync(uploadsDir)) {
      throw new Error(`Failed to create directory: ${uploadsDir}`);
    }

    // File details
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Safe filename (special characters remove karein)
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `Digicoders-${uniqueSuffix}-${safeFileName}`;
    const filepath = path.join(uploadsDir, filename);

    // console.log("Saving file to:", filepath);

    // File save karein using promises (better for async)
    await writeFile(filepath, buffer);

    // Verify file was saved
    if (!fs.existsSync(filepath)) {
      throw new Error("File was not saved successfully");
    }

    console.log("File saved successfully:", filename);

    // URL generate karein
    const baseUrl = process.env.NEXTAUTH_URL;
    const fileUrl = `${baseUrl}/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      public_id: filename,
      original_filename: file.name,
      message: "File uploaded successfully",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: err instanceof Error ? err.message : "Unknown error occurred",
        path: process.cwd(),
      },
      { status: 500 }
    );
  }
}

// Optional: GET request for testing
export async function GET() {
  return NextResponse.json({ message: "Upload API is working" });
}
