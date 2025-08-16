import React, { useState } from "react";
import { toast } from "react-toastify";
import { LeadsList } from "@/features/leads-management";
import LeadDetail from "@/features/leads-management/ui/LeadDetail";
import { useUpdateLead } from "@/features/leads-management/lib/useUpdateLead";
import { Tabs } from "@/shared/ui";
import { OpportunitiesTable } from "@/features/leads-management/ui/opportunities";
import { useOpportunities } from "@/features/leads-management/lib/opportunities";
import type { Lead } from "@/entities/lead";
import type { LeadEditFormData } from "@/features/leads-management/lib/validation";
import type { CreateOpportunityData } from "@/features/leads-management/types";

const LeadsPage: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");
  const [newlyCreatedOpportunityId, setNewlyCreatedOpportunityId] = useState<
    string | null
  >(null);
  const updateLeadMutation = useUpdateLead();
  const opportunitiesHook = useOpportunities();

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsSlideOverOpen(true);
  };

  const handleCloseSlideOver = () => {
    setIsSlideOverOpen(false);
    setSelectedLead(null);
  };

  const handleUpdateLead = async (leadId: string, data: LeadEditFormData) => {
    try {
      const updatedLead = await updateLeadMutation.mutateAsync({
        leadId,
        data,
      });
      setSelectedLead(updatedLead);
      toast.success("Lead updated successfully!");
    } catch (error) {
      console.error("Failed to update lead:", error);
      toast.error("Failed to update lead. Please try again.");
      throw error;
    }
  };

  const handleConvertToOpportunity = async (data: CreateOpportunityData) => {
    try {
      const newOpportunity = await opportunitiesHook.createOpportunity(data);
      toast.success("Lead successfully converted to opportunity!");

      setNewlyCreatedOpportunityId(newOpportunity.id);
      setActiveTab("opportunities");
      handleCloseSlideOver();

      setTimeout(() => {
        setNewlyCreatedOpportunityId(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to convert lead to opportunity:", error);
      toast.error("Failed to convert lead to opportunity. Please try again.");
      throw error;
    }
  };

  const isLeadAlreadyConverted = (leadId: string): boolean => {
    const existingOpportunities = opportunitiesHook.getOpportunitiesByLeadId(leadId);
    return existingOpportunities.length > 0;
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

          <Tabs
            tabs={[
              {
                id: "leads",
                label: "Leads",
                content: (
                  <div className="space-y-6">
                    <LeadsList onLeadSelect={handleLeadSelect} />
                  </div>
                ),
              },
              {
                id: "opportunities",
                label: "Opportunities",
                content: (
                  <OpportunitiesTable
                    opportunities={opportunitiesHook.opportunities}
                    newlyCreatedOpportunityId={newlyCreatedOpportunityId}
                  />
                ),
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <LeadDetail
            lead={selectedLead}
            isOpen={isSlideOverOpen}
            onClose={handleCloseSlideOver}
            onUpdate={handleUpdateLead}
            onConvertToOpportunity={handleConvertToOpportunity}
            isLeadAlreadyConverted={selectedLead ? isLeadAlreadyConverted(selectedLead.id) : false}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;
