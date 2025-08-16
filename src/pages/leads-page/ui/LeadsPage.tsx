import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  LeadsList,
  useLeads,
  useOpportunities,
} from "@/features/leads-management";
import LeadDetail from "@/features/leads-management/ui/LeadDetail";
import { useUpdateLead } from "@/features/leads-management/lib/useUpdateLead";
import { Header, Dashboard } from "@/shared/ui";
import { OpportunitiesTable } from "@/features/leads-management/ui/opportunities";
import type { Lead } from "@/entities/lead";
import type { LeadEditFormData } from "@/features/leads-management/lib/validation";
import type { CreateOpportunityData } from "@/features/leads-management/types";

const LeadsPage: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newlyCreatedOpportunityId, setNewlyCreatedOpportunityId] = useState<
    string | null
  >(null);
  const updateLeadMutation = useUpdateLead();
  const opportunitiesHook = useOpportunities();
  const { data: leads = [] } = useLeads();

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
    const existingOpportunities =
      opportunitiesHook.getOpportunitiesByLeadId(leadId);
    return existingOpportunities.length > 0;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            leadsCount={leads.length}
            opportunitiesCount={opportunitiesHook.opportunities.length}
            conversionRate={
              leads.length > 0
                ? Math.round(
                    (opportunitiesHook.opportunities.length / leads.length) *
                      100
                  )
                : 0
            }
            totalValue={opportunitiesHook.opportunities.reduce(
              (sum, opp) => sum + (opp.amount || 0),
              0
            )}
          />
        );
      case "leads":
        return <LeadsList onLeadSelect={handleLeadSelect} />;
      case "opportunities":
        return (
          <OpportunitiesTable
            opportunities={opportunitiesHook.opportunities}
            newlyCreatedOpportunityId={newlyCreatedOpportunityId}
          />
        );
      default:
        return <LeadsList onLeadSelect={handleLeadSelect} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-full flex flex-col">
          {renderContent()}

          <LeadDetail
            lead={selectedLead}
            isOpen={isSlideOverOpen}
            onClose={handleCloseSlideOver}
            onUpdate={handleUpdateLead}
            onConvertToOpportunity={handleConvertToOpportunity}
            isLeadAlreadyConverted={
              selectedLead ? isLeadAlreadyConverted(selectedLead.id) : false
            }
          />
        </div>
      </main>
    </div>
  );
};

export default LeadsPage;
