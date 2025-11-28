import { useState, ChangeEvent } from "react";

interface ProjectForm {
  projectName: string;
  TrainingType: string;
  TeamName: string;
  StartDate: string;
  EndDate: string;
  backendTechnology: string;
  frontendTechnology: string;
  database: string;
  duration: string;
}

interface Props {
  onNext: (data: ProjectForm) => void;
}

export default function Step3Project({ onNext }: Props) {
  const [form, setForm] = useState<ProjectForm>({
    projectName: "",
    TrainingType: "",
    TeamName: "",
    StartDate: "",
    EndDate: "",
    backendTechnology: "",
    frontendTechnology: "",
    database: "",
    duration: "",
  });
  const [Loading, setLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = Object.entries(form)
  .filter(([key]) => key !== "TeamName") 
  .every(([_, value]) => value.trim() !== "");


  return (
    <div className=" mx-auto  ">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Project Details</h2>
        <p className="text-gray-500 dark:text-gray-300">Provide information about your project</p>
      </div>

      <div className="space-y-5">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              name="projectName"
              placeholder="Hotel Management System"
              value={form.projectName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              name="projectTitle"
              placeholder="Royal hotal"
              value={form.projectTitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div> */}
        {/* </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Training Type <span className="text-red-500">*</span>
            </label>
            <select
              name="TrainingType"
              value={form.TrainingType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
              required
            >
              <option value="">Select Training Type</option>
              <option value="Summer Training ">Summer Training </option>
              <option value="Winter Training ">Winter Training </option>
              <option value="Vocational Training ">Vocational Training </option>
              <option value="Industrial Training ">Industrial Training </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Members Name 
            </label>
            <input
              name="TeamName"
              placeholder="Gaurav, Prabhakar, Krishna (comma separated)"
              value={form.TeamName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Certificate / Training Start Date <span className="text-red-500">*</span>
            </label>
            <input
              name="StartDate"
              type="date"
              value={form.StartDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Certificate / Training End Date <span className="text-red-500">*</span>
            </label>
            <input
              name="EndDate"
              type="date"
              value={form.EndDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Backend Technology <span className="text-red-500">*</span>
            </label>
            <select
              name="backendTechnology"
              value={form.backendTechnology}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
              required
            >
              <option value="">Select Backend</option>
              <option value="PHP">PHP</option>
              <option value="ASP.Net">ASP.Net</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="Python">Python With Django</option>
              <option value="Android">Android</option>
              <option value="MERN Stack">MERN Stack</option>
              <option value="Flutter / Dart">Flutter / Dart</option>
              <option value="IOT WITH EMBEDDED">IOT WITH EMBEDDED</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frontend Technology <span className="text-red-500">*</span>
            </label>
            <select
              name="frontendTechnology"
              value={form.frontendTechnology}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
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
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Database <span className="text-red-500">*</span>
            </label>
            <select
              name="database"
              value={form.database}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
              required
            >
              <option value="">Select Database</option>
              <option value="MySQL">MySQL</option>
              <option value="MSSQL">MSSQL</option>
              <option value="MongoDB">MongoDB</option>
              <option value="Firebase">Firebase</option>
              <option value="SQLITE">SQLITE</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration <span className="text-red-500">*</span>
          </label>
          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTExNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
            required
          >
            <option value="">Select Duration</option>
            <option value="45 days">45 days</option>
            <option value="28 days">28 days</option>
            <option value="60 days">60 days</option>
          </select>
        </div>
      </div>

      <button
           onClick={() => {onNext(form), setLoading(true) }}
        disabled={!isFormValid}
        className={`w-full mt-8 py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2
          ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        {Loading ? (
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