import React from "react";
import DashboardStats from "@/components/organisms/DashboardStats";

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in your classroom.</p>
      </div>
      
      <DashboardStats />
    </div>
  );
};

export default Dashboard;