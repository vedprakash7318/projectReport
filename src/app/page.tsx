"use client";
import { useState, useEffect } from "react";
import Step1Personal from "@/components/Step1Personal";
import Step2College from "@/components/Step2College";
import Step3Project from "@/components/Step3Project";
import Step4Assets from "@/components/Step4Assets";

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    let projectid = localStorage.getItem("projectid");

    if (!storedUserId) {
      storedUserId = Math.floor(Math.random() * 10000).toString();
      localStorage.setItem("userId", storedUserId);
    }
    if (projectid) setProjectId(projectid);
    setUserId(storedUserId);

    fetch(`/api/form?userId=${storedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.form?.currentStep) {
          setCurrentStep(data.form.currentStep);
          localStorage.setItem("currentStep", data.form.currentStep.toString());
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleStepComplete = async (step: number, formData: any) => {
    try {
      // console.log(formData);
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, step, data: formData }),
      });

      if (res.ok) {
        const result = await res.json();
        if (step === 4 && result.form?.projectId) {
          setProjectId(result.form.projectId);
          localStorage.setItem("projectid", result.form.projectId);
        }
        const nextStep = step + 1;
        setCurrentStep(nextStep);
        localStorage.setItem("currentStep", nextStep.toString());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleResetForm = () => {
    const newUserId = Math.floor(Math.random() * 10000).toString();
    setUserId(newUserId);
    setCurrentStep(1);
    localStorage.setItem("userId", newUserId);
    localStorage.setItem("currentStep", "1");
    localStorage.setItem("projectid", "");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Progress Indicator */}
      <div className="bg-white  dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center dark:text-white">
          Project Submission Form
        </h1>

        <div className="flex justify-between items-center mb-2">
          {[
            "Personal Details",
            "College Info",
            "Project Details",
            "Project Assets",
          ].map((label, index) => {
            const step = index + 1;
            const isCompleted = currentStep > step;
            const isActive = currentStep === step;
            const isFutureStep = currentStep < step;

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1 relative"
                onClick={() => isCompleted && setCurrentStep(step)}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white 
                    ${
                      isCompleted
                        ? "bg-green-500 cursor-pointer"
                        : isActive
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-400"
                    } 
                    transition-colors duration-300`}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <p
                  className={`mt-2 text-xs md:text-sm font-medium text-center 
                    ${
                      isCompleted
                        ? "text-green-600 cursor-pointer"
                        : isActive
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500 dark:text-gray-300"
                    }`}
                >
                  {label}
                </p>
                {step < 4 && (
                  <div className="absolute top-5 right-0 w-full h-1 -z-10">
                    <div
                      className={`h-1 transition-all duration-500 
                        ${
                          isCompleted
                            ? "bg-green-500"
                            : isActive
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Forms */}
      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-md">
        {currentStep === 1 && (
          <Step1Personal onNext={(data) => handleStepComplete(1, data)} />
        )}
        {currentStep === 2 && (
          <Step2College onNext={(data) => handleStepComplete(2, data)} />
        )}
        {currentStep === 3 && (
          <Step3Project onNext={(data) => handleStepComplete(3, data)} />
        )}
        {currentStep === 4 && (
          <Step4Assets onNext={(data) => handleStepComplete(4, data)} />
        )}

        {currentStep > 4 && (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
              Form Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your project details have been submitted.
              <br />
              <span className="font-semibold text-lg">
                Your Project ID: {projectId ? projectId : "Loading..."}
              </span>
            </p>
            <p className="text-red-500 mb-6 font-semibold">
              Please take a screenshot of your Project ID for future reference.
            </p>
            <button
              onClick={handleResetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Another Project
            </button>
          </div>
        )}
      </div>

      {/* Navigation Help Text */}
      {currentStep <= 4 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Previous Step
            </button>
          )}
          Step {currentStep} of 4
        </p>
      )}
    </div>
  );
}
