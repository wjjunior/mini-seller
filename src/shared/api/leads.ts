import leadsData from "../../data/leads.json";
import type { Lead } from "@/entities/lead";

const simulateLatency = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchLeads = async (): Promise<Lead[]> => {
  await simulateLatency();
  return leadsData as Lead[];
};

export const updateLead = async (
  leadId: string,
  updates: Partial<Lead>
): Promise<Lead> => {
  await simulateLatency();

  const lead = (leadsData as Lead[]).find((l) => l.id === leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const updatedLead = { ...lead, ...updates } as Lead;

  if (Math.random() < 0.1) {
    throw new Error("Simulated network error");
  }

  return updatedLead;
};
