import { render, screen } from "@testing-library/react";
import OpportunitiesGrid from "../OpportunitiesGrid";
import type { Opportunity } from "@/features/leads-management/types";
import { describe, it, expect } from "vitest";

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    name: "Test Opportunity 1",
    accountName: "Test Account 1",
    stage: "Prospecting",
    amount: 10000,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    leadId: "lead-1",
  },
  {
    id: "2",
    name: "Test Opportunity 2",
    accountName: "Test Account 2",
    stage: "Qualification",
    amount: 25000,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
    leadId: "lead-2",
  },
];

describe("OpportunitiesGrid", () => {
  it("should render opportunities grid with data", () => {
    render(
      <OpportunitiesGrid
        opportunities={mockOpportunities}
        newlyCreatedOpportunityId={null}
      />
    );

    expect(screen.getByText("Test Opportunity 1")).toBeInTheDocument();
    expect(screen.getByText("Test Opportunity 2")).toBeInTheDocument();
    expect(screen.getByText("Test Account 1")).toBeInTheDocument();
    expect(screen.getByText("Test Account 2")).toBeInTheDocument();
    expect(screen.getByText("Prospecting")).toBeInTheDocument();
    expect(screen.getByText("Qualification")).toBeInTheDocument();
  });

  it("should show empty state when no opportunities", () => {
    render(
      <OpportunitiesGrid opportunities={[]} newlyCreatedOpportunityId={null} />
    );

    expect(screen.getByText("No opportunities found")).toBeInTheDocument();
  });

  it("should apply blinking effect to newly created opportunity", () => {
    render(
      <OpportunitiesGrid
        opportunities={mockOpportunities}
        newlyCreatedOpportunityId="1"
      />
    );

    const opportunityCard = screen
      .getByText("Test Opportunity 1")
      .closest('[class*="animate-pulse"]');
    expect(opportunityCard).toHaveClass("animate-pulse");
    expect(opportunityCard).toHaveClass("border-blue-500");
    expect(opportunityCard).toHaveClass("bg-blue-50");
  });

  it("should not apply blinking effect to other opportunities", () => {
    render(
      <OpportunitiesGrid
        opportunities={mockOpportunities}
        newlyCreatedOpportunityId="1"
      />
    );

    const opportunityCard = screen
      .getByText("Test Opportunity 2")
      .closest('[class*="border-gray-200"]');
    expect(opportunityCard).not.toHaveClass("animate-pulse");
    expect(opportunityCard).not.toHaveClass("border-blue-500");
    expect(opportunityCard).not.toHaveClass("bg-blue-50");
  });

  it("should format amount correctly", () => {
    render(
      <OpportunitiesGrid
        opportunities={mockOpportunities}
        newlyCreatedOpportunityId={null}
      />
    );

    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
    expect(screen.getByText("$25,000.00")).toBeInTheDocument();
  });

  it("should show dash for opportunities without amount", () => {
    const opportunitiesWithoutAmount: Opportunity[] = [
      {
        ...mockOpportunities[0],
        amount: undefined,
      },
    ];

    render(
      <OpportunitiesGrid
        opportunities={opportunitiesWithoutAmount}
        newlyCreatedOpportunityId={null}
      />
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
