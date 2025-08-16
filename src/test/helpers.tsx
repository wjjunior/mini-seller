import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import type { Lead } from "@/entities/lead";
import type { Opportunity, CreateOpportunityData } from "@/features/leads-management/types";

export const createWrapper = () => {
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

export const createMockLead = (overrides: Partial<Lead> = {}): Lead => ({
  id: "1",
  name: "John Doe",
  company: "Tech Corp",
  email: "john@techcorp.com",
  source: "Website",
  status: "new",
  score: 85,
  ...overrides,
});

export const createMockLeads = (count: number = 2, overrides: Partial<Lead> = {}): Lead[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockLead({
      id: String(i + 1),
      name: `Lead ${i + 1}`,
      company: `Company ${i + 1}`,
      email: `lead${i + 1}@company${i + 1}.com`,
      ...overrides,
    })
  );
};

export const createMockOpportunity = (overrides: Partial<Opportunity> = {}): Opportunity => ({
  id: "opp_1_1234567890",
  name: "Test Opportunity",
  stage: "Prospecting",
  amount: 1000,
  accountName: "Test Account",
  leadId: "lead_123",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

export const createMockOpportunities = (count: number = 2, overrides: Partial<Opportunity> = {}): Opportunity[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockOpportunity({
      id: `opp_${i + 1}_1234567890`,
      name: `Opportunity ${i + 1}`,
      accountName: `Account ${i + 1}`,
      ...overrides,
    })
  );
};

export const createMockCreateOpportunityData = (overrides: Partial<CreateOpportunityData> = {}): CreateOpportunityData => ({
  name: "Test Opportunity",
  stage: "Prospecting",
  amount: 1000,
  accountName: "Test Account",
  leadId: "lead_123",
  ...overrides,
});

export const createMockUseLeadsReturn = (overrides: {
  data?: Lead[];
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
} = {}) => ({
  data: createMockLeads(),
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  ...overrides,
});

export const createMockUseLeadsFilterReturn = (overrides: {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
  filteredAndSortedLeads?: Lead[];
} = {}) => ({
  searchTerm: "",
  setSearchTerm: vi.fn(),
  statusFilter: "all",
  setStatusFilter: vi.fn(),
  filteredAndSortedLeads: createMockLeads(),
  ...overrides,
});

export const createMockUseContainerHeightReturn = (overrides: {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  height?: number;
} = {}) => ({
  containerRef: { current: null },
  height: 400,
  ...overrides,
});

export const createMockUseIsMobileReturn = (isMobile: boolean = false) => isMobile;

export const createMockUseOpportunitiesReturn = (overrides: {
  opportunities?: Opportunity[];
  createOpportunity?: (data: CreateOpportunityData) => Promise<Opportunity>;
  updateOpportunity?: (id: string, data: Partial<Opportunity>) => Promise<Opportunity>;
  deleteOpportunity?: (id: string) => Promise<void>;
  getOpportunityById?: (id: string) => Opportunity | undefined;
  getOpportunitiesByLeadId?: (leadId: string) => Opportunity[];
} = {}) => ({
  opportunities: createMockOpportunities(),
  createOpportunity: vi.fn().mockResolvedValue(createMockOpportunity()),
  updateOpportunity: vi.fn().mockResolvedValue(createMockOpportunity()),
  deleteOpportunity: vi.fn().mockResolvedValue(undefined),
  getOpportunityById: vi.fn().mockReturnValue(createMockOpportunity()),
  getOpportunitiesByLeadId: vi.fn().mockReturnValue(createMockOpportunities()),
  ...overrides,
});

export const createMockFetchLeads = () => vi.fn().mockResolvedValue(createMockLeads());

export const createMockError = (message: string = "Test error") => new Error(message);

export const createMockEventHandlers = () => ({
  onLeadSelect: vi.fn(),
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  onClick: vi.fn(),
  onRetry: vi.fn(),
});

export const createMockPaginationData = (totalItems: number = 15, itemsPerPage: number = 10) => ({
  totalItems,
  itemsPerPage,
  currentPage: 1,
  totalPages: Math.ceil(totalItems / itemsPerPage),
});

export const createMockLeadsWithPagination = (totalItems: number = 15, itemsPerPage: number = 10) => {
  const leads = createMockLeads(totalItems);
  return {
    leads,
    pagination: createMockPaginationData(totalItems, itemsPerPage),
  };
};

export const createMockLeadWithDifferentStatuses = (): Lead[] => [
  createMockLead({ id: "1", name: "New Lead", status: "new", score: 85 }),
  createMockLead({ id: "2", name: "Contacted Lead", status: "contacted", score: 92 }),
  createMockLead({ id: "3", name: "Qualified Lead", status: "qualified", score: 95 }),
  createMockLead({ id: "4", name: "Disqualified Lead", status: "disqualified", score: 30 }),
];

export const createMockLeadWithDifferentScores = (): Lead[] => [
  createMockLead({ id: "1", name: "High Score", score: 95 }),
  createMockLead({ id: "2", name: "Medium Score", score: 75 }),
  createMockLead({ id: "3", name: "Low Score", score: 45 }),
  createMockLead({ id: "4", name: "Very Low Score", score: 25 }),
];

export const createMockOpportunityWithDifferentStages = (): Opportunity[] => [
  createMockOpportunity({ id: "opp_1", name: "Prospecting Opp", stage: "Prospecting" }),
  createMockOpportunity({ id: "opp_2", name: "Qualification Opp", stage: "Qualification" }),
  createMockOpportunity({ id: "opp_3", name: "Proposal Opp", stage: "Proposal" }),
  createMockOpportunity({ id: "opp_4", name: "Negotiation Opp", stage: "Negotiation" }),
  createMockOpportunity({ id: "opp_5", name: "Closed Won Opp", stage: "Closed Won" }),
  createMockOpportunity({ id: "opp_6", name: "Closed Lost Opp", stage: "Closed Lost" }),
];

export const setupMockHooks = () => {
  vi.mock("@/shared/hooks/useContainerHeight", () => ({
    useContainerHeight: vi.fn(),
  }));

  vi.mock("@/shared/hooks/useIsMobile", () => ({
    default: vi.fn(),
  }));

  vi.mock("@/shared/hooks/useLocalStorage", () => ({
    useLocalStorage: vi.fn(),
  }));

  vi.mock("../../lib/useLeads", () => ({
    useLeads: vi.fn(),
  }));

  vi.mock("../../lib/useLeadsFilter", () => ({
    useLeadsFilter: vi.fn(),
  }));

  vi.mock("../../lib/useUpdateLead", () => ({
    useUpdateLead: vi.fn(),
  }));

  vi.mock("../useOpportunities", () => ({
    default: vi.fn(),
  }));
};

export const setupMockAPI = () => {
  vi.mock("@/shared/api", () => ({
    fetchLeads: vi.fn(),
    updateLead: vi.fn(),
  }));
};

export const clearAllMocks = () => {
  vi.clearAllMocks();
  localStorage.clear();
};
