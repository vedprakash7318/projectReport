"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";
import { ArrowLeft, Eye, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  interface PersonalDetails {
    name?: string;
    enrollmentNumber?: string;
    email?: string;
    phone?: string;
    certificateNumber?: string;
    certificateImage?: { url?: string; public_id?: string };
    // ...aur fields agar hain
  }
  interface CollegeInfo {
    collegeName?: string;
    TeacherName?: string;
    course?: string;
    branch?: string;
    session?: string;
    collegeLogo?: { url?: string; public_id?: string; name?: string };
  }
  interface ProjectDetails {
    projectName?: string;
    TrainingType?: string;
    TeamName?: string;
    StartDate?: string;
    EndDate?: string;
    backendTechnology?: string;
    frontendTechnology?: string;
    database?: string;
    duration?: string;
  }
  interface ProjectAssets {
    projectCode?: string[];
    dfdDiagram?: { url?: string; public_id?: string; name?: string };
    certificate?: { url?: string; public_id?: string; name?: string };
    erDiagram?: { url?: string; public_id?: string; name?: string };
    uiScreenshots?: { url?: string; public_id?: string; name?: string }[];
  }
  interface StudentFormType {
    personalDetails?: PersonalDetails;
    collegeInfo?: CollegeInfo;
    projectDetails?: ProjectDetails;
    projectAssets?: ProjectAssets;
    status?: string;
    // ...aur fields agar hain
  }
  const [form, setForm] = useState<StudentFormType | null>(null);
  const [loading, setLoading] = useState(true);
  // console.log(form);

  useEffect(() => {
    fetch(`/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data.student);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [studentId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Special handling for projectCode array
    if (name.startsWith("projectAssets.projectCode")) {
      const indexMatch = name.match(/\[(\d+)\]/);
      if (indexMatch) {
        const index = parseInt(indexMatch[1]);
        setForm((prev: any) => {
          const safePrev = prev || {};
          const safeProjectAssets = safePrev.projectAssets || {};
          const safeProjectCode = Array.isArray(safeProjectAssets.projectCode)
            ? safeProjectAssets.projectCode
            : ["", "", "", "", ""]; // ya jitne bhi code slots chahiye

          return {
            ...safePrev,
            projectAssets: {
              ...safeProjectAssets,
              projectCode: safeProjectCode.map((item: string, i: number) =>
                i === index ? value : item
              ),
            },
          };
        });
        return;
      }
    }

    if (name.startsWith("personalDetails.")) {
      setForm((prev: any) => ({
        ...(prev || {}),
        personalDetails: {
          ...(prev?.personalDetails || {}),
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.startsWith("collegeInfo.")) {
      setForm((prev: any) => ({
        ...(prev || {}),
        collegeInfo: {
          ...(prev?.collegeInfo || {}),
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.startsWith("projectDetails.")) {
      setForm((prev: any) => ({
        ...(prev || {}),
        projectDetails: {
          ...(prev?.projectDetails || {}),
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.startsWith("projectAssets.")) {
      setForm((prev: any) => ({
        ...(prev || {}),
        projectAssets: {
          ...(prev?.projectAssets || {}),
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setForm((prev: any) => ({
        ...(prev || {}),
        [name]: value,
      }));
    }
  };
  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", field); // dynamic folder name

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      // console.log(data);

      if (field === "collegeLogo") {
        setForm((prev: any) => ({
          ...(prev || {}),
          collegeInfo: {
            ...(prev?.collegeInfo || {}),
            [field]: {
              url: data.url,
              public_id: data.public_id,
            },
          },
        }));
      }

      setForm((prev: any) => ({
        ...(prev || {}),
        projectAssets: {
          ...(prev?.projectAssets || {}),
          [field]: {
            url: data.url,
            public_id: data.public_id,
            name: data.original_filename,
          },
        },
      }));
    }
  };

  const handleMultipleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", field);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        return {
          url: data.url,
          public_id: data.public_id,
          name: data.original_filename,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      setForm((prev: any) => ({
        ...(prev || {}),
        projectAssets: {
          ...(prev?.projectAssets || {}),
          [field]: [
            ...((prev?.projectAssets?.[field] as any[]) || []),
            ...uploadedFiles,
          ],
        },
      }));
    }
  };

  const removeAsset = (field: string, index?: number) => {
    setForm((prev: any) => {
      const safePrev = prev || {};
      const safeProjectAssets = safePrev.projectAssets || {};

      if (typeof index === "number") {
        // Remove specific item from array (for screenshots)
        const currentAssets = Array.isArray(safeProjectAssets[field])
          ? [...safeProjectAssets[field]]
          : [];
        currentAssets.splice(index, 1);
        return {
          ...safePrev,
          projectAssets: {
            ...safeProjectAssets,
            [field]: currentAssets,
          },
        };
      } else {
        if (field === "collegeLogo") {
          return {
            ...safePrev,
            collegeInfo: {
              ...(safePrev.collegeInfo || {}),
              collegeLogo: null,
            },
          };
        }
        // Remove single asset (for diagrams)
        return {
          ...safePrev,
          projectAssets: {
            ...safeProjectAssets,
            [field]: null,
          },
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = JSON.parse(JSON.stringify(form));
      const uploadFile = async (
        fileData: { url: string; name: string },
        folder: string
      ) => {
        if (!fileData?.url?.startsWith("data:")) return fileData;

        const formData = new FormData();
        const blob = await (await fetch(fileData.url)).blob();
        formData.append("file", blob, fileData.name);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        return { url: data.url, public_id: data.public_id };
      };

      const uploadMultipleFiles = async (
        files: Array<{ url: string; name: string }>,
        folder: string
      ) => {
        const newFiles = files.filter((file) => file.url.startsWith("data:"));
        const existingFiles = files.filter(
          (file) => !file.url.startsWith("data:")
        );

        if (newFiles.length === 0) return files;

        const uploadPromises = newFiles.map(async (file) => {
          const formData = new FormData();
          const blob = await (await fetch(file.url)).blob();
          formData.append("file", blob, file.name);
          formData.append("folder", folder);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          return {
            url: data.url,
            name: data.original_filename,
            public_id: data.public_id,
          };
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        return [...existingFiles, ...uploadedFiles];
      };

      // Upload college logo if it's new
      if (formData.collegeInfo?.collegeLogo) {
        formData.collegeInfo.collegeLogo = await uploadFile(
          formData.collegeInfo.collegeLogo,
          "college-logos"
        );
      }
      // Upload DFD diagram if it's new
      if (formData.projectAssets?.dfdDiagram) {
        formData.projectAssets.dfdDiagram = await uploadFile(
          formData.projectAssets.dfdDiagram,
          "dfd-diagrams"
        );
      }
      // Upload ER diagram if it's new
      if (formData.projectAssets?.erDiagram) {
        formData.projectAssets.erDiagram = await uploadFile(
          formData.projectAssets.erDiagram,
          "er-diagrams"
        );
      }
      // Upload certificate if it's new
      if (formData.projectAssets?.certificate) {
        formData.projectAssets.certificate = await uploadFile(
          formData.projectAssets.certificate,
          "certificate"
        );
      }

      // Upload UI screenshots if there are new ones
      if (formData.projectAssets?.uiScreenshots?.length > 0) {
        formData.projectAssets.uiScreenshots = await uploadMultipleFiles(
          formData.projectAssets.uiScreenshots,
          "ui-screenshots"
        );
      }

      const res = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Student updated successfully 🚀");
        router.back();
      } else {
        toast.error("Failed to update student");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update student");
    }
  };

  if (loading || !form)
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-6 dark:bg-gray-950">
      <h1 className="text-3xl font-bold mb-4">Edit Student Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal and College Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="personalDetails.name"
                  value={form?.personalDetails?.name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enrollment Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="personalDetails.enrollmentNumber"
                  value={form.personalDetails?.enrollmentNumber || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="personalDetails.email"
                  value={form.personalDetails?.email || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="personalDetails.phone"
                  value={form.personalDetails?.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="personalDetails.certificateNumber"
                  value={form.personalDetails?.certificateNumber || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* College Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              College Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  College Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="collegeInfo.collegeName"
                  value={form.collegeInfo?.collegeName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  HOD Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="collegeInfo.TeacherName"
                  value={form.collegeInfo?.TeacherName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="collegeInfo.course"
                  value={form.collegeInfo?.course || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Course</option>
                  <option value="Diploma">Diploma</option>
                  <option value="B.tech">B.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  name="collegeInfo.branch"
                  value={form.collegeInfo?.branch || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="Computer Science and Engineering">
                    Computer Science and Engineering
                  </option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Electronic Communication">
                    Electronic Communication
                  </option>
                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>
                  <option value="Post Graduate Diploma in Computer Application">
                    PG Diploma in Computer Application
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Academic Session <span className="text-red-500">*</span>
                </label>
                <select
                  name="collegeInfo.session"
                  value={form.collegeInfo?.session || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Session</option>
                  <option value="2023 - 2024">2023 - 2024</option>
                  <option value="2024 - 2025">2024 - 2025</option>
                  <option value="2025 - 2026">2025 - 2026</option>
                  <option value="2026 - 2027">2026 - 2027</option>
                  <option value="2027 - 2028">2027 - 2028</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  College Logo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:dark:bg-gray-700 hover:bg-gray-100 transition-colors relative">
                    {form.collegeInfo?.collegeLogo?.url ? (
                      <>
                        <img
                          src={form.collegeInfo.collegeLogo.url}
                          alt="College logo preview"
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeAsset("collegeLogo");
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600  "
                          title="Remove diagram"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG (MAX. 2MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      name="collegeInfo.collegeLogo"
                      onChange={(e) => handleFileUpload(e, "collegeLogo")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="projectDetails.projectName"
                  value={form.projectDetails?.projectName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="projectDetails.projectTitle"
                  value={form.projectDetails?.projectTitle || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Training Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectDetails.TrainingType"
                  value={form.projectDetails?.TrainingType || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Training Type</option>
                  <option value="Summer Training ">Summer Training</option>

                  <option value="Winter Training ">Winter Training</option>
                  <option value="Vocational Training ">
                    Vocational Training{" "}
                  </option>
                  <option value="Industrial Training ">
                    Industrial Training{" "}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Members <span className="text-red-500">*</span>
                </label>
                <input
                  name="projectDetails.TeamName"
                  value={form.projectDetails?.TeamName || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Training Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="projectDetails.StartDate"
                  value={form.projectDetails?.StartDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Training End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="projectDetails.EndDate"
                  value={form.projectDetails?.EndDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Backend Technology <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectDetails.backendTechnology"
                  value={form.projectDetails?.backendTechnology || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Backend</option>
                  <option value="PHP">PHP</option>
                  <option value="ASP.Net">ASP.Net</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="Python">Python with Django</option>
                  <option value="Android">Android</option>
                  <option value="MERN Stack">MERN Stack</option>
                  <option value="Flutter / Dart">Flutter / Dart</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="IOT WITH EMBEDDED">IOT WITH EMBEDDED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frontend Technology <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectDetails.frontendTechnology"
                  value={form.projectDetails?.frontendTechnology || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Frontend</option>
                  <option value="HTML / CSS / Javascript / Bootstrap / Tailwindcss">
                    HTML/CSS/JS/Bootstrap/Tailwindcss
                  </option>
                  <option value="React Js / JavaScript / TypeScript">
                    React/JavaScript/TypeScript
                  </option>
                  <option value="Android / XML">Android/XML</option>
                  <option value="Flutter / Dart">Flutter/Dart</option>
                  <option value="Streamlit">Streamlit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Database <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectDetails.database"
                  value={form.projectDetails?.database || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Database</option>
                  <option value="MySQL">MySQL</option>
                  <option value="MSSQL">MSSQL</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="Firebase">Firebase</option>
                  <option value="SQLITE">SQLITE</option>
                  <option value="CSV">CSV</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectDetails.duration"
                  value={form.projectDetails?.duration || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-select-arrow bg-no-repeat bg-[center_right_1rem]"
                  required
                >
                  <option value="">Select Duration</option>
                  <option value="45 days">45 days</option>
                  <option value="28 days">28 days</option>
                  <option value="60 days">60 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Project Code */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Project Code
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {[0, 1, 2, 3, 4].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code Snippet {num + 1}
                  </label>
                  <textarea
                    name={`projectAssets.projectCode[${num}]`}
                    value={form.projectAssets?.projectCode?.[num] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] font-mono text-sm"
                    placeholder={`Paste your project code (Page ${num + 1})`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Project Assets */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Status</h2>
            <select
              name="status"
              value={form.status || "new"}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="new">New</option>
              <option value="accept">Accepted</option>
              <option value="reject">Rejected</option>
            </select>
          </div>

          {/* DFD Diagram */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              DFD Diagram
            </h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors h-64 cursor-pointer relative">
              {form.projectAssets?.dfdDiagram?.url ? (
                <>
                  <img
                    src={form.projectAssets.dfdDiagram.url}
                    alt="DFD Diagram preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeAsset("dfdDiagram");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    title="Remove diagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "dfdDiagram")}
                className="hidden"
              />
            </label>
          </div>

          {/* ER Diagram */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              ER Diagram
            </h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors h-64 cursor-pointer relative">
              {form.projectAssets?.erDiagram?.url ? (
                <>
                  <img
                    src={form.projectAssets.erDiagram.url}
                    alt="ER Diagram preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeAsset("erDiagram");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    title="Remove diagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "erDiagram")}
                className="hidden"
              />
            </label>
          </div>
          {/* Certificate */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Certificate
            </h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors h-64 cursor-pointer relative">
              {form.personalDetails?.certificateImage?.url ? (
                <>
                  <img
                    src={form.personalDetails.certificateImage.url}
                    alt=" certificate preview"
                    className="w-full h-full object-contain"
                  />
                  <a
                    target="_blank"
                    className=" absolute top-2 right-13"
                    href={form.personalDetails.certificateImage.url}
                  >
                    <Eye />
                  </a>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeAsset("certificate");
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    title="Remove diagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "certificate")}
                className="hidden"
              />
            </label>
          </div>

          {/* UI Screenshots */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              UI Screenshots
            </h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer">
              {(form?.projectAssets?.uiScreenshots?.length ?? 0) > 0 ? (
                <div className="grid grid-cols-3 gap-2 w-full">
                  {form?.projectAssets?.uiScreenshots?.map(
                    (screenshot, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={screenshot.url}
                          alt={`Screenshot ${index + 1}`}
                          className="h-24 w-full object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeAsset("uiScreenshots", index);
                            }}
                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            title="Remove image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded h-24 cursor-pointer hover:border-blue-500 transition-colors">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">Add more</span>
                  </div>
                </div>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                    <br />
                    Multiple screenshots can be selected
                  </p>
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMultipleFileUpload(e, "uiScreenshots")}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-950 py-4 border-t">
        <div className="flex justify-end gap-5 ">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-fit flex items-center px-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save /> Save Changes
              </>
            )}
          </button>
          <Link
            href={`/dashboard`}
            className="w-fit flex items-center px-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-medium text-lg"
          >
            <ArrowLeft /> Back
          </Link>
        </div>
      </div>
    </div>
  );
}
