import React from "react";
import { LeadsList } from "@/features/leads-management";
import type { Lead } from "@/entities/lead";

const LeadsPage: React.FC = () => {
  const handleLeadSelect = (lead: Lead) => {
    console.log("Selected lead:", lead);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Mini Seller Console
            </h1>
            <p className="mt-2 text-gray-600">
              Triage leads and convert them into opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <div className="space-y-6">
                <LeadsList onLeadSelect={handleLeadSelect} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;
