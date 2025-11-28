import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token required" },
        { status: 401 }
      );
    }

    // ✅ Verify token
    const secret = process.env.JWT_SECRET || "your_secret_key";
    try {
      const decoded = jwt.verify(token, secret);
      return NextResponse.json({
        success: true,
        message: "Token is valid",
        user: decoded,
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Token verify error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
