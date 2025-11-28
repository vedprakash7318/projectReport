import next from "next";
import { useState, ChangeEvent } from "react";
import Modal from "react-modal";

interface PersonalForm {
  name: string;
  email: string;
  enrollmentNumber: string;
  phone: string;
  certificateNumber: string;
  certificateImage?: { url: string; public_id: string };
}

interface Props {
  onNext: (data: PersonalForm) => void;
}

interface SampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SampleModal = ({ isOpen, onClose }: SampleModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="bg-white rounded-lg  max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Certificate Image</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="border h-lg md:w-lg rounded-lg overflow-hidden">
            <img
              src="/img/Certificate.png"
              alt={`Sample `}
              className=" md:w-lg w-md h-md md:h-lg object-contain"
            />
          </div>
        </div>

        {/* <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div> */}
      </div>
    </Modal>
  );
};
export default function Step1Personal({ onNext }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<PersonalForm, "certificateImage">>({
    name: "",
    email: "",
    phone: "",
    enrollmentNumber: "",
    certificateNumber: "",
  });

  const openSampleModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const [Loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email address";
      }
    }
    if (name === "phone") {
     const phoneRegex = /^[6-9][0-9]{9}$/;
      if (!phoneRegex.test(value)) {
        error = "Please enter a valid 10-digit phone number";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "certificateImage" && files) {
      const file = files[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [name]: value });
      validateField(name, value); // ✅ validate on change
    }
  };

  const isFormValid =
    form.name &&
    form.email &&
    form.phone &&
    form.enrollmentNumber &&
    form.certificateNumber &&
    selectedFile;

  const removeDiagram = (type: "certificateImage") => {
    setPreviewImage(null);
    setForm((prev) => ({ ...prev, [type]: null }));
  };
  const handleSubmit = async () => {
    // agar error hai to stop
    if (errors.email || errors.phone) {
      alert("Please fix form errors before submitting");
      return;
    }
    setLoading(true);
    try {
      let certificateImage;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadRes = await res.json();
        certificateImage = {
          url: uploadRes.url,
          public_id: uploadRes.public_id,
        };
      }
      onNext({ ...form, certificateImage });
    } catch (err) {
      console.log(err);
      alert("Certificate image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto    space-y-6 ">
      <SampleModal isOpen={modalOpen} onClose={closeModal} />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
          Personal Details
        </h2>
        <p className="text-gray-500">
          Please provide your personal information
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            placeholder="Krishna Kumar"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="krishna@gmail.com"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-all 
      ${
        errors.email
          ? "border-red-500"
          : "border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
            required
          />{" "}
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="10 digit mobile no"
            value={form.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-all 
      ${
        errors.phone
          ? "border-red-500"
          : "border-gray-300 focus:ring-2 focus:ring-blue-500"
      }
    `}
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enrollment Number [ College / Board ]{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            name="enrollmentNumber"
            type="text"
            placeholder="E24480635500058"
            value={form.enrollmentNumber}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Certificate Number
            <span className="text-red-500">*</span>
          </label>
          <input
            name="certificateNumber"
            type="text"
            placeholder="DCT/2025/1234"
            value={form.certificateNumber}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certificate Image
            <span className="text-red-500">*</span>
            <span
              className="pl-5 text-xs text-blue-500 underline cursor-pointer "
              onClick={() => openSampleModal()}
            >
              view Simple{" "}
            </span>
          </label>
          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors hover:border-blue-500 overflow-hidden">
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Certificate preview"
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDiagram("certificateImage");
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
                    Upload Certificate Image
                  </p>
                </div>
              )}
              <input
                name="certificateImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-all
          ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        {/* {Loading? "Saving...":"Continue"} */}
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
