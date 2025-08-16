import React from "react";
import type { Lead } from "@/entities/lead";
import { SlideOver } from "@/shared/ui";
import { getStatusColor, getScoreColor } from "../lib/helpers";

interface LeadDetailProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  isOpen,
  onClose,
}) => {
  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Lead Details">
      {lead && (
        <>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {lead.name}
            </h3>
            <p className="text-lg text-gray-600 font-medium">{lead.company}</p>
          </div>

          <div className="space-y-6 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Contact Information
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </span>
                  <p className="text-base text-gray-900 font-medium">
                    {lead.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Lead Details
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Source
                  </span>
                  <p className="text-base text-gray-900 font-medium">
                    {lead.source}
                  </p>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Score
                  </span>
                  <p
                    className={`text-lg font-bold ${getScoreColor(lead.score)}`}
                  >
                    {lead.score}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </span>
              </div>
              <div>
                <span
                  className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Edit Lead
            </button>
          </div>
        </>
      )}
    </SlideOver>
  );
};

export default LeadDetail;
