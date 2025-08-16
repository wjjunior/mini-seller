import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLeadsFilter } from "../useLeadsFilter";
import type { Lead } from "@/entities/lead";

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
  {
    id: "3",
    name: "Bob Johnson",
    company: "Marketing Pro",
    email: "bob@marketingpro.com",
    source: "LinkedIn",
    status: "qualified" as const,
    score: 78,
  },
  {
    id: "4",
    name: "Alice Brown",
    company: "Tech Solutions",
    email: "alice@techsolutions.com",
    source: "Email",
    status: "disqualified" as const,
    score: 95,
  },
];

describe("useLeadsFilter", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial filter state", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    expect(result.current.searchTerm).toBe("");
    expect(result.current.statusFilter).toBe("all");
    const expectedSortedLeads = [...mockLeads].sort(
      (a, b) => b.score - a.score
    );
    expect(result.current.filteredAndSortedLeads).toEqual(expectedSortedLeads);
  });

  it("should filter leads by search term", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("tech");
    });

    expect(result.current.searchTerm).toBe("tech");
    expect(result.current.filteredAndSortedLeads).toHaveLength(2);
    expect(result.current.filteredAndSortedLeads[0].name).toBe("Alice Brown");
    expect(result.current.filteredAndSortedLeads[1].name).toBe("John Doe");
  });

  it("should filter leads by status", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setStatusFilter("new");
    });

    expect(result.current.statusFilter).toBe("new");
    expect(result.current.filteredAndSortedLeads).toHaveLength(1);
    expect(
      result.current.filteredAndSortedLeads.every(
        (lead) => lead.status === "new"
      )
    ).toBe(true);
  });

  it("should filter leads by both search term and status", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("tech");
      result.current.setStatusFilter("disqualified");
    });

    expect(result.current.filteredAndSortedLeads).toHaveLength(1);
    expect(result.current.filteredAndSortedLeads[0].name).toBe("Alice Brown");
  });

  it("should sort leads by score in descending order", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    expect(result.current.filteredAndSortedLeads[0].score).toBe(95);
    expect(result.current.filteredAndSortedLeads[1].score).toBe(92);
    expect(result.current.filteredAndSortedLeads[2].score).toBe(85);
    expect(result.current.filteredAndSortedLeads[3].score).toBe(78);
  });

  it("should search in both name and company fields", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("design");
    });

    expect(result.current.filteredAndSortedLeads).toHaveLength(1);
    expect(result.current.filteredAndSortedLeads[0].company).toBe("Design Inc");
  });

  it("should handle case-insensitive search", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("TECH");
    });

    expect(result.current.filteredAndSortedLeads).toHaveLength(2);
  });

  it('should return all leads when status filter is "all"', () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setStatusFilter("all");
    });

    expect(result.current.filteredAndSortedLeads).toHaveLength(4);
  });

  it("should persist filter state in localStorage", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("test search");
    });

    act(() => {
      result.current.setStatusFilter("qualified");
    });

    const storedData = localStorage.getItem("leads-filter-state");
    expect(storedData).toBeDefined();

    const parsedData = JSON.parse(storedData!);
    expect(parsedData.searchTerm).toBe("test search");
    expect(parsedData.statusFilter).toBe("qualified");
  });

  it("should restore filter state from localStorage", () => {
    const storedState = {
      searchTerm: "restored search",
      statusFilter: "contacted",
    };
    localStorage.setItem("leads-filter-state", JSON.stringify(storedState));

    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    expect(result.current.searchTerm).toBe("restored search");
    expect(result.current.statusFilter).toBe("contacted");
  });

  it("should handle empty leads array", () => {
    const { result } = renderHook(() => useLeadsFilter([]));

    expect(result.current.filteredAndSortedLeads).toEqual([]);
  });

  it("should handle leads with empty search term", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("");
    });

    expect(result.current.filteredAndSortedLeads).toHaveLength(4);
  });

  it("should clear filters properly", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("test search");
    });

    act(() => {
      result.current.setStatusFilter("qualified");
    });

    expect(result.current.searchTerm).toBe("test search");
    expect(result.current.statusFilter).toBe("qualified");

    act(() => {
      result.current.setSearchTerm("");
    });

    act(() => {
      result.current.setStatusFilter("all");
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.statusFilter).toBe("all");
    expect(result.current.filteredAndSortedLeads).toHaveLength(4);
  });

  it("should persist cleared search term in localStorage", () => {
    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("test search");
    });

    expect(result.current.searchTerm).toBe("test search");

    act(() => {
      result.current.setSearchTerm("");
    });

    expect(result.current.searchTerm).toBe("");

    const storedData = localStorage.getItem("leads-filter-state");
    expect(storedData).toBeDefined();

    const parsedData = JSON.parse(storedData!);
    expect(parsedData.searchTerm).toBe("");
  });

  it("should properly restore cleared state from localStorage", () => {
    localStorage.clear();

    const { result, unmount } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("test search");
    });

    act(() => {
      result.current.setStatusFilter("qualified");
    });

    expect(result.current.searchTerm).toBe("test search");
    expect(result.current.statusFilter).toBe("qualified");

    act(() => {
      result.current.setSearchTerm("");
    });

    act(() => {
      result.current.setStatusFilter("all");
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.statusFilter).toBe("all");

    unmount();

    const { result: newResult } = renderHook(() => useLeadsFilter(mockLeads));

    expect(newResult.current.searchTerm).toBe("");
    expect(newResult.current.statusFilter).toBe("all");
  });

  it("should clear searchTerm when setSearchTerm is called with empty string", () => {
    localStorage.clear();

    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("test search");
    });

    expect(result.current.searchTerm).toBe("test search");

    act(() => {
      result.current.setSearchTerm("");
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.filteredAndSortedLeads).toHaveLength(4);
  });

  it("should handle clearing searchTerm when state is persisted", () => {
    localStorage.clear();

    const { result, unmount } = renderHook(() => useLeadsFilter(mockLeads));

    act(() => {
      result.current.setSearchTerm("test search");
    });

    expect(result.current.searchTerm).toBe("test search");

    unmount();

    const { result: newResult } = renderHook(() => useLeadsFilter(mockLeads));

    expect(newResult.current.searchTerm).toBe("test search");

    act(() => {
      newResult.current.setSearchTerm("");
    });

    expect(newResult.current.searchTerm).toBe("");
    expect(newResult.current.filteredAndSortedLeads).toHaveLength(4);
  });

  it("should clear filters when localStorage has existing data", () => {
    localStorage.clear();

    const existingState = {
      searchTerm: "existing search",
      statusFilter: "qualified",
    };
    localStorage.setItem("leads-filter-state", JSON.stringify(existingState));

    const { result } = renderHook(() => useLeadsFilter(mockLeads));

    expect(result.current.searchTerm).toBe("existing search");
    expect(result.current.statusFilter).toBe("qualified");

    act(() => {
      result.current.setSearchTerm("");
    });

    act(() => {
      result.current.setStatusFilter("all");
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.statusFilter).toBe("all");
    expect(result.current.filteredAndSortedLeads).toHaveLength(4);
  });
});
