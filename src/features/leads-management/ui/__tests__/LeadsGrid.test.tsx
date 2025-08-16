import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LeadsGrid from "../LeadsGrid";
import type { Lead } from "@/entities/lead";
import useIsMobile from "@/shared/hooks/useIsMobile";

// Mock the useIsMobile hook
vi.mock("@/shared/hooks/useIsMobile", () => ({
  default: vi.fn(),
}));

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    company: "Tech Corp",
    email: "john@techcorp.com",
    source: "Website",
    score: 85,
    status: "qualified",
  },
  {
    id: "2",
    name: "Jane Smith",
    company: "Design Inc",
    email: "jane@designinc.com",
    source: "LinkedIn",
    score: 72,
    status: "contacted",
  },
  {
    id: "3",
    name: "Bob Johnson",
    company: "Marketing Pro",
    email: "bob@marketingpro.com",
    source: "Referral",
    score: 95,
    status: "new",
  },
];

describe("LeadsGrid", () => {
  const mockOnLeadSelect = vi.fn();
  const mockUseIsMobile = vi.mocked(useIsMobile);

  beforeEach(() => {
    mockOnLeadSelect.mockClear();
    mockUseIsMobile.mockReturnValue(false);
  });

  it("renders all leads in a grid", () => {
    render(
      <LeadsGrid
        leads={mockLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("shows pagination info when there are multiple pages", () => {
    const manyLeads = Array.from({ length: 15 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    expect(
      screen.getByText("Showing 1 to 10 of 15 results")
    ).toBeInTheDocument();
  });

  it("shows pagination controls when there are multiple pages", () => {
    const manyLeads = Array.from({ length: 15 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("navigates to next page when Next button is clicked", () => {
    const manyLeads = Array.from({ length: 15 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(
      screen.getByText("Showing 11 to 15 of 15 results")
    ).toBeInTheDocument();
  });

  it("navigates to previous page when Previous button is clicked", () => {
    const manyLeads = Array.from({ length: 15 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    const previousButton = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(previousButton);

    expect(
      screen.getByText("Showing 1 to 10 of 15 results")
    ).toBeInTheDocument();
  });

  it("navigates to specific page when page number is clicked", () => {
    const manyLeads = Array.from({ length: 15 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    const page2Button = screen.getByText("2");
    fireEvent.click(page2Button);

    expect(
      screen.getByText("Showing 11 to 15 of 15 results")
    ).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    const manyLeads = Array.from({ length: 15 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    const manyLeads = Array.from({ length: 15 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
  });

  it("shows empty message when no leads are provided", () => {
    render(
      <LeadsGrid
        leads={[]}
        onLeadSelect={mockOnLeadSelect}
        emptyMessage="No leads available"
      />
    );

    expect(screen.getByText("No leads available")).toBeInTheDocument();
  });

  it("calls onLeadSelect when a lead card is clicked", () => {
    render(
      <LeadsGrid
        leads={mockLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={10}
      />
    );

    const firstLeadCard = screen.getByText("John Doe").closest("div");
    fireEvent.click(firstLeadCard!);

    expect(mockOnLeadSelect).toHaveBeenCalledWith(mockLeads[0]);
  });

  it("shows compact pagination on mobile", () => {
    mockUseIsMobile.mockReturnValue(true);

    const manyLeads = Array.from({ length: 20 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={5}
      />
    );

    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("shows ellipsis for pagination with many pages on mobile", () => {
    mockUseIsMobile.mockReturnValue(true);

    const manyLeads = Array.from({ length: 50 }, (_, i) => ({
      ...mockLeads[0],
      id: String(i + 1),
      name: `Lead ${i + 1}`,
    }));

    render(
      <LeadsGrid
        leads={manyLeads}
        onLeadSelect={mockOnLeadSelect}
        itemsPerPage={5}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
