import DataGrid from "@/components/shared/DataGrid";
import DataCharts from "@/components/shared/DataCharts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10">
      <DataGrid />
      <DataCharts />
    </div>
  );
};

export default DashboardPage;
