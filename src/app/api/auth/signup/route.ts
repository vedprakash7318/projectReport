import connectDB from "@/lib/db";
import Auth from "@/models/Auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ✅ Helper function to create user
async function createUser(email: string, password: string) {
  // 1. Check if user exists
  const existingUser = await Auth.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "User already exists" },
      { status: 400 }
    );
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Save user
  const newUser = new Auth({ email, password: hashedPassword });
  await newUser.save();

  return NextResponse.json({
    success: true,
    message: "Signup successful",
    user: { id: newUser._id, email: newUser.email },
  });
}

// ✅ POST method (JSON body)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    return await createUser(email, password);
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ GET method (Query params)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    return await createUser(email, password);
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
