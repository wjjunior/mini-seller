import { renderHook, act } from "@testing-library/react";
import type { CreateOpportunityData } from "@/features/leads-management/types";
import useOpportunities from "../useOpportunities";
import { describe, beforeEach, it, expect } from "vitest";

describe("useOpportunities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should create a new opportunity", async () => {
    const { result } = renderHook(() => useOpportunities());

    const opportunityData: CreateOpportunityData = {
      name: "Test Opportunity",
      stage: "Prospecting",
      amount: 1000,
      accountName: "Test Account",
      leadId: "lead_123",
    };

    await act(async () => {
      const newOpportunity = await result.current.createOpportunity(
        opportunityData
      );

      expect(newOpportunity).toMatchObject({
        name: "Test Opportunity",
        stage: "Prospecting",
        amount: 1000,
        accountName: "Test Account",
        leadId: "lead_123",
      });
      expect(newOpportunity.id).toMatch(/^opp_\d+_/);
      expect(newOpportunity.createdAt).toBeDefined();
      expect(newOpportunity.updatedAt).toBeDefined();
    });

    expect(result.current.opportunities).toHaveLength(1);
    expect(result.current.opportunities[0]).toMatchObject(opportunityData);
  });

  it("should load opportunities from localStorage", () => {
    const mockOpportunities = [
      {
        id: "opp_1",
        name: "Test Opportunity 1",
        stage: "Prospecting" as const,
        amount: 1000,
        accountName: "Test Account 1",
        leadId: "lead_1",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
      },
    ];

    localStorage.setItem("opportunities", JSON.stringify(mockOpportunities));

    const { result } = renderHook(() => useOpportunities());

    expect(result.current.opportunities).toEqual(mockOpportunities);
  });
});
