// ✅ Mongoose Model - models/StudentForm.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IStudentForm extends Document {
  userId: string;
  projectId: string;
  personalDetails?: {
    name: string;
    enrollmentNumber: string;
    email: string;
    phone: string;
    certificateNumber: string;
    certificateImage: { url: string; public_id: string };
  };
  collegeInfo?: {
    collegeName: string;
    collegeLogo: { url: string; public_id: string };
    TeacherName: string;
    course: string;
    branch: string;
    session: string;
  };
  projectDetails?: {
    projectName: string;
    projectTitle: string;
    TrainingType: string;
    TeamName: string;
    StartDate: string;
    EndDate: string;
    backendTechnology: string;
    frontendTechnology: string;
    database: string;
    duration: string;
  };
  projectAssets?: {
    projectCode: string[];
    uiScreenshots: { url: string; public_id: string }[];
    dfdDiagram: { url: string; public_id: string };
    erDiagram: { url: string; public_id: string };
  };
  currentStep: number;
  isPrint: number;
  pdfSendStudent:boolean;
  status: "new" | "accept" | "reject" | "isSendToPrint" | "isSendToStudent";
}

const StudentFormSchema = new Schema<IStudentForm>(
  {
    userId: { type: String, required: true },
    projectId: { type: String },
    personalDetails: {
      name: { type: String },
      enrollmentNumber: { type: String },
      email: { type: String },
      phone: { type: String },
      certificateNumber: { type: String },
      certificateImage: { url: { type: String }, public_id: { type: String } },
    },
    collegeInfo: {
      collegeName: { type: String },
      collegeLogo: { url: { type: String }, public_id: { type: String } },
      TeacherName: { type: String },
      course: { type: String },
      branch: { type: String },
      session: { type: String },
    },
    projectDetails: {
      projectName: { type: String },
      projectTitle: { type: String },
      TrainingType: { type: String },
      TeamName: { type: String },
      StartDate: { type: String },
      EndDate: { type: String },
      backendTechnology: { type: String },
      frontendTechnology: { type: String },
      database: { type: String },
      duration: { type: String },
    },
    projectAssets: {
      projectCode: [{ type: String }],
      uiScreenshots: [{ url: { type: String }, public_id: { type: String } }],
      dfdDiagram: { url: { type: String }, public_id: { type: String } },
      erDiagram: { url: { type: String }, public_id: { type: String } },
    },
    currentStep: { type: Number, default: 1 },
    isPrint: { type: Number },
    pdfSendStudent: { type: Boolean ,default:false},
    status: { type: String, enum: ["new", "accept", "reject" ,"isSendToPrint","isSendToStudent"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.models.StudentForm ||
  mongoose.model<IStudentForm>("StudentForm", StudentFormSchema);
