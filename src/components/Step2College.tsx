import { useState, ChangeEvent } from "react";

interface CollegeForm {
  collegeName: string;
  collegeLogo?: { url: string; public_id: string }; // <-- optional
  TeacherName: string;
  course: string;
  branch: string;
  session: string;
}

interface Props {
  onNext: (data: CollegeForm) => void;
}

export default function Step2College({ onNext }: Props) {
  const [form, setForm] = useState<Omit<CollegeForm, "collegeLogo">>({
    collegeName: "",
    TeacherName: "",
    course: "",
    branch: "",
    session: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (
      e.target.name === "collegeLogo" &&
      (e.target as HTMLInputElement).files
    ) {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const isFormValid =
    form.collegeName && form.TeacherName && form.course && form.session;

  const handleSubmit = async () => {
    setUploading(true);

    try {
      let logoData = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        logoData = { url: data.url, public_id: data.public_id };
      }

      onNext({
        ...form,
        collegeLogo: logoData || { url: "", public_id: "" },
      });
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  const removeDiagram = (type: "collegeLogo") => {
    setPreviewImage(null);
    setForm((prev) => ({ ...prev, [type]: null }));
  };
  return (
    <div className=" mx-auto space-y-6 ">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
          College Information
        </h2>
        <p className="text-gray-500">Please provide your college details</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your College Name <span className="text-red-500">*</span>
          </label>
          <input
            name="collegeName"
            placeholder="Mahamaya Polytechnic of Information Technology Kushinagar"
            value={form.collegeName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            College Logo
          </label>
          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:dark:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 transition-colors hover:border-blue-500 overflow-hidden">
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="College logo preview"
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDiagram("collegeLogo");
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
                <div className="flex flex-col items-center justify-center p-4">
                  <svg
                    className="w-8 h-8 mb-2 text-gray-400"
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
                    />
                  </svg>
                  <p className="text-xs text-gray-500 text-center">
                    Upload College Logo
                  </p>
                </div>
              )}
              <input
                name="collegeLogo"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              HOD Name - College <span className="text-red-500">*</span>
            </label>
            <input
              name="TeacherName"
              placeholder="Er. Himanshu Kashyap"
              value={form.TeacherName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
            >
              <option value="">Select Course</option>
              <option value="Diploma">Diploma</option>
              <option value="B.tech">B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        {form.course === "MCA" || form.course === "BCA" ? (
          ""
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Branch <span className="text-red-500">*</span>
            </label>

            <select
              required
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
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
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Academic Session <span className="text-red-500">*</span>
          </label>
          <select
            name="session"
            value={form.session}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
          >
            <option value="">Select Session</option>
            <option value="2023 - 2024">2023 - 2024</option>
            <option value="2024 - 2025">2024 - 2025</option>
            <option value="2025 - 2026">2025 - 2026</option>
            <option value="2026 - 2027">2026 - 2027</option>
            <option value="2027 - 2028">2027 - 2028</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
          ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            Saving...
            <svg
              className="animate-spin h-5 w-5 text-white"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 5.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-2.574z"
              ></path>
            </svg>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Continue{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
