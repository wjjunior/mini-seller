import React from "react";
import {
  UserGroupIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface DashboardProps {
  leadsCount: number;
  opportunitiesCount: number;
  conversionRate: number;
  totalValue: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  leadsCount,
  opportunitiesCount,
  conversionRate,
  totalValue,
}) => {
  const stats = [
    {
      name: "Total Leads",
      value: leadsCount,
      icon: UserGroupIcon,
      color: "bg-blue-500",
    },
    {
      name: "Opportunities",
      value: opportunitiesCount,
      icon: BriefcaseIcon,
      color: "bg-green-500",
    },
    {
      name: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: ChartBarIcon,
      color: "bg-purple-500",
    },
    {
      name: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Track your sales performance and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
