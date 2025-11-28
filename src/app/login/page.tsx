"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginPage from "@/components/login";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      router.replace("/dashboard"); // Agar already login hai to dashboard bhej do
    }
  }, [router]);

  return (
    <LoginPage
      onLogin={() => {
        sessionStorage.setItem("isLoggedIn", "true");
        router.replace("/dashboard"); // Login ke baad redirect to dashboard
      }}
    />
  );
}
