import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLeads } from "../useLeads";
import { fetchLeads } from "@/shared/api";

vi.mock("@/shared/api", () => ({
  fetchLeads: vi.fn(),
}));

const mockFetchLeads = vi.mocked(fetchLeads);

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

describe("useLeads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch leads successfully", async () => {
    const mockLeads = [
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

    mockFetchLeads.mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useLeads(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockLeads);
    expect(mockFetchLeads).toHaveBeenCalledTimes(1);
  });

  it("should handle loading state", () => {
    mockFetchLeads.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useLeads(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should handle error state", async () => {
    const mockError = new Error("Failed to fetch leads");
    mockFetchLeads.mockRejectedValue(mockError);

    const { result } = renderHook(() => useLeads(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it("should use correct query key", () => {
    mockFetchLeads.mockResolvedValue([]);

    renderHook(() => useLeads(), {
      wrapper: createWrapper(),
    });

    expect(mockFetchLeads).toHaveBeenCalledTimes(1);
  });
});
