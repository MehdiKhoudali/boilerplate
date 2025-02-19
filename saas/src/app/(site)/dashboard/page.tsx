"use client";
import { PageHeader } from "@/src/components/ui/page-header";
import { Plus } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor everything here"
        actions={[
          {
            label: "Create new",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => {
              /* Add your handler */
            },
          },
          {
            label: "Update your plan",
            variant: "outline",
            onClick: () => {
              /* Add your handler */
            },
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
