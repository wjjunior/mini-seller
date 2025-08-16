import { useState } from "react";
import type {
  Opportunity,
  CreateOpportunityData,
} from "@/features/leads-management/types";

const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const createOpportunity = async (
    data: CreateOpportunityData
  ): Promise<Opportunity> => {
    const newOpportunity: Opportunity = {
      id: `opp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedOpportunities = [...opportunities, newOpportunity];
    setOpportunities(updatedOpportunities);

    return newOpportunity;
  };

  const updateOpportunity = async (
    id: string,
    data: Partial<Opportunity>
  ): Promise<Opportunity> => {
    const updatedOpportunities = opportunities.map((opp) =>
      opp.id === id
        ? { ...opp, ...data, updatedAt: new Date().toISOString() }
        : opp
    );

    setOpportunities(updatedOpportunities);

    const updated = updatedOpportunities.find((opp) => opp.id === id);
    if (!updated) {
      throw new Error("Opportunity not found");
    }

    return updated;
  };

  const deleteOpportunity = async (id: string): Promise<void> => {
    const updatedOpportunities = opportunities.filter((opp) => opp.id !== id);
    setOpportunities(updatedOpportunities);
  };

  const getOpportunityById = (id: string): Opportunity | undefined => {
    return opportunities.find((opp) => opp.id === id);
  };

  const getOpportunitiesByLeadId = (leadId: string): Opportunity[] => {
    return opportunities.filter((opp) => opp.leadId === leadId);
  };

  return {
    opportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunityById,
    getOpportunitiesByLeadId,
  };
};

export default useOpportunities;
