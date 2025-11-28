"use client";

import DataTable from "@/components/DataTable";
import DashboardLayout from "@/components/Dashboardlayout";

export default function NewStudent() {
  return (
    <DashboardLayout>
      <DataTable title="Send To print" status="isSendToPrint" />
    </DashboardLayout>
  );
}
