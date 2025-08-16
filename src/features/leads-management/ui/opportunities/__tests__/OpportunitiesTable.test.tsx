import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OpportunitiesTable from "../OpportunitiesTable";
import type { Opportunity } from "@/features/leads-management/types";

const mockOpportunities: Opportunity[] = [
  {
    id: "opp_1",
    name: "Test Opportunity 1",
    stage: "Prospecting",
    amount: 1000,
    accountName: "Test Account 1",
    leadId: "lead_1",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "opp_2",
    name: "Test Opportunity 2",
    stage: "Qualification",
    amount: 2000,
    accountName: "Test Account 2",
    leadId: "lead_2",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
];

describe("OpportunitiesTable", () => {
  it("should render opportunities table with data", () => {
    render(
      <OpportunitiesTable opportunities={mockOpportunities} isLoading={false} />
    );

    expect(screen.getByText("Test Opportunity 1")).toBeInTheDocument();
    expect(screen.getByText("Test Opportunity 2")).toBeInTheDocument();
    expect(screen.getByText("Test Account 1")).toBeInTheDocument();
    expect(screen.getByText("Test Account 2")).toBeInTheDocument();
    expect(screen.getByText("Prospecting")).toBeInTheDocument();
    expect(screen.getByText("Qualification")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(<OpportunitiesTable opportunities={[]} isLoading={true} />);

    expect(
      screen.queryByText("No opportunities found")
    ).not.toBeInTheDocument();
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("should show empty state when no opportunities", () => {
    render(<OpportunitiesTable opportunities={[]} isLoading={false} />);

    expect(screen.getByText("No opportunities found")).toBeInTheDocument();
    expect(
      screen.getByText("Convert leads to opportunities to see them here")
    ).toBeInTheDocument();
  });

  it("should apply blinking effect to newly created opportunity", () => {
    render(
      <OpportunitiesTable
        opportunities={mockOpportunities}
        isLoading={false}
        newlyCreatedOpportunityId="opp_1"
      />
    );

    const tableRow = screen.getByText("Test Opportunity 1").closest("tr");
    expect(tableRow).toHaveClass(
      "animate-pulse",
      "bg-blue-50",
      "border-l-4",
      "border-blue-500"
    );
  });

  it("should not apply blinking effect to other opportunities", () => {
    render(
      <OpportunitiesTable
        opportunities={mockOpportunities}
        isLoading={false}
        newlyCreatedOpportunityId="opp_1"
      />
    );

    const tableRow = screen.getByText("Test Opportunity 2").closest("tr");
    expect(tableRow).not.toHaveClass(
      "animate-pulse",
      "bg-blue-50",
      "border-l-4",
      "border-blue-500"
    );
  });

  it("should format amount correctly", () => {
    render(
      <OpportunitiesTable opportunities={mockOpportunities} isLoading={false} />
    );

    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
    expect(screen.getByText("$2,000.00")).toBeInTheDocument();
  });

  it("should show dash for opportunities without amount", () => {
    const opportunitiesWithoutAmount = [
      {
        ...mockOpportunities[0],
        amount: undefined,
      },
    ];

    render(
      <OpportunitiesTable
        opportunities={opportunitiesWithoutAmount}
        isLoading={false}
      />
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
