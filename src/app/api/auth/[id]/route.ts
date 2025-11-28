import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Auth from "@/models/Auth";
import bcrypt from "bcryptjs";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 Important
) {
  try {
    const { id } = await context.params; // ✅ params ko await karna padta hai

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await Auth.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ yahan bhi await karna hai
    const { password, oldPassword } = await req.json();

    if (!oldPassword) {
      return NextResponse.json(
        { error: "Old password is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await Auth.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Error updating password" },
      { status: 500 }
    );
  }
}
