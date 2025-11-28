"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiFilePlus,
  FiCheckCircle,
  FiPrinter,
  FiSend,
  FiXCircle,
  FiLogOut,
} from "react-icons/fi";

interface SidebarProps {
  active: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode; // ✅ FIXED
}

export default function Sidebar({ active }: SidebarProps) {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <FiHome /> },
    { label: "New", href: "/dashboard/new", icon: <FiFilePlus /> },
    { label: "Accepted", href: "/dashboard/accept", icon: <FiCheckCircle /> },
    { label: "Send To Print", href: "/dashboard/send-print", icon: <FiPrinter /> },
    { label: "Send To Student", href: "/dashboard/send-student", icon: <FiSend /> },
    { label: "Rejected", href: "/dashboard/reject", icon: <FiXCircle /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <aside className="p-4">
      <div className="flex items-center gap-3 relative">
        <div className="font-extrabold text-3xl">
          Digi<span className="text-orange-400">{"{"}</span>
          <span className="text-green-400">Coders</span>
          <span className="text-orange-400">{"}"}</span>
        </div>
      </div>

      <nav className="space-y-2 pt-10">
        {menuItems.map((item) => (
          <Link prefetch 
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 w-full text-left p-2 rounded transition ${
              active === item.href
                ? "bg-gray-200 dark:bg-gray-400 font-semibold"
                : "hover:bg-gray-200 dark:hover:bg-gray-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-red-100 text-red-600 transition"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
