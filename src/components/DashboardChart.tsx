import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function DashboardChart() {
  const [counts, setCounts] = useState({
    new: 0,
    accept: 0,
    SendToPrint: 0,
    SendToStudent: 0,
    reject: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/students/count?status=new").then((res) => res.json()),
      fetch("/api/students/count?status=accept").then((res) => res.json()),
      fetch("/api/students/count?status=isSendToPrint").then((res) =>
        res.json()
      ),
      fetch("/api/students/count?status=isSendToStudent").then((res) =>
        res.json()
      ),
      fetch("/api/students/count?status=reject").then((res) => res.json()),
    ])
      .then(([newData, acceptData, printData, studentData, rejectData]) => {
        setCounts({
          new: newData.count || 0,
          accept: acceptData.count || 0,
          SendToPrint: printData.count || 0,
          SendToStudent: studentData.count || 0,
          reject: rejectData.count || 0,
        });
      })
      .catch((err) => {
        console.error("Error fetching counts:", err);
      });
  }, []);

  const data = {
    labels: ["New", "Accepted", "Send To Print", "Send To Student", "Rejected"],
    datasets: [
      {
        label: "Students",
        data: [
          counts.new,
          counts.accept,
          counts.SendToPrint,
          counts.SendToStudent,
          counts.reject,
        ],
        backgroundColor: [
          "#60a5fa", // blue
          "#34d399", // green
          "#0af8ff", // cyan
          "#ff990a", // orange
          "#f87171", // red
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white p-6 shadow rounded mb-6">
      <h3 className="text-lg font-bold mb-4 text-center">Students Overview</h3>
      <Bar data={data} options={options} />
    </div>
  );
}

export default DashboardChart;
