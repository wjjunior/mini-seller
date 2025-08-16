import { useState, useEffect } from "react";
import type {
  Opportunity,
  CreateOpportunityData,
} from "@/features/leads-management/types";

const STORAGE_KEY = "opportunities";

const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOpportunities = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setOpportunities(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error("Failed to load opportunities:", error);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  const saveOpportunities = (newOpportunities: Opportunity[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOpportunities));
    } catch (error) {
      console.error("Failed to save opportunities:", error);
    }
  };

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
    saveOpportunities(updatedOpportunities);

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
    saveOpportunities(updatedOpportunities);

    const updated = updatedOpportunities.find((opp) => opp.id === id);
    if (!updated) {
      throw new Error("Opportunity not found");
    }

    return updated;
  };

  const deleteOpportunity = async (id: string): Promise<void> => {
    const updatedOpportunities = opportunities.filter((opp) => opp.id !== id);
    setOpportunities(updatedOpportunities);
    saveOpportunities(updatedOpportunities);
  };

  const getOpportunityById = (id: string): Opportunity | undefined => {
    return opportunities.find((opp) => opp.id === id);
  };

  const getOpportunitiesByLeadId = (leadId: string): Opportunity[] => {
    return opportunities.filter((opp) => opp.leadId === leadId);
  };

  return {
    opportunities,
    isLoading,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOpportunityById,
    getOpportunitiesByLeadId,
  };
};

export default useOpportunities;
