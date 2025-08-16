import React from "react";
import type { Lead } from "@/entities/lead";
import { getStatusColor, getScoreColor } from "../lib/helpers";

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  return (
    <button
      onClick={() => onClick(lead)}
      className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {lead.name}
          </h3>
          <p className="text-sm text-gray-600 truncate">{lead.company}</p>
        </div>
        <div className="flex flex-col items-end space-y-1 ml-3">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              lead.status
            )}`}
          >
            {lead.status}
          </span>
          <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
            Score: {lead.score}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-16">Email:</span>
          <span className="text-gray-900 truncate flex-1">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-gray-500 w-16">Source:</span>
          <span className="text-gray-900">{lead.source}</span>
        </div>
      </div>
    </button>
  );
};

export default LeadCard;
