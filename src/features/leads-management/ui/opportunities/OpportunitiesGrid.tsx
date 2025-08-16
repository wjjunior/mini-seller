import React from "react";
import { Grid } from "@/shared/ui";
import type { Opportunity } from "@/features/leads-management/types";

interface OpportunitiesGridProps {
  opportunities: Opportunity[];
  newlyCreatedOpportunityId?: string | null;
}

const getStageColor = (stage: string): string => {
  const colors = {
    Prospecting: "bg-blue-100 text-blue-800",
    Qualification: "bg-yellow-100 text-yellow-800",
    Proposal: "bg-purple-100 text-purple-800",
    Negotiation: "bg-orange-100 text-orange-800",
    "Closed Won": "bg-green-100 text-green-800",
    "Closed Lost": "bg-red-100 text-red-800",
  };
  return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const formatAmount = (amount?: number): string => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const OpportunitiesGrid: React.FC<OpportunitiesGridProps> = ({
  opportunities,
  newlyCreatedOpportunityId = null,
}) => {
  const renderOpportunityCard = (opportunity: Opportunity) => (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 ${
        newlyCreatedOpportunityId === opportunity.id
          ? "animate-pulse border-blue-500 bg-blue-50"
          : "border-gray-200"
      }`}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {opportunity.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {opportunity.accountName}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(
              opportunity.stage
            )}`}
          >
            {opportunity.stage}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {formatAmount(opportunity.amount)}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          Created: {formatDate(opportunity.createdAt)}
        </div>
      </div>
    </div>
  );

  return (
    <Grid
      items={opportunities}
      renderItem={renderOpportunityCard}
      emptyMessage="No opportunities found"
      gridCols={{
        mobile: 1,
        tablet: 2,
        desktop: 3,
      }}
      itemsPerPage={6}
      keyExtractor={(opportunity) => opportunity.id}
    />
  );
};

export default OpportunitiesGrid;
