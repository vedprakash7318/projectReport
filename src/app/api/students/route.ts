// import connectDB from "@/lib/db";
// import StudentForm from "@/models/StudentForm";
// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   await connectDB();

//   const { searchParams } = new URL(req.url);
//   const status = searchParams.get("status");

//   let filter = {};
//   if (status) {
//     filter = { status };
//   }

//   try {
//     const students = await StudentForm.find(filter).sort({ createdAt: -1 });
//     return Response.json({ students });
//   } catch (error) {
//     return Response.json({ message: "Error fetching students" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';

import Student from '@/models/StudentForm';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    
    // Filter parameters
    const status = searchParams.get('status') || 'new';
    const search = searchParams.get('search') || '';
    const college = searchParams.get('college') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const prints = searchParams.get('prints') || 'all';
    
    // Build filter object
    const filter: any = { status };
    
    // Search filter
    if (search) {
      filter.$or = [
        { 'personalDetails.name': { $regex: search, $options: 'i' } },
        { 'projectId': { $regex: search, $options: 'i' } },
        { 'personalDetails.phone': { $regex: search, $options: 'i' } },
        { 'personalDetails.enrollmentNumber': { $regex: search, $options: 'i' } },
        { 'collegeInfo.collegeName': { $regex: search, $options: 'i' } }
      ];
    }
    
    // College filter
    if (college) {
      filter['collegeInfo.collegeName'] = college;
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }
    
    // Print status filter
    if (prints !== 'all') {
      if (prints === 'printed') {
        filter.isPrint = { $gt: 0 };
      } else if (prints === 'not_printed') {
        filter.isPrint = 0;
      }
    }
    
    // Get total count for pagination
    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit);
    
    // Fetch students with filters, sort, and pagination
    const students = await Student.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      students,
      currentPage: page,
      totalPages,
      totalStudents,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}