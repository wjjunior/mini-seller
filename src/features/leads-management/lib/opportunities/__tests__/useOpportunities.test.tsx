import { renderHook, act } from "@testing-library/react";
import useOpportunities from "../useOpportunities";
import { describe, it, expect } from "vitest";
import { createMockCreateOpportunityData } from "src/test/helpers";

describe("useOpportunities", () => {
  it("should create a new opportunity", async () => {
    const { result } = renderHook(() => useOpportunities());

    const opportunityData = createMockCreateOpportunityData();

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

  it("should start with empty opportunities array", () => {
    const { result } = renderHook(() => useOpportunities());

    expect(result.current.opportunities).toEqual([]);
  });

  it("should update an opportunity", async () => {
    const { result } = renderHook(() => useOpportunities());

    const opportunityData = createMockCreateOpportunityData({
      name: "Original Name",
    });

    let opportunityId = "";

    await act(async () => {
      const newOpportunity = await result.current.createOpportunity(
        opportunityData
      );
      opportunityId = newOpportunity.id;
    });

    await act(async () => {
      const updatedOpportunity = await result.current.updateOpportunity(
        opportunityId,
        { name: "Updated Name", amount: 2000 }
      );

      expect(updatedOpportunity.name).toBe("Updated Name");
      expect(updatedOpportunity.amount).toBe(2000);
      expect(updatedOpportunity.stage).toBe("Prospecting");
    });

    expect(result.current.opportunities[0].name).toBe("Updated Name");
    expect(result.current.opportunities[0].amount).toBe(2000);
  });

  it("should delete an opportunity", async () => {
    const { result } = renderHook(() => useOpportunities());

    const opportunityData = createMockCreateOpportunityData();

    let opportunityId: string;

    await act(async () => {
      const newOpportunity = await result.current.createOpportunity(
        opportunityData
      );
      opportunityId = newOpportunity.id;
    });

    expect(result.current.opportunities).toHaveLength(1);

    await act(async () => {
      await result.current.deleteOpportunity(opportunityId);
    });

    expect(result.current.opportunities).toHaveLength(0);
  });

  it("should get opportunity by id", async () => {
    const { result } = renderHook(() => useOpportunities());

    const opportunityData = createMockCreateOpportunityData();

    let opportunityId = "";

    await act(async () => {
      const newOpportunity = await result.current.createOpportunity(
        opportunityData
      );
      opportunityId = newOpportunity.id;
    });

    const foundOpportunity = result.current.getOpportunityById(opportunityId);
    expect(foundOpportunity).toBeDefined();
    expect(foundOpportunity?.name).toBe("Test Opportunity");

    const notFoundOpportunity =
      result.current.getOpportunityById("non-existent");
    expect(notFoundOpportunity).toBeUndefined();
  });

  it("should get opportunities by lead id", async () => {
    const { result } = renderHook(() => useOpportunities());

    const opportunityData1 = createMockCreateOpportunityData({
      name: "Opportunity 1",
      stage: "Prospecting",
      accountName: "Test Account 1",
      leadId: "lead_123",
    });

    const opportunityData2 = createMockCreateOpportunityData({
      name: "Opportunity 2",
      stage: "Qualification",
      amount: 2000,
      accountName: "Test Account 2",
      leadId: "lead_123",
    });

    const opportunityData3 = createMockCreateOpportunityData({
      name: "Opportunity 3",
      stage: "Proposal",
      amount: 3000,
      accountName: "Test Account 3",
      leadId: "lead_456",
    });

    await act(async () => {
      await result.current.createOpportunity(opportunityData1);
    });

    await act(async () => {
      await result.current.createOpportunity(opportunityData2);
    });

    await act(async () => {
      await result.current.createOpportunity(opportunityData3);
    });

    expect(result.current.opportunities).toHaveLength(3);

    const opportunitiesForLead123 =
      result.current.getOpportunitiesByLeadId("lead_123");
    expect(opportunitiesForLead123).toHaveLength(2);
    expect(opportunitiesForLead123[0].name).toBe("Opportunity 1");
    expect(opportunitiesForLead123[1].name).toBe("Opportunity 2");

    const opportunitiesForLead456 =
      result.current.getOpportunitiesByLeadId("lead_456");
    expect(opportunitiesForLead456).toHaveLength(1);
    expect(opportunitiesForLead456[0].name).toBe("Opportunity 3");

    const opportunitiesForNonExistentLead =
      result.current.getOpportunitiesByLeadId("non-existent");
    expect(opportunitiesForNonExistentLead).toHaveLength(0);
  });

  it("should throw error when updating non-existent opportunity", async () => {
    const { result } = renderHook(() => useOpportunities());

    await act(async () => {
      await expect(
        result.current.updateOpportunity("non-existent", { name: "Updated" })
      ).rejects.toThrow("Opportunity not found");
    });
  });
});
