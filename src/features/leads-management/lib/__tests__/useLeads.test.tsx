import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLeads } from "../useLeads";
import { fetchLeads } from "@/shared/api";
import {
  createWrapper,
  createMockLeads,
  createMockError,
  clearAllMocks,
} from "../../../../test/helpers.tsx";

vi.mock("@/shared/api", () => ({
  fetchLeads: vi.fn(),
}));

const mockFetchLeads = vi.mocked(fetchLeads);

describe("useLeads", () => {
  beforeEach(() => {
    clearAllMocks();
  });

  it("should fetch leads successfully", async () => {
    const mockLeads = createMockLeads(2, {
      status: "new" as const,
    });

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
    const mockError = createMockError("Failed to fetch leads");
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
