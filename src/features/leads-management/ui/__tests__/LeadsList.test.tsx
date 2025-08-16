import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LeadsList from "../LeadsList";
import type { Lead } from "@/entities/lead";

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
const mockUseContainerHeight = vi.mocked(
  await import("@/shared/hooks/useContainerHeight")
).useContainerHeight;
const mockUseIsMobile = vi.mocked(
  await import("@/shared/hooks/useIsMobile")
).default;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    company: "Tech Corp",
    email: "john@techcorp.com",
    source: "Website",
    status: "new" as const,
    score: 85,
  },
  {
    id: "2",
    name: "Jane Smith",
    company: "Design Inc",
    email: "jane@designinc.com",
    source: "Referral",
    status: "contacted" as const,
    score: 92,
  },
];

describe("LeadsList", () => {
  const mockOnLeadSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockUseContainerHeight.mockReturnValue({
      containerRef: { current: null },
      height: 400,
    });

    mockUseIsMobile.mockReturnValue(false);
  });

  it("should render loading state", () => {
    mockUseLeads.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof mockUseLeads>);

    mockUseLeadsFilter.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      statusFilter: "all",
      setStatusFilter: vi.fn(),
      filteredAndSortedLeads: [],
    });

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByRole("status", { name: /loading leads/i })
    ).toBeInTheDocument();
  });

  it("should render error state", () => {
    const mockRefetch = vi.fn();

    mockUseLeads.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof mockUseLeads>);

    mockUseLeadsFilter.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      statusFilter: "all",
      setStatusFilter: vi.fn(),
      filteredAndSortedLeads: [],
    });

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
    mockUseLeads.mockReturnValue({
      data: mockLeads,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof mockUseLeads>);

    mockUseLeadsFilter.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      statusFilter: "all",
      setStatusFilter: vi.fn(),
      filteredAndSortedLeads: mockLeads,
    });

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Design Inc")).toBeInTheDocument();
  });

  it("should call onLeadSelect when a row is clicked", () => {
    mockUseLeads.mockReturnValue({
      data: mockLeads,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof mockUseLeads>);

    mockUseLeadsFilter.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      statusFilter: "all",
      setStatusFilter: vi.fn(),
      filteredAndSortedLeads: mockLeads,
    });

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByText("John Doe"));
    expect(mockOnLeadSelect).toHaveBeenCalledWith(mockLeads[0]);
  });

  it("should render empty state when no leads match filter", () => {
    mockUseLeads.mockReturnValue({
      data: mockLeads,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof mockUseLeads>);

    mockUseLeadsFilter.mockReturnValue({
      searchTerm: "nonexistent",
      setSearchTerm: vi.fn(),
      statusFilter: "all",
      setStatusFilter: vi.fn(),
      filteredAndSortedLeads: [],
    });

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText("No leads match your search criteria")
    ).toBeInTheDocument();
  });

  it("should render empty state when no leads exist", () => {
    mockUseLeads.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof mockUseLeads>);

    mockUseLeadsFilter.mockReturnValue({
      searchTerm: "",
      setSearchTerm: vi.fn(),
      statusFilter: "all",
      setStatusFilter: vi.fn(),
      filteredAndSortedLeads: [],
    });

    render(<LeadsList onLeadSelect={mockOnLeadSelect} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("No leads found")).toBeInTheDocument();
  });
});
