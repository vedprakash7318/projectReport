import { useState, ChangeEvent, useRef, useEffect } from "react";
import Modal from "react-modal";

interface ProjectAssetsForm {
  projectCode1: string;
  projectCode2: string;
  projectCode3: string;
  projectCode4: string;
  projectCode5: string;
  uiScreenshots: FileList | null;
  dfdDiagram: File | null;
  erDiagram: File | null;
}

interface Props {
  onNext: (data: {
    projectCode: string[];
    uiScreenshots: { url: string }[];
    dfdDiagram: { url: string };
    erDiagram: { url: string };
  }) => void;
}

interface SampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleType: string;
}

const SampleModal = ({ isOpen, onClose, sampleType }: SampleModalProps) => {
  const getSampleImages = () => {
    switch (sampleType) {
      case "code":
        return ["/img/codeimg3.png", "/img/codeimg4.png"];
      case "screenshots":
        return ["/img/home.png", "/img/about.png", "/img/footer.png"];
      case "dfd":
        return ["/img/dfddigram.png"];
      case "er":
        return ["/img/erdigram.png"];
      default:
        return [];
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="  rounded-lg  max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-gray-800">
            {sampleType === "code" && "Code Samples"}
            {sampleType === "screenshots" && "Screenshot Samples"}
            {sampleType === "dfd" && "DFD Diagram Sample"}
            {sampleType === "er" && "ER Diagram Sample"}
          </h2>
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
          {getSampleImages().map((img, index) => (
            <div
              key={index}
              className="border h-lg md:w-lg rounded-lg overflow-hidden"
            >
              <img
                src={img}
                alt={`Sample ${index + 1}`}
                className=" md:w-lg w-md h-md md:h-lg object-contain"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default function Step4Assets({ onNext }: Props) {
  const [form, setForm] = useState<ProjectAssetsForm>({
    projectCode1: "",
    projectCode2: "",
    projectCode3: "",
    projectCode4: "",
    projectCode5: "",
    uiScreenshots: null,
    dfdDiagram: null,
    erDiagram: null,
  });

  const [previews, setPreviews] = useState({
    uiScreenshots: [] as string[],
    dfdDiagram: "",
    erDiagram: "",
  });
  const [Loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSample, setCurrentSample] = useState<string>("");
  const uiScreenshotsRef = useRef<HTMLInputElement>(null);
  const dfdDiagramRef = useRef<HTMLInputElement>(null);
  const erDiagramRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     Modal.setAppElement('#__next');
  //   }
  // }, []);

  const openSampleModal = (sampleType: string) => {
    setCurrentSample(sampleType);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (name === "uiScreenshots" && files) {
      const newFiles = Array.from(files);
      const newPreviews: string[] = [];
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setPreviews((prev) => ({ ...prev, uiScreenshots: [...prev.uiScreenshots, ...newPreviews] }));
          }
        };
        reader.readAsDataURL(file);
      });
       // Form me bhi purane files + naye files append karna hoga
    const existingFiles = form.uiScreenshots ? Array.from(form.uiScreenshots) : [];
    const updatedFiles = [...existingFiles, ...newFiles];

    const newFileList = new DataTransfer();
    updatedFiles.forEach((file) => newFileList.items.add(file));

    setForm((prev) => ({ ...prev, [name]: newFileList.files }));
    } else if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [name]: reader.result as string }));
      };
      reader.readAsDataURL(files[0]);
      setForm({ ...form, [name]: files[0] });
    }
  };


  const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) { 
      ref.current.value = ""; // Reset to allow selecting same file again
      ref.current.click();
    }
  };

  const removeScreenshot = (index: number) => {
    const newPreviews = [...previews.uiScreenshots];
    newPreviews.splice(index, 1);
    setPreviews((prev) => ({ ...prev, uiScreenshots: newPreviews }));

    // Update files list
    if (form.uiScreenshots) {
      const filesArray = Array.from(form.uiScreenshots);
      filesArray.splice(index, 1);
      const newFileList = new DataTransfer();
      filesArray.forEach((file) => newFileList.items.add(file));
      setForm((prev) => ({ ...prev, uiScreenshots: newFileList.files }));
    }
  };

  const removeDiagram = (type: "dfdDiagram" | "erDiagram") => {
    setPreviews((prev) => ({ ...prev, [type]: "" }));
    setForm((prev) => ({ ...prev, [type]: null }));
  };

  const handlesubmit = async () => {
    setLoading(true);
    try {
      const uploadedScreenshots = [];
      const uploadedDfd = { url: "", public_id: "" };
      const uploadedEr = { url: "", public_id: "" };

      // Upload Screenshots
      if (form.uiScreenshots) {
        for (const file of Array.from(form.uiScreenshots)) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          uploadedScreenshots.push({
            url: data.url,
            public_id: data.public_id,
          });
        }
      }

      // Upload DFD Diagram
      if (form.dfdDiagram) {
        const formData = new FormData();
        formData.append("file", form.dfdDiagram);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploadedDfd.url = data.url;
        uploadedDfd.public_id = data.public_id;
      }

      // Upload ER Diagram
      if (form.erDiagram) {
        const formData = new FormData();
        formData.append("file", form.erDiagram);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploadedEr.url = data.url;
        uploadedEr.public_id = data.public_id;
      }

      // Final Submit
      onNext({
        projectCode: [
          form.projectCode1.trim(),
          form.projectCode2.trim(),
          form.projectCode3.trim(),
          form.projectCode4.trim(),
          form.projectCode5.trim(),
        ].filter(Boolean),
        uiScreenshots: uploadedScreenshots,
        dfdDiagram: uploadedDfd,
        erDiagram: uploadedEr,
      });
    } catch (error) {
      console.error("File upload error:", error);
      alert("File upload failed. Please try again.");
    }
  };

  const isFormValid =
    (form.projectCode1.trim() ||
      form.projectCode2.trim() ||
      form.projectCode3.trim() ||
      form.projectCode4.trim() ||
      form.projectCode5.trim()) &&
    previews.uiScreenshots.length > 0;

  return (
    <div className=" mx-auto  ">
      <SampleModal
        isOpen={modalOpen}
        onClose={closeModal}
        sampleType={currentSample}
      />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Project Assets</h2>
        <p className="text-gray-500 ">
          Upload your project files and screenshots
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
            Project Code <span className="text-red-500">*</span>
            <span
              className="pl-5 text-xs text-blue-500 underline cursor-pointer "
              onClick={() => openSampleModal("code")}
            >
              view Simple{" "}
            </span>
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Code Snippet {num}
                </label>
                <textarea
                  name={`projectCode${num}`}
                  placeholder={`Paste your project code (Page ${num})`}
                  value={
                    form[
                      `projectCode${num}` as keyof ProjectAssetsForm
                    ] as string
                  }
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-3">
            Project Output / Page Design Screenshorts{" "}
            <span
              className="pl-5 text-xs text-blue-500 underline cursor-pointer "
              onClick={() => openSampleModal("screenshots")}
            >
              view Simple{" "}
            </span>
          </h3>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload 8-10 screenshots <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => triggerFileInput(uiScreenshotsRef)}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
          >
            {previews.uiScreenshots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 w-full">
                {previews.uiScreenshots.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Screenshot ${index + 1}`}
                      className="h-18 w-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScreenshot(index);
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
                ))}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput(uiScreenshotsRef);
                  }}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded h-18 cursor-pointer hover:border-blue-500 transition-colors"
                >
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
                  className="w-10 h-10 mb-3 text-gray-400"
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                  <br />
                  Multiple screenshots can be selected
                </p>
              </>
            )}
            <input
              type="file"
              name="uiScreenshots"
              onChange={handleFileChange}
              className="hidden"
              ref={uiScreenshotsRef}
              multiple
              accept="image/*"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-3">
              Diagrams{" "}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  DFD Diagram{" "}
                  <span
                    className="pl-5 text-xs text-blue-500 underline cursor-pointer "
                    onClick={() => openSampleModal("dfd")}
                  >
                    view Simple{" "}
                  </span>
                </label>
                <div
                  onClick={() => triggerFileInput(dfdDiagramRef)}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors h-32 cursor-pointer relative"
                >
                  {previews.dfdDiagram ? (
                    <>
                      <img
                        src={previews.dfdDiagram}
                        alt="DFD Diagram preview"
                        className="h-full object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDiagram("dfdDiagram");
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
                        ></path>
                      </svg>
                      <p className="text-xs text-gray-500 text-center">
                        Upload DFD Diagram
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    name="dfdDiagram"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={dfdDiagramRef}
                    accept="image/*"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ER Diagram{" "}
                  <span
                    className="pl-5 text-xs text-blue-500 underline cursor-pointer"
                    onClick={() => openSampleModal("er")}
                  >
                    view Simple{" "}
                  </span>
                </label>
                <div
                  onClick={() => triggerFileInput(erDiagramRef)}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors h-32 cursor-pointer relative"
                >
                  {previews.erDiagram ? (
                    <>
                      <img
                        src={previews.erDiagram}
                        alt="ER Diagram preview"
                        className="h-full object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDiagram("erDiagram");
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
                        ></path>
                      </svg>
                      <p className="text-xs text-gray-500 text-center">
                        Upload ER Diagram
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    name="erDiagram"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={erDiagramRef}
                    accept="image/*"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => handlesubmit()}
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
            Submit Project
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
