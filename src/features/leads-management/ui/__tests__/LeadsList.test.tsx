import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LeadsList from "../LeadsList";
import { useContainerHeight } from "@/shared/hooks/useContainerHeight";
import useIsMobile from "@/shared/hooks/useIsMobile";
import {
  createWrapper,
  createMockLeads,
  createMockUseLeadsReturn,
  createMockUseLeadsFilterReturn,
  createMockEventHandlers,
  clearAllMocks,
} from "../../../../test/helpers.tsx";

vi.mock("../../lib/useLeads", () => ({
  useLeads: vi.fn(),
}));

vi.mock("../../lib/useLeadsFilter", () => ({
  useLeadsFilter: vi.fn(),
}));

vi.mock("@/shared/hooks/useContainerHeight", () => ({
  useContainerHeight: vi.fn(),
}));

vi.mock("@/shared/hooks/useIsMobile", () => ({
  default: vi.fn(),
}));

const mockUseLeads = vi.mocked(await import("../../lib/useLeads")).useLeads;
const mockUseLeadsFilter = vi.mocked(
  await import("../../lib/useLeadsFilter")
).useLeadsFilter;
const mockUseContainerHeight = vi.mocked(useContainerHeight);
const mockUseIsMobile = vi.mocked(useIsMobile);

const mockLeads = createMockLeads();

describe("LeadsList", () => {
  const { onLeadSelect: mockOnLeadSelect } = createMockEventHandlers();

  beforeEach(() => {
    clearAllMocks();

    mockUseContainerHeight.mockReturnValue({
      containerRef: { current: null },
      height: 400,
    });
    mockUseIsMobile.mockReturnValue(false);
  });

  it("should render loading state", () => {
    mockUseLeads.mockReturnValue(
      createMockUseLeadsReturn({
        data: undefined,
        isLoading: true,
      }) as unknown as ReturnType<typeof mockUseLeads>
    );

    mockUseLeadsFilter.mockReturnValue(
      createMockUseLeadsFilterReturn({
        filteredAndSortedLeads: [],
      })
    );

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByRole("status", { name: /loading leads/i })
    ).toBeInTheDocument();
  });

  it("should render error state", () => {
    const mockRefetch = vi.fn();

    mockUseLeads.mockReturnValue(
      createMockUseLeadsReturn({
        data: undefined,
        isLoading: false,
        error: new Error("Failed to fetch"),
        refetch: mockRefetch,
      }) as unknown as ReturnType<typeof mockUseLeads>
    );

    mockUseLeadsFilter.mockReturnValue(
      createMockUseLeadsFilterReturn({
        filteredAndSortedLeads: [],
      })
    );

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText("Failed to load leads. Please try again.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should render leads table when data is loaded", () => {
    mockUseLeads.mockReturnValue(
      createMockUseLeadsReturn({
        data: mockLeads,
      }) as unknown as ReturnType<typeof mockUseLeads>
    );

    mockUseLeadsFilter.mockReturnValue(
      createMockUseLeadsFilterReturn({
        filteredAndSortedLeads: mockLeads,
      })
    );

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Lead 1")).toBeInTheDocument();
    expect(screen.getByText("Lead 2")).toBeInTheDocument();
    expect(screen.getByText("Company 1")).toBeInTheDocument();
    expect(screen.getByText("Company 2")).toBeInTheDocument();
  });

  it("should call onLeadSelect when a row is clicked", () => {
    mockUseLeads.mockReturnValue(
      createMockUseLeadsReturn({
        data: mockLeads,
      }) as unknown as ReturnType<typeof mockUseLeads>
    );

    mockUseLeadsFilter.mockReturnValue(
      createMockUseLeadsFilterReturn({
        filteredAndSortedLeads: mockLeads,
      })
    );

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByText("Lead 1"));
    expect(mockOnLeadSelect).toHaveBeenCalledWith(mockLeads[0]);
  });

  it("should render empty state when no leads match filter", () => {
    mockUseLeads.mockReturnValue(
      createMockUseLeadsReturn({
        data: mockLeads,
      }) as unknown as ReturnType<typeof mockUseLeads>
    );

    mockUseLeadsFilter.mockReturnValue(
      createMockUseLeadsFilterReturn({
        searchTerm: "nonexistent",
        filteredAndSortedLeads: [],
      })
    );

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText("No leads match your search criteria")
    ).toBeInTheDocument();
  });

  it("should render empty state when no leads exist", () => {
    mockUseLeads.mockReturnValue(
      createMockUseLeadsReturn({
        data: [],
      }) as unknown as ReturnType<typeof mockUseLeads>
    );

    mockUseLeadsFilter.mockReturnValue(
      createMockUseLeadsFilterReturn({
        filteredAndSortedLeads: [],
      })
    );

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("No leads found")).toBeInTheDocument();
  });
});
