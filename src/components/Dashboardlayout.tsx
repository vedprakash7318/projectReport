"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    const token = sessionStorage.getItem("isLoggedIn");
    if (loggedIn !== "true") {
      router.replace("/login"); // agar login nahi hai to redirect
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  if (!isLoggedIn) return null; // jab tak check ho raha hai, kuch render na karo

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 dark:text-white text-black h-screen shadow p-4">
        <Sidebar active={pathname || ""} />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 h-screen overflow-y-auto">
        <main className="md:py-8 py-6 px-4">{children}</main>
      </div>
    </div>
  );
}
