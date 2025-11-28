
"use client";

import { useEffect, useState } from "react";
import DashboardChart from "@/components/DashboardChart";
import DashboardLayout from "@/components/Dashboardlayout";

export default function StudentDashboard() {
  
  return (

      <DashboardLayout>
        <DashboardChart />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard title="New" status="new" />
          <DashboardCard title="Accepted" status="accept" />
          <DashboardCard title="Send To Print" status="isSendToPrint" />
          <DashboardCard title="Send To Student" status="isSendToStudent" />
          <DashboardCard title="Rejected" status="reject" />
        </div>
      </DashboardLayout>
  );
}

interface DashboardCardProps {
  title: string;
  status: string;
}

function DashboardCard({ title, status }: DashboardCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow rounded text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      <DashboardCount status={status} />
    </div>
  );
}

interface DashboardCountProps {
  status: string;
}

function DashboardCount({ status }: DashboardCountProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/students/count?status=${status}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count || 0))
      .catch((err) => console.error("Error fetching count:", err));
  }, [status]);

  return <p className="text-3xl mt-2">{count}</p>;
}
