"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
interface Student {
  id: string;
  createdAt: string;
  personalDetails?: {
    name: string;
    email: string;
    phone: string;
    certificateNumber: string;
    certificateImage: {
      url: string;
    };
  };
  collegeInfo?: {
    collegeName: string;
    course: string;
    branch: string;
    TeacherName: string;
    session: string;
    collegeLogo: {
      url: string;
    };
  };
  projectDetails?: {
    projectName: string;
    description: string;
    TeamName: string;
    duration: string;
    TrainingType: string;
    frontendTechnology: string;
    backendTechnology: string;
    database: string;
    StartDate: string;
    EndDate: string;
  };
  projectAssets?: {
    erDiagram: {
      url: string;
    };
    dfdDiagram: {
      url: string;
    };
    uiScreenshots: Array<{
      url: string;
    }>;
    projectCode: string[];
  };
}

export default function PDFPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(2);
  const [isdisabled, setisdisabled] = useState(true);
  const [content, setContent] = useState({
    introduction: "",
    projectGoals: "",
    systemAnalysis: "",
    coreFeatures: "",
    systemArchitecture: "",
    systemDesign: "",
    backendDesign: "",
    dataModeling: "",
    conclusion: "",
  });
  const pdfRef = useRef<HTMLDivElement>(null);
  const [completedSections, setCompletedSections] = useState(0);
  const totalSections = 9;
  // Multiple API keys configuration
  const api1 = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const api2 = process.env.NEXT_PUBLIC_GEMINI_API_KEY1;
  const api3 = process.env.NEXT_PUBLIC_GEMINI_API_KEY2;
  const api4 = process.env.NEXT_PUBLIC_GEMINI_API_KEY3;
  const api5 = process.env.NEXT_PUBLIC_GEMINI_API_KEY4;
  const api6 = process.env.NEXT_PUBLIC_GEMINI_API_KEY5;
  const api7 = process.env.NEXT_PUBLIC_GEMINI_API_KEY6;
  const api8 = process.env.NEXT_PUBLIC_GEMINI_API_KEY7;
  const api9 = process.env.NEXT_PUBLIC_GEMINI_API_KEY8;

  useEffect(() => {
    fetch(`/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => setStudent(data.student))
      .catch((err) => console.log(err));
  }, [studentId]);

  const handlePrint = () => {
    // Enhanced print-specific styles with proper page breaks
    const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      #pdf-content, #pdf-content * {
        visibility: visible;
      }
      #pdf-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
      }
      
      /* Page break styles */
      .page-break {
        page-break-after: always !important;
        break-after: always !important;
      }
      
      .page-break:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
      
      /* Prevent page breaks inside these elements */
      .no-page-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Ensure proper margins for print */
      @page {
        margin: 10mm;
        size: A4;
      }
      
      /* Fix image and content sizing for print */
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    }
  `;

    // Add styles temporarily
    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    // Trigger print
    window.print();
    handlePrintIncrement();
    // Clean up after printing
    setTimeout(() => {
      document.head.removeChild(styleElement);
    }, 1000);
  };
  // React/Next.js में API call का उदाहरण
  const handlePrintIncrement = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/print`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to increment print count");
      }

      const data = await response.json();
      // console.log('Print count updated:', data.student);
      return data.student; // Updated student data
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  // उपयोग करने का तरीका
  // handlePrintIncrement('65d5f8e9c4b8d1a9f7d3f2a1');

  const getPromptTemplates = (student: Student) => {
    const { projectName, backendTechnology, frontendTechnology, database } =
      student?.projectDetails || {};

    return [
      {
        key: "introduction",
        prompt: `Generate a detailed introduction section for the ${projectName} project. Format your response exactly as shown below with clear sections:

**1.1 Project Overview**
Write a single comprehensive paragraph about ${projectName}, its main purpose, core functionality, and what makes it unique. Mention how it uses ${frontendTechnology} for frontend and ${backendTechnology} for backend.

**1.2 Background**
Write a single comprehensive paragraph about the current market need, industry challenges, and why this ${projectName} project was chosen. Explain the gap in existing solutions.

**1.3 Objectives & Scope**
Write a single comprehensive paragraph for Objectives & Scope:

**1.4 Target Audience**
Write a single comprehensive paragraph about the target audience:

**1.5 Problem Statement**
Write a single comprehensive paragraph about the problem statement:

Use professional language and ensure each section has substantial content in single paragraph format.`,
      },
      {
        key: "projectGoals",
        prompt: `Generate Project Goals section for ${projectName}. Format exactly as below:

**2.1 Purpose & Benefits**
Write a single comprehensive paragraph about the purpose and benefits:

**2.2 Key Deliverables**
Write a single comprehensive paragraph about key deliverables:

You can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "systemAnalysis",
        prompt: `Create comprehensive System Analysis for ${projectName}. Format exactly as below:

**3.1 System Objectives**
Write a single comprehensive paragraph about System Objectives:

**3.2 Development Methodology**
Write a single comprehensive paragraph about Development Methodology:
 
You can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "coreFeatures",
        prompt: `List and describe 5 core features for ${projectName} built with ${backendTechnology} and ${frontendTechnology}. Format exactly as below:

**4.1 User Authentication & Authorization**
Write a single comprehensive paragraph about this section:

**4.2 Data Management System**
Write a single comprehensive paragraph about this section:

**4.3 User Interface & Experience**
Write a single comprehensive paragraph about this section:

**4.4 Search & Filter Functionality**
Write a single comprehensive paragraph about this section:

**4.5 Admin Dashboard & Controls**
Write a single comprehensive paragraph about this section:

Provide implementation details and user benefits for each feature in ${projectName}, you can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "systemArchitecture",
        prompt: `Describe comprehensive system architecture for ${projectName}. Format exactly as below:

**6.1 High-Level Architecture**
Write a single comprehensive paragraph about High-Level Architecture:

**6.2 Key Components**
Write a single comprehensive paragraph about Key Components:

Include technical specifications and explain how components interact in ${projectName}, you can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "systemDesign",
        prompt: `Explain comprehensive system design approach for ${projectName}. Format exactly as below:

**7.1 Design Methodology**
Write a single comprehensive paragraph about Design Methodology:

**7.2 Design Patterns**
Write a single comprehensive paragraph about Design Patterns:

Focus on specific design decisions made for ${projectName} and their technical rationale, you can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "backendDesign",
        prompt: `Detail comprehensive backend design for ${projectName} using ${backendTechnology}. Format exactly as below:

**8.1 Data Models**
Write a single comprehensive paragraph about Data Models:

**8.2 API Design**
Write a single comprehensive paragraph about API Design:

**8.3 Business Logic**
Write a single comprehensive paragraph about Business Logic:

Include specific technical implementation details for ${projectName}, you can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "dataModeling",
        prompt: `Explain comprehensive data modeling for ${projectName} with ${database}. Format exactly as below:

**9.1 Database Schema**
Write a single comprehensive paragraph about Database Schema:

**9.2 Collections/Tables**
Write a single comprehensive paragraph about Collections/Tables:

Provide clear technical rationale for database design decisions in ${projectName}, you can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
      {
        key: "conclusion",
        prompt: `Write comprehensive conclusion for ${projectName} project. Format exactly as below:

**13.1 Project Summary**
Write a single comprehensive paragraph about Project Summary:

**13.2 Future Enhancements**
Write a single comprehensive paragraph about Future Enhancements:

Summarize the overall success of ${projectName} and provide a roadmap for future development, you can use project Details name:${projectName}, Title:${projectName}, backendTechnology:${backendTechnology}, frontendTechnology:${frontendTechnology}, Database:${database}.`,
      },
    ];
  };

  // Generate content function introduction
  const generateIntroductionApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api1}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, introduction: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating introduction:`, error);
      setContent((prev) => ({
        ...prev,
        introduction: `Error generating content for introduction. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };
  // Generate content function projectGoals
  const generateProjectGoalsApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api2}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, projectGoals: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating projectGoals:`, error);
      setContent((prev) => ({
        ...prev,
        projectGoals: `Error generating content for projectGoals. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };

  // Generate content function systemAnalysis
  const generateSystemAnalysisApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api3}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, systemAnalysis: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating systemAnalysis:`, error);
      setContent((prev) => ({
        ...prev,
        systemAnalysis: `Error generating content for systemAnalysis. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };
  // Generate content function coreFeatures
  const generateCoreFeaturesApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api4}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, coreFeatures: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating coreFeatures:`, error);
      setContent((prev) => ({
        ...prev,
        coreFeatures: `Error generating content for coreFeatures. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };

  // Generate content function systemArchitecture
  const generateSystemArchitectureApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api5}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, systemArchitecture: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating systemArchitecture:`, error);
      setContent((prev) => ({
        ...prev,
        systemArchitecture: `Error generating content for systemArchitecture. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };
  // Generate content function systemDesign
  const generateSystemDesignApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api6}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, systemDesign: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating systemDesign:`, error);
      setContent((prev) => ({
        ...prev,
        systemDesign: `Error generating content for systemDesign. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };
  // Generate content function backendDesign
  const generateBackendDesignApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api7}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, backendDesign: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating backendDesign:`, error);
      setContent((prev) => ({
        ...prev,
        backendDesign: `Error generating content for backendDesign. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };
  // Generate content function dataModeling
  const generateDataModelingApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api8}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, dataModeling: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating dataModeling:`, error);
      setContent((prev) => ({
        ...prev,
        dataModeling: `Error generating content for dataModeling. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };
  // Generate content function conclusion
  const generateConclusionApi = async (prompt: string) => {
    try {
      const requestData = {
        contents: [
          {
            parts: [
              {
                text:
                  prompt +
                  "\n\nPlease provide a detailed, professional response in markdown format.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api9}`,
        requestData,
        {
          timeout: 40000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = response.data.candidates[0].content.parts[0].text;
        setContent((prev) => ({ ...prev, conclusion: generatedText }));
        setCompletedSections((prev) => prev + 1);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error generating conclusion:`, error);
      setContent((prev) => ({
        ...prev,
        conclusion: `Error generating content for conclusion. Please try again.`,
      }));
      setCompletedSections((prev) => prev + 1);
      return false;
    }
  };

  // Individual section generation functions
  const generateIntroduction = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "introduction")
        ?.prompt || "";
    return generateIntroductionApi(prompt);
  };

  const generateProjectGoals = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "projectGoals")
        ?.prompt || "";
    return generateProjectGoalsApi(prompt);
  };

  const generateSystemAnalysis = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "systemAnalysis")
        ?.prompt || "";
    return generateSystemAnalysisApi(prompt);
  };

  const generateCoreFeatures = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "coreFeatures")
        ?.prompt || "";
    return generateCoreFeaturesApi(prompt);
  };

  const generateSystemArchitecture = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "systemArchitecture")
        ?.prompt || "";
    return generateSystemArchitectureApi(prompt);
  };

  const generateSystemDesign = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "systemDesign")
        ?.prompt || "";
    return generateSystemDesignApi(prompt);
  };

  const generateBackendDesign = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "backendDesign")
        ?.prompt || "";
    return generateBackendDesignApi(prompt);
  };

  const generateDataModeling = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "dataModeling")
        ?.prompt || "";
    return generateDataModelingApi(prompt);
  };

  const generateConclusion = async () => {
    if (!student?.projectDetails) return;
    const prompt =
      getPromptTemplates(student).find((p) => p.key === "conclusion")?.prompt ||
      "";
    return generateConclusionApi(prompt);
  };
  // Main generation function that calls all section generators
  const generateAllContent = async () => {
    setLoading(true);

    try {
      // Run all generation functions in sequence
      await generateIntroduction();
      await generateProjectGoals();
      await generateSystemAnalysis();
      await generateCoreFeatures();
      await generateSystemArchitecture();
      await generateSystemDesign();
      await generateBackendDesign();
      await generateDataModeling();
      await generateConclusion();
    } catch (error) {
      console.error("Error in content generation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update your useEffect to call generateAllContent
  useEffect(() => {
    if (student?.projectDetails) {
      generateAllContent();
    } else {
      console.warn("Missing required data:", {
        hasStudent: !!student?.projectDetails,
      });
    }
  }, [student?.projectDetails?.projectName]);

  useEffect(() => {
    setProgress(Math.round((completedSections / totalSections) * 100));
    if (completedSections === totalSections) setisdisabled(false);
  }, [completedSections]);

  // Enhanced Word Document Generation Function
  // const handleDownloadWord = async () => {
  //   if (!student) return;

  //   try {
  //     setLoading(true);

  //     // Helper function to convert image URL to base64
  //     const getImageAsBase64 = async (url) => {
  //       try {
  //         const response = await fetch(url);
  //         const blob = await response.blob();
  //         return new Promise((resolve) => {
  //           const reader = new FileReader();
  //           reader.onload = () => resolve(reader.result.split(',')[1]);
  //           reader.readAsDataURL(blob);
  //         });
  //       } catch (error) {
  //         console.error('Error converting image:', error);
  //         return null;
  //       }
  //     };

  //     // Get images as base64
  //     const digicodersLogo = await getImageAsBase64('/img/Digicoders-new-logo.png');
  //     const certificateImage = await getImageAsBase64('/img/Certificate.jpg');
  //     const collegeLogo = student.collegeInfo?.collegeLogo?.url ?
  //       await getImageAsBase64(student.collegeInfo.collegeLogo.url) : null;
  //     const erDiagram = student.projectAssets?.erDiagram?.url ?
  //       await getImageAsBase64(student.projectAssets.erDiagram.url) :
  //       await getImageAsBase64('/img/erdigram.png');
  //     const dfdDiagram = student.projectAssets?.dfdDiagram?.url ?
  //       await getImageAsBase64(student.projectAssets.dfdDiagram.url) :
  //       await getImageAsBase64('/img/dfddigram.png');

  //     // Helper function to parse content sections
  //     const parseContentSection = (content) => {
  //       if (!content) return [];
  //       const parts = content.split('**').filter((text, index) => index > 0 && text.trim());
  //       const paragraphs = [];

  //       for (let i = 0; i < parts.length; i += 2) {
  //         if (parts[i] && parts[i + 1]) {
  //           // Heading
  //           paragraphs.push(new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: parts[i].trim(),
  //                 bold: true,
  //                 size: 24,
  //               }),
  //             ],
  //             spacing: { before: 300, after: 200 },
  //           }));

  //           // Content
  //           paragraphs.push(new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: parts[i + 1].trim(),
  //                 size: 22,
  //               }),
  //             ],
  //             alignment: AlignmentType.JUSTIFIED,
  //             spacing: { after: 300 },
  //           }));
  //         }
  //       }
  //       return paragraphs;
  //     };

  //     // Create the document
  //     const doc = new Document({
  //       sections: [
  //         {
  //           properties: {
  //             page: {
  //               margin: {
  //                 top: 720,    // 1 inch = 720 twips
  //                 right: 720,
  //                 bottom: 720,
  //                 left: 720,
  //               },
  //             },
  //           },
  //           children: [
  //             // PAGE 1 - Title Page
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: student.projectDetails?.projectName?.toUpperCase() || "",
  //                   bold: true,
  //                   size: 36,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "Project Report",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `Submitted in Partial fulfillment for the award of\n${
  //                     student.collegeInfo?.course === "MCA"
  //                       ? "Master of Computer Applications"
  //                       : student.collegeInfo?.course === "BCA"
  //                       ? "Bachelor of Computer Applications"
  //                       : `${student.collegeInfo?.course} in ${student.collegeInfo?.branch}`
  //                   }`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "DIGICODERS TECHNOLOGIES PVT. LTD.\nLUCKNOW(UP)",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),

  //             // Add logos
  //             new Paragraph({
  //               children: [
  //                 new ImageRun({
  //                   data: digicodersLogo,
  //                   transformation: {
  //                     width: 200,
  //                     height: 100,
  //                   },
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 400 },
  //             }),

  //             ...(collegeLogo ? [
  //               new Paragraph({
  //                 children: [
  //                   new ImageRun({
  //                     data: collegeLogo,
  //                     transformation: {
  //                       width: 200,
  //                       height: 100,
  //                     },
  //                   }),
  //                 ],
  //                 alignment: AlignmentType.CENTER,
  //                 spacing: { after: 400 },
  //               })
  //             ] : []),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `Session - ${student.collegeInfo?.session}`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 600 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: student.collegeInfo?.collegeName?.toUpperCase() || "",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),

  //             // Submitted By/To sections
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `Submitted By: ${student.personalDetails?.name}`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `Submitted to: ${student.collegeInfo?.TeacherName}`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.RIGHT,
  //               spacing: { after: 400 },
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 2 - Certificate of Approval
  //             new Paragraph({
  //               children: [
  //                 new ImageRun({
  //                   data: digicodersLogo,
  //                   transformation: {
  //                     width: 400,
  //                     height: 100,
  //                   },
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 400 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "CERTIFICATE OF APPROVAL",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                   allCaps: true,
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `This is to certify that the project titled "${student.projectDetails?.projectName}" has been successfully completed by ${student.personalDetails?.name}, under the technical guidance and project development support of DigiCoders Technologies Pvt Ltd.`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.JUSTIFIED,
  //               spacing: { after: 400 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `The project work has been reviewed and evaluated by the technical team at Digicoders and is hereby approved as a valid and original project carried out in the field of ${
  //                     student.collegeInfo?.course === "MCA"
  //                       ? "Master of Computer Applications"
  //                       : student.collegeInfo?.course === "BCA"
  //                       ? "Bachelor of Computer Applications"
  //                       : `${student.collegeInfo?.course} in ${student.collegeInfo?.branch}`
  //                   }.`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.JUSTIFIED,
  //               spacing: { after: 400 },
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 3 - Declaration
  //             new Paragraph({
  //               children: [
  //                 new ImageRun({
  //                   data: digicodersLogo,
  //                   transformation: {
  //                     width: 400,
  //                     height: 100,
  //                   },
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 400 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "DECLARATION",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                   allCaps: true,
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `I hereby declare that the work presented in this Minor Project titled "${student.projectDetails?.projectName}" is the result of my own effort and is an original contribution to the field of ${
  //                     student.collegeInfo?.course === "MCA"
  //                       ? "Master of Computer Applications"
  //                       : student.collegeInfo?.course === "BCA"
  //                       ? "Bachelor of Computer Applications"
  //                       : `${student.collegeInfo?.course} in ${student.collegeInfo?.branch}`
  //                   }.`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.JUSTIFIED,
  //               spacing: { after: 400 },
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 4 - Acknowledgement
  //             new Paragraph({
  //               children: [
  //                 new ImageRun({
  //                   data: digicodersLogo,
  //                   transformation: {
  //                     width: 400,
  //                     height: 100,
  //                   },
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 400 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "ACKNOWLEDGEMENT",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                   allCaps: true,
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "The successful completion of this project would not have been possible without the support, guidance, and encouragement of several individuals and organizations. I would like to express my sincere gratitude to all those who contributed to this project.",
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.JUSTIFIED,
  //               spacing: { after: 400 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `First and foremost, I am extremely thankful to DigiCoders Technologies Pvt. Ltd., for providing me with the opportunity to work on this project. Their valuable resources, technical expertise, and continuous support throughout the development process played a crucial role in the successful completion of this work.`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.JUSTIFIED,
  //               spacing: { after: 400 },
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 5 - Certificate Image
  //             new Paragraph({
  //               children: [
  //                 new ImageRun({
  //                   data: certificateImage,
  //                   transformation: {
  //                     width: 600,
  //                     height: 800,
  //                   },
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 6 - Index
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "INDEX",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                   allCaps: true,
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),

  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "1. Introduction\n" +
  //                         "   1.1 Overview\n" +
  //                         "   1.2 Background of the Project\n" +
  //                         "   1.3 Objectives and Scope\n" +
  //                         "   1.4 Intended Audience\n" +
  //                         "   1.5 Problem Definition\n\n" +
  //                         "2. Project Goals\n" +
  //                         "   2.1 Purpose and Benefits\n" +
  //                         "   2.2 Key Deliverables\n\n" +
  //                         "3. System Analysis\n" +
  //                         "   3.1 Objectives\n" +
  //                         "   3.2 Development Methodology\n" +
  //                         "   3.3 ER Diagram\n" +
  //                         "   3.4 Data Flow Diagram\n\n" +
  //                         "4. Core Features\n" +
  //                         "5. Technology Stack\n" +
  //                         "6. System Architecture\n" +
  //                         "7. System Design Methodology\n" +
  //                         "8. Backend Design\n" +
  //                         "9. Data Modeling\n" +
  //                         "10. Development Plan\n" +
  //                         "11. Testing and Quality Assurance\n" +
  //                         "12. User Experience and Interface\n" +
  //                         "13. Conclusion",
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { after: 400 },
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 7 - Introduction
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "1. Introduction",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.introduction),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 8 - Project Goals
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "2. Project Goals",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.projectGoals),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 9 - System Analysis
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "3. System Analysis",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.systemAnalysis),

  //             // Add ER Diagram
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "3.3 ER Diagram",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new ImageRun({
  //                   data: erDiagram,
  //                   transformation: {
  //                     width: 500,
  //                     height: 300,
  //                   },
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 600 },
  //             }),

  //             // Add DFD Diagram
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "3.4 Data Flow Diagram",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new ImageRun({
  //                   data: dfdDiagram,
  //                   transformation: {
  //                     width: 500,
  //                     height: 300,
  //                   },
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 600 },
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 10 - Core Features
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "4. Core Features",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.coreFeatures),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 11 - Technology Stack
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "5. Technology Stack",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "5.1 Frontend Technologies",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `• ${student.projectDetails?.frontendTechnology}`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "5.2 Backend Technologies",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `• ${student.projectDetails?.backendTechnology}`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "5.3 Database Solutions",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: `• ${student.projectDetails?.database}`,
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { after: 400 },
  //             }),

  //             // System Architecture
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "6. System Architecture",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { before: 800, after: 800 },
  //             }),
  //             ...parseContentSection(content.systemArchitecture),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 12 - System Design
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "7. System Design Methodology",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.systemDesign),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 13 - Backend Design
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "8. Backend Design",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.backendDesign),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 14 - Data Modeling
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "9. Data Modeling",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.dataModeling),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 15 - Development Plan
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "10. Development Plan",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "10.1 Phases of Development",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "1. Requirements\n2. UI/UX Design\n3. Backend Logic\n4. PDF Export\n5. Testing\n6. Deployment",
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { after: 600 },
  //             }),

  //             // Testing and Quality Assurance
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "11. Testing and Quality Assurance",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { before: 800, after: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "11.1 Testing Strategies",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "Manual Testing, Unit Tests for critical components.",
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.JUSTIFIED,
  //               spacing: { after: 600 },
  //             }),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 16 - User Experience and Interface
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "12. User Experience and Interface",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "12.1 Design Principles",
  //                   bold: true,
  //                   size: 28,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { before: 600, after: 400 },
  //             }),
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "• User-friendly\n• Mobile Responsive Design\n• Clean interface using Bootstrap\n• Intuitive navigation\n• Consistent design language",
  //                   size: 24,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               spacing: { after: 600 },
  //             }),

  //             // Add UI Screenshots if available
  //             ...(student.projectAssets?.uiScreenshots ?
  //               await Promise.all(student.projectAssets.uiScreenshots.slice(0, 3).map(async (ui, index) => {
  //                 const imageData = await getImageAsBase64(ui.url);
  //                 return new Paragraph({
  //                   children: [
  //                     new ImageRun({
  //                       data: imageData,
  //                       transformation: {
  //                         width: 400,
  //                         height: 300,
  //                       },
  //                     }),
  //                   ],
  //                   alignment: AlignmentType.CENTER,
  //                   spacing: { after: 400 },
  //                 });
  //               })) : []
  //             ),

  //             // Page Break
  //             new Paragraph({
  //               children: [new PageBreak()],
  //             }),

  //             // PAGE 17 - Conclusion
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: "13. Conclusion",
  //                   bold: true,
  //                   size: 32,
  //                   font: "Times New Roman",
  //                 }),
  //               ],
  //               alignment: AlignmentType.CENTER,
  //               spacing: { after: 800 },
  //             }),
  //             ...parseContentSection(content.conclusion),
  //           ],
  //         },
  //       ],
  //     });

  //     // Generate and save the document
  //     const buffer = await Packer.toBuffer(doc);
  //     const fileName = `${student.projectDetails?.projectName || "Project"}_Report.docx`;

  //     saveAs(new Blob([buffer]), fileName);

  //   } catch (error) {
  //     console.error("Error generating Word document:", error);
  //     alert("Error generating Word document. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  if (!student)
    return (
      <div className="p-5 flex justify-center h-screen items-center">
        Loading...
      </div>
    );
  // console.log(student);

  return (
    <div className="p-5 space-y-4 ">
      <span
        className={`h-1 shadow-indigo-400 shadow bg-indigo-500 absolute top-0 left-0`}
        style={{ width: `${progress}%` }}
      ></span>
      <div className="flex justify-center">
        <div className="space-x-2 mb-4">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/dashboard");
              }
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handlePrint}
            disabled={isdisabled}
            className={`bg-blue-500 text-white px-4 py-2 rounded  ${
              isdisabled ? "bg-gray-400 cursor-not-allowed" : "primary"
            }`}
          >
            Print
          </button>
          {/* <button
            onClick={handleDownloadWord}
            disabled={isdisabled || loading}
            className={`bg-green-500 text-white px-4 py-2 rounded ${
              isdisabled || loading ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Generating..." : "Download Word"}
          </button> */}
        </div>
      </div>

      {/* PDF Content - A4 size */}
      <div
        ref={pdfRef}
        id="pdf-content"
        className="   bg-white text-black w-[210mm]  mx-auto shadow-lg"
        style={{
          fontFamily: "'Times New Roman', serif",
          fontSize: "12pt",
          lineHeight: "1.5",
        }}
      >
        {/* Page 1 */}
        <div className=" page-break flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold mb-8 mt-10 uppercase">
            {student.projectDetails?.projectName}
          </h1>
          <h2 className="text-2xl mb-8">Project Report</h2>

          <p className="mb-8">
            Submitted in Partial fulfillment for the award of
            <br />
            {student.collegeInfo?.course === "MCA" &&
              "Master of Computer Applications"}
            {student.collegeInfo?.course === "BCA" &&
              "Bachelor of Computer Applications"}
            {student.collegeInfo?.course !== "MCA" &&
              student.collegeInfo?.course !== "BCA" && (
                <>{student.collegeInfo?.course} in </>
              )}
            {student.collegeInfo?.branch}
          </p>

          <p className="font-bold mb-8 text-xl">
            DIGICODERS TECHNOLOGIES PVT. LTD. <br />
            LUCKNOW(UP)
          </p>
          {/* <div className="w-full"> */}
          <div className="flex justify-evenly w-full ">
            <div>
              <Image
                src="/img/digicoders_logo.jpg"
                alt="Logo"
                width={150}
                height={100}
              />
            </div>

            {student.collegeInfo?.collegeLogo?.url && (
              <div>
                <img
                  src={student.collegeInfo?.collegeLogo?.url}
                  alt="Logo"
                  width={150}
                  height={100}
                />
              </div>
            )}
          </div>
          {/* </div> */}
          <div className="flex w-full justify-evenly mt-8">
            <div className="mb-8 p-4 border-2 border-sky-400 w-64">
              <p className="font-bold">Assist By</p>
              <p>Er. Himanshu Kashyap</p>
              <p>Project Manager-DigiCoders</p>
            </div>
            <div className="mb-8 p-4 border-2 border-sky-400 w-64">
              <p className="font-bold">Submitted to</p>
              <p className=" capitalize">
                Er. {student.collegeInfo?.TeacherName}
              </p>
              <p> HOD </p>
            </div>
          </div>

          <p className="mb-8">Session - {student.collegeInfo?.session}</p>

          <p className="font-bold text-2xl px-20 uppercase">
            {student.collegeInfo?.collegeName}
          </p>
          <div className="flex justify-between w-lg">
            <div className="mt-10">
              <p className="font-bold">Submitted By:</p>
              <p className="capitalize">{student.personalDetails?.name}</p>
            </div>
            <div className="mt-10">
              <p className="font-bold">Submitted to:</p>
              <p className="capitalize">{student.collegeInfo?.TeacherName}</p>
            </div>
          </div>
        </div>

        {/* Page 2 */}
        {/* <div
          className="page-break  flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">
            CERTIFICATE{" "}
          </h1>

          <p className="mb-4 text-justify">
            This is to certify that the project work titled "
            <strong className=" uppercase">
              {student.projectDetails?.projectTitle}
            </strong>
            " has been successfully completed by{" "}
            <strong className="uppercase">
              {student.personalDetails?.name}
            </strong>{" "}
            under my supervision and guidance
          </p>
          <p className="mb-4 text-justify">
            This project is a bonafide piece of work carried out by the student
            during the academic year {student.collegeInfo?.session} as part of
            the{" "}
            <strong className="uppercase">
              {student.projectDetails?.duration}{" "}
              {student.projectDetails?.TrainingType}{" "}
            </strong>{" "}
            program at{" "}
            <strong className="uppercase">
              {" "}
              DigiCoders Technologies Pvt Ltd.
            </strong>
          </p>
          <p className="mb-4 text-justify">
            The project work demonstrates a comprehensive understanding of web
            development technologies and represents original work in the field
            of job portal development. The student has shown dedication,
            technical competence, and professional approach throughout the
            project duration.
          </p>
          <p className="mb-4 text-justify">
            This project is submitted in partial fulfillment of the requirements
            for the{" "}
            <strong className="uppercase">
              {student.collegeInfo?.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo?.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo?.course !== "MCA" &&
                student.collegeInfo?.course !== "BCA" && (
                  <>{student.collegeInfo?.course} in </>
                )}
              {student.collegeInfo?.branch}
            </strong>{" "}
            from{" "}
            <strong className=" uppercase">
              {student.collegeInfo?.collegeName}.
            </strong>
          </p>

          <p className=" text-justify">
            I recommend this project work for evaluation and acceptance.
          </p>

          <p className="mt-10 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2  flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>

          <p className="mt-5 ">
            <strong>Institution:</strong>{" "}
            <span className=" capitalize">
              {" "}
              {student.collegeInfo?.collegeName}
            </span>
          </p>
          <p className="mt-2  capitalize">
            <strong>Department:</strong>{" "}
            {student.collegeInfo?.course === "MCA" &&
              "Master of Computer Applications"}
            {student.collegeInfo?.course === "BCA" &&
              "Bachelor of Computer Applications"}
            {student.collegeInfo?.course === "MCA" && "BCA"
              ? ""
              : student.collegeInfo?.branch}
          </p>
          <p className="mt-2 ">
            <strong>Academic Year:</strong> {student.collegeInfo?.session}
          </p>
        </div> */}

        {/* Page 3 */}
        <div
          className="page-break    flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">
            CERTIFICATE OF APPROVAL
          </h1>

          <p className="mb-4 text-justify">
            This is to certify that the project titled “
            <strong className=" uppercase">
              {student.projectDetails?.projectName}
            </strong>
            ” has been successfully completed by{" "}
            <strong className=" uppercase">
              {student.personalDetails?.name}
            </strong>
            , under the technical guidance and project development support of{" "}
            <strong className="uppercase">
              {" "}
              DigiCoders Technologies Pvt Ltd.
            </strong>
          </p>
          <p className="mb-4 text-justify">
            The project work has been reviewed and evaluated by the technical
            team at Digicoders and is hereby approved as a valid and original
            project carried out in the field of{" "}
            <strong className="uppercase">
              {student.collegeInfo?.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo?.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo?.course === "MCA" && "BCA"
                ? ""
                : student.collegeInfo?.branch}
              .
            </strong>
            . The project meets the academic and technical standards required
            for submission towards the fulfillment of the{" "}
            <strong className="uppercase">
              {student.collegeInfo?.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo?.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo?.course === "MCA" && "BCA"
                ? ""
                : student.collegeInfo?.branch}
              .
            </strong>
          </p>
          <p className="mb-4 text-justify">
            This approval acknowledges that the project has been prepared with
            proper effort, guidance, and technical support. However, it does not
            imply that{" "}
            <strong className="uppercase">
              {" "}
              Digicoders Technologies Pvt. Ltd.
            </strong>{" "}
            endorses or agrees with every opinion, conclusion, or interpretation
            expressed in the project report. The project is accepted solely for
            academic evaluation purposes.
          </p>
          <p className="mb-4 text-justify">
            We commend{" "}
            <strong className=" uppercase">
              {student.personalDetails?.name}
            </strong>{" "}
            for the dedication and sincerity shown during the project
            development process.
          </p>

          <p className="mt-10 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2 mb-10 flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>

          <div className="flex justify-between mt-14">
            <div>
              <div>________________________</div>
              <p className="font-bold">(INTERNAL EXAMINER)</p>
            </div>

            <div>
              <div>________________________</div>
              <p className="font-bold">(EXTERNAL EXAMINER)</p>
            </div>
          </div>
        </div>

        {/* Page 4 */}
        <div
          className="page-break    flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">DECLARATION</h1>

          <p className="mb-4 text-justify">
            I hereby declare that the work presented in this Minor Project
            titled “
            <strong className=" uppercase">
              {student.projectDetails?.projectName}
            </strong>
            ” is the result of my own effort and is an original contribution to
            the field of{" "}
            <strong className=" uppercase">
              {student.collegeInfo?.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo?.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo?.course === "MCA" && "BCA"
                ? ""
                : student.collegeInfo?.branch}
              .
            </strong>
          </p>
          <p className="mb-4 text-justify">
            This project has been carried out as a part of the academic
            requirements for the{" "}
            <strong className=" uppercase">
              {" "}
              {student.collegeInfo?.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo?.course === "BCA" &&
                "Bachelor of Computer Applications"}{" "}
              {student.collegeInfo?.course === "MCA" || "BCA"
                ? ""
                : `${student.collegeInfo?.course} in ${student.collegeInfo?.branch}`}
            </strong>{" "}
            at{" "}
            <strong className=" uppercase">
              {student.collegeInfo?.collegeName}.
            </strong>{" "}
            To the best of my knowledge, the content of this project is
            authentic, accurate, and has been completed in accordance with
            engineering ethics and academic standards.
          </p>
          <p className="mb-4 text-justify">
            I further declare that this project work does not contain any
            material that has been previously submitted to any other university
            or institution for the award of any degree or diploma. Additionally,
            this project does not infringe upon any existing patents,
            copyrights, or intellectual property rights.
          </p>

          <p className="mt-20 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4  flex gap-2 capitalize">
            <strong> Student Name:</strong> {student.personalDetails?.name}
          </p>
          {String(student.projectDetails?.TeamName || "").trim() && (
            <p className="flex gap-2 capitalize">
              <strong>Team Name:</strong>
              <span>{String(student.projectDetails?.TeamName).trim()}</span>
            </p>
          )}

          <p className="mt-2 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2 mb-10 flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>
        </div>

        {/* Page 5 */}
        <div
          className="page-break    flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className="flex justify-center">
            <img
              src="/img/Digicoders-new-logo.png"
              className="border-b-2 mb-20 "
              width={400}
            />
          </div>
          <h1 className="text-center text-2xl font-black mb-10">
            {" "}
            ACKNOWLEDGEMENT
          </h1>

          <p className="mb-4 text-justify">
            The successful completion of this project would not have been
            possible without the support, guidance, and encouragement of several
            individuals and organizations. I would like to express my sincere
            gratitude to all those who contributed to this project.
          </p>

          <p className="mb-4 text-justify">
            First and foremost, I am extremely thankful to{" "}
            <strong className="uppercase">
              {" "}
              Digicoders Technologies Pvt. Ltd.
            </strong>
            , for providing me with the opportunity to work on this project.
            Their valuable resources, technical expertise, and continuous
            support throughout the development process played a crucial role in
            the successful completion of this work.
          </p>

          <p className="mb-4 text-justify">
            I extend my heartfelt gratitude to{" "}
            <strong className=" uppercase">
              {" "}
              {student.collegeInfo?.TeacherName}
            </strong>
            , Head of the Department of{" "}
            <strong className=" uppercase">
              {student.collegeInfo?.course === "MCA" &&
                "Master of Computer Applications"}
              {student.collegeInfo?.course === "BCA" &&
                "Bachelor of Computer Applications"}
              {student.collegeInfo?.course === "MCA" && "BCA"
                ? ""
                : student.collegeInfo?.branch}
              , {student.collegeInfo?.collegeName},{" "}
            </strong>
            for his constant guidance, motivation, and valuable suggestions at
            every stage of this project.
          </p>

          <p className="mb-4 text-justify">
            I am also grateful to all the faculty members and staff of the
            <strong className="uppercase">
              {" "}
              Digicoders Technologies Pvt. Ltd.
            </strong>{" "}
            for their support, cooperation, and encouragement during the project
            development.
          </p>
          <p className="mb-4 text-justify">
            A special thanks to{" "}
            <strong className="uppercase">Er. Himanshu Kashyap,</strong> for his
            consistent mentorship, motivation, and insightful feedback, which
            helped me overcome challenges and guided me in the right direction.
          </p>

          <p className="mt-10 text-justify">
            <strong>Project Guide/Supervisor</strong>
            <br />
            Digicoders Technologies Pvt Ltd
          </p>
          <p className="mt-4  flex gap-2 capitalize">
            <strong> Student Name:</strong> {student.personalDetails?.name}
          </p>
          {String(student.projectDetails?.TeamName || "").trim() && (
            <p className="flex gap-2 capitalize">
              <strong>Team Name:</strong>
              <span>{String(student.projectDetails?.TeamName).trim()}</span>
            </p>
          )}
          <p className="mt-2 flex gap-2">
            <strong>Date:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
          <p className="mt-2 mb-10 flex gap-2">
            <strong>Place:</strong>
            <span className="border-b border-black border-dashed w-32 inline-block">
              Aliganj Lucknow
            </span>
          </p>
        </div>
        <div
          className="page-break    flex flex-col p-8"
          style={{ pageBreakAfter: "always" }}
        >
          <div className=" relative">
            <div className=" absolute top-[17%] left-[70%] font-bold bg-white uppercase font-sans">
              {student?.personalDetails?.certificateNumber}
            </div>
            <div className=" absolute top-[17%] left-[24%] font-bold bg-white uppercase font-sans">
              {student?.createdAt?.split("T")[0]}
            </div>
            <div className=" absolute top-[49.5%] left-[30%] font-bold uppercase font-sans">
              {student.personalDetails?.name}
            </div>
            <div className=" absolute top-[57%] left-[20%] font-bold uppercase font-sans">
              {student.projectDetails?.TrainingType}
            </div>
            <div className=" absolute bottom-[37%] left-[20%] font-bold uppercase font-sans">
              {student.projectDetails?.backendTechnology}
            </div>
            <div className=" absolute bottom-[37%] right-[17%] font-bold uppercase font-sans">
              " A++ "
            </div>
            <div className=" absolute bottom-[33%] left-[25%] font-bold uppercase font-sans">
              {student.projectDetails?.duration}
            </div>
            <div className=" absolute bottom-[33%] left-[50%] font-bold uppercase font-sans">
             {student.projectDetails?.StartDate
  ? new Date(student.projectDetails.StartDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  : ""}
            </div>
            <div className=" absolute bottom-[33%] right-[15%] font-bold uppercase font-sans">
               {student.projectDetails?.EndDate
  ? new Date(student.projectDetails.EndDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  : ""}

            </div>
            <div className=" absolute bottom-[23%] right-[42%] font-bold uppercase font-sans">
              <img src="/img/mohar.png" width={100} alt="" />
            </div>
            <div className=" absolute bottom-[26%] right-[22%] font-bold uppercase font-sans">
              <img src="/img/gopalsir.png" width={100} alt="" />
            </div>
            <div className=" absolute bottom-[26%] left-[20%] font-bold uppercase font-sans">
              <img src="/img/himanshusir.png" width={100} alt="" />
            </div>
            <img src="/img/Certificate.jpg" alt="" />
          </div>
        </div>

        {/* Page 6 - Index */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">INDEX</h1>

          <div className="space-y-2">
            <h2 className="font-bold">1. Introduction</h2>
            <ul className="ml-8 list-disc">
              <li>1.1 Overview </li>
              <li>1.2 Background of the Project</li>
              <li>1.3 Objectives and Scope</li>
              <li>1.4 Intended Audience</li>
              <li>1.5 Problem Definition</li>
            </ul>

            <h2 className="font-bold mt-4">2. Project Goals</h2>
            <ul className="ml-8 list-disc">
              <li>2.1 Purpose and Benefits</li>
              <li>2.2 Key Deliverables</li>
            </ul>

            <h2 className="font-bold mt-4">3. System Analysis</h2>
            <ul className="ml-8 list-disc">
              <li>3.1 Objectives</li>
              <li>3.2 Agile Development Model Process</li>
              <ul className="ml-8 list-disc">
                <li>3.2.1 Project Inception and Planning</li>
                <li>3.2.2 Requirements Gathering and Analysis</li>
                <li>3.2.3 Iterative Development</li>
                <li>3.2.4 Design and Prototyping</li>
                <li>3.2.5 Development and Integration</li>
                <li>3.2.6 Testing and Quality Assurance</li>
                <li>3.2.7 Deployment and Release</li>
                <li>3.2.8 Maintenance and Iteration</li>
              </ul>
              <li>3.3 ER Diagram</li>
              <li>3.4 Data Flow Diagram</li>
            </ul>

            <h2 className="font-bold mt-4">4. Core Features</h2>
            <ul className="ml-8 list-disc">
              <li>4.1 Voter Registration and Authentication</li>
              <li>4.2 Candidate Management</li>
              <li>4.3 Voting Process and Ballot Casting</li>
              <li>4.4 Real-time Vote Counting and Results Display</li>
              <li>4.5 Security and Fraud Prevention</li>
            </ul>

            <h2 className="font-bold mt-4">5. Technology Stack</h2>
            <ul className="ml-8 list-disc">
              <li>5.1 Frontend Technologies</li>
              <li>5.2 Backend Technologies</li>
              <li>5.3 Database Solutions</li>
            </ul>

            <h2 className="font-bold mt-4">6. System Architecture</h2>
            <ul className="ml-8 list-disc">
              <li>6.1 High-Level Architecture Overview</li>
              <li>6.2 Key System Components</li>
            </ul>

            <h2 className="font-bold">7. System Design Methodology</h2>
            <ul className="ml-8 list-disc">
              <li>7.1 Top-Down Design</li>
              <li>7.2 Bottom-Up Design</li>
              <li>7.3 Modular Design Approach</li>
            </ul>

            <h2 className="font-bold mt-4">8. Backend Design</h2>
            <ul className="ml-8 list-disc">
              <li>8.1 Description of Classes and Models </li>
              <li>8.2 Defined URLs</li>
            </ul>

            <h2 className="font-bold mt-4">9. Data Modeling</h2>
            <ul className="ml-8 list-disc">
              <li>9.1 Database Schema Overview</li>
              <li>9.2 List of Tables</li>
            </ul>

            <h2 className="font-bold mt-4">10. Development Plan</h2>
            <ul className="ml-8 list-disc">
              <li>10.1 Phases of Development</li>
              <li>10.2 Timeline and Milestones</li>
            </ul>

            <h2 className="font-bold mt-4">
              11. Testing and Quality Assurance
            </h2>
            <ul className="ml-8 list-disc">
              <li>11.1 Testing Strategies</li>
              <li>11.2 Testing Methodologies</li>
              <li>11.3 User Acceptance Testing</li>
            </ul>

            <h2 className="font-bold mt-4">
              12. User Experience and Interface
            </h2>
            <ul className="ml-8 list-disc">
              <li>12.1 Design Principles</li>
              <li>12.2 User Interface Screenshots</li>
            </ul>
            <h2 className="font-bold mt-4">13. Conclusion</h2>
            <ul className="ml-8 list-disc">
              <li>13.1 Summary of Project Achievements</li>
              <li>13.2 Future Work and Enhancements</li>
            </ul>
          </div>
        </div>
        {/* Page 8 - 1. Introduction */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            1. Introduction
          </h1>
          <div className="space-y-2 text-justify">
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[1]}
            </h2>
            <p>{content?.introduction.split("**")[2]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[3]}
            </h2>
            <p>{content?.introduction.split("**")[4]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[5]}
            </h2>
            <p>{content?.introduction.split("**")[6]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[7]}
            </h2>
            <p>{content?.introduction.split("**")[8]}</p>
            <h2 className="font-bold mt-4">
              {content?.introduction.split("**")[9]}
            </h2>
            <p>{content?.introduction.split("**")[10]}</p>
          </div>
        </div>
        {/* Page 9 - 2. Project Goals */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            2. Project Goals
          </h1>
          <div className="space-y-2 text-justify">
            {content?.projectGoals ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.projectGoals.split("**")[1]}
                </h2>
                <p>{content?.projectGoals.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.projectGoals.split("**")[3]}
                </h2>
                <p>{content?.projectGoals.split("**")[4]}</p>
              </>
            ) : (
              <p>Loading Project Goals content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 3. System Analysis */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            3. System Analysis
          </h1>
          <div className="space-y-2 text-justify">
            {content?.systemAnalysis ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.systemAnalysis.split("**")[1]}
                </h2>
                <p>{content?.systemAnalysis.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemAnalysis.split("**")[3]}
                </h2>
                <p>{content?.systemAnalysis.split("**")[4]}</p>
              </>
            ) : (
              <p>Loading System Analysis content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 3. System Analysis */}
        <div className="page-break flex   flex-col p-8">
          <div className="space-y-2">
            <h2 className="texl-sm font-black">3.3 ER Diagram</h2>
            <div className="flex justify-center">
              <img
                src={
                  student.projectAssets?.erDiagram?.url
                    ? student.projectAssets.erDiagram.url
                    : "/img/erdigram.png"
                }
                alt=""
                width={500}
              />
            </div>
            <h2 className="texl-sm font-black">3.4 Data Flow Diagram</h2>
            <div className="flex justify-center">
              <img
                src={
                  student.projectAssets?.dfdDiagram?.url
                    ? student.projectAssets.dfdDiagram.url
                    : "/img/dfddigram.png"
                }
                alt=""
                width={500}
              />
            </div>
          </div>
        </div>
        {/* Page 9 - 4. Core Features */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            4. Core Features
          </h1>
          <div className="space-y-2 text-justify">
            {content?.coreFeatures ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[1]}
                </h2>
                <p>{content?.coreFeatures.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[3]}
                </h2>
                <p>{content?.coreFeatures.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[5]}
                </h2>
                <p>{content?.coreFeatures.split("**")[6]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[7]}
                </h2>
                <p>{content?.coreFeatures.split("**")[8]}</p>
                <h2 className="font-bold mt-4">
                  {content?.coreFeatures.split("**")[9]}
                </h2>
                <p>{content?.coreFeatures.split("**")[10]}</p>
              </>
            ) : (
              <p>Loading Core Features content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 5. Technology Stack */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            5. Technology Stack
          </h1>
          <div className="space-y-2">
            <h2 className="texl-sm font-black mt-5">
              5.1 Frontend Technologies
            </h2>
            <li>{student.projectDetails?.frontendTechnology}</li>
            <h2 className="texl-sm font-black mt-5">
              5.2 Backend Technologies
            </h2>
            <li>{student.projectDetails?.backendTechnology}</li>
            <h2 className="texl-sm font-black mt-5">5.3 Database Solutions</h2>
            <li>{student.projectDetails?.database}</li>
          </div>
          {/* </div> */}
          {/* Page 9 - 6. System Architecture */}
          {/* <div className="page-break flex   flex-col p-8"> */}
          <h1 className="text-2xl font-bold mb-6 text-center mt-10">
            6. System Architecture
          </h1>
          <div className="space-y-2 text-justify">
            {content?.systemArchitecture ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[1]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[3]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[5]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[6]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[7]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[8]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[9]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[10]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[11]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[12]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemArchitecture?.split("**")[13]}
                </h2>
                <p>{content?.systemArchitecture?.split("**")[14]}</p>
              </>
            ) : (
              <p>Loading System Architecture content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 7. System Design Methodology */}
        <div className=" page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            7. System Design Methodology
          </h1>
          <div className="space-y-2 text-justify">
            {content?.systemDesign ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[1]}
                </h2>
                <p>{content?.systemDesign?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[3]}
                </h2>
                <p>{content?.systemDesign?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[5]}
                </h2>
                <p>{content?.systemDesign?.split("**")[6]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[7]}
                </h2>
                <p>{content?.systemDesign?.split("**")[8]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[9]}
                </h2>
                <p>{content?.systemDesign?.split("**")[10]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[11]}
                </h2>
                <p>{content?.systemDesign?.split("**")[12]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[13]}
                </h2>
                <p>{content?.systemDesign?.split("**")[14]}</p>
                <h2 className="font-bold mt-4">
                  {content?.systemDesign?.split("**")[15]}
                </h2>
                <p>{content?.systemDesign?.split("**")[16]}</p>
              </>
            ) : (
              <p>Loading System Design Methodology content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 8. Backend Design */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            8. Backend Design
          </h1>
          <div className="space-y-2 text-justify">
            {content?.backendDesign ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.backendDesign?.split("**")[1]}
                </h2>
                <p>{content?.backendDesign?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.backendDesign?.split("**")[3]}
                </h2>
                <p>{content?.backendDesign?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.backendDesign?.split("**")[5]}
                </h2>
                <p>{content?.backendDesign?.split("**")[6]}</p>
              </>
            ) : (
              <p>Loading Backend Design content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 9. Data Modeling */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            9. Data Modeling
          </h1>
          <div className="space-y-2 text-justify">
            {content?.dataModeling ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[1]}
                </h2>
                <p>{content?.dataModeling?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[3]}
                </h2>
                <p>{content?.dataModeling?.split("**")[4]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[5]}
                </h2>
                <p>{content?.dataModeling?.split("**")[6]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[7]}
                </h2>
                <p>{content?.dataModeling?.split("**")[8]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[9]}
                </h2>
                <p>{content?.dataModeling?.split("**")[10]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[11]}
                </h2>
                <p>{content?.dataModeling?.split("**")[12]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[13]}
                </h2>
                <p>{content?.dataModeling?.split("**")[14]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[15]}
                </h2>
                <p>{content?.dataModeling?.split("**")[16]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[17]}
                </h2>
                <p>{content?.dataModeling?.split("**")[18]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[19]}
                </h2>
                <p>{content?.dataModeling?.split("**")[20]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[21]}
                </h2>
                <p>{content?.dataModeling?.split("**")[22]}</p>
                <h2 className="font-bold mt-4">
                  {content?.dataModeling?.split("**")[23]}
                </h2>
                <p>{content?.dataModeling?.split("**")[24]}</p>
              </>
            ) : (
              <p>Loading Data Modeling content...</p>
            )}
          </div>
        </div>
        {/* Page 9 - 10. Development Plan */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            10. Development Plan
          </h1>
          <div className="space-y-2">
            <h2 className=" font-black mt-5">10.1 Phases of Development</h2>
            <ol className="list-decimal list-inside ml-4 mt-2">
              <li>Requirements</li>
              <li>UI/UX Design</li>
              <li>Backend Logic</li>
              <li>PDF Export</li>
              <li>Testing</li>
              <li>Deployment</li>
            </ol>

            <h2 className=" font-black mt-5">10.2 Timeline and Milestones</h2>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Week 1-2: Planning & Design</li>
              <li>Week 3-4: Backend Implementation</li>
              <li>Week 5: PDF Integration</li>
              <li>Week 6: Testing & Debugging</li>
              <li>Week 7: Final Deployment</li>
            </ul>
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center  mt-20">
            11. Testing and Quality Assurance
          </h1>
          <div className="space-y-2">
            <h2 className=" font-black mt-5">11.1 Testing Strategies</h2>
            <p>Manual Testing, Unit Tests for critical components.</p>
            <h2 className=" font-black mt-5">11.2 Testing Methodologies</h2>
            <p>Black-box and White-box testing.</p>
            <h2 className=" font-black mt-5">11.3 User Acceptance Testing</h2>
            <p>Final test conducted by a sample group of users.</p>
          </div>
        </div>
        {/* Page 9 - 12. User Experience and Interface */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            12. User Experience and Interface
          </h1>
          <div className="space-y-2">
            <h2 className=" font-black mt-5">12.1 Design Principles</h2>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>User-friendly,</li>
              <li>Mobile Responsive Design</li>
              <li>Clean interface using Bootstrap</li>
              <li>Intuitive navigation</li>
              <li>Consistent design language</li>
            </ul>
            <h2 className=" font-black mt-5">
              12.2 User Interface Screenshots
            </h2>
            <pre className="text-xs overflow-x-hidden">
              {student.projectAssets?.projectCode[0]}
              {student.projectAssets?.projectCode[1]}
              {student.projectAssets?.projectCode[2]}
              {student.projectAssets?.projectCode[3]}
              {student.projectAssets?.projectCode[4]}
            </pre>

            <div>
              {student.projectAssets?.uiScreenshots
                ? student.projectAssets?.uiScreenshots.map((ui, index) => (
                    <div key={index}>
                      <img src={ui.url} alt="" />
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
        {/* Page 9 - 13. Conclusion */}
        <div className="page-break flex   flex-col p-8">
          <h1 className="text-2xl font-bold mb-6 text-center ">
            13. Conclusion
          </h1>
          <div className="space-y-2 text-justify">
            {content?.conclusion ? (
              <>
                <h2 className="font-bold mt-4">
                  {content?.conclusion?.split("**")[1]}
                </h2>
                <p>{content?.conclusion?.split("**")[2]}</p>
                <h2 className="font-bold mt-4">
                  {content?.conclusion?.split("**")[3]}
                </h2>
                <p>{content?.conclusion?.split("**")[4]}</p>
              </>
            ) : (
              <p>Loading Conclusion content...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
