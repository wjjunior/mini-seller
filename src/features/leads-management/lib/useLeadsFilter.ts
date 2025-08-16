import { useMemo } from "react";
import type { Lead } from "@/entities/lead";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/shared/constants/storage";

interface FilterState {
  searchTerm: string;
  statusFilter: string;
}

const INITIAL_STATE: FilterState = {
  searchTerm: "",
  statusFilter: "all",
};

export const useLeadsFilter = (leads: Lead[]) => {
  const [filterState, setFilterState] = useLocalStorage<FilterState>(
    STORAGE_KEYS.LEADS_FILTER,
    INITIAL_STATE
  );

  const { searchTerm, statusFilter } = filterState;

  const setSearchTerm = (value: string) => {
    setFilterState((prev) => ({ ...prev, searchTerm: value }));
  };

  const setStatusFilter = (value: string) => {
    setFilterState((prev) => ({ ...prev, statusFilter: value }));
  };

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(term) ||
          lead.company.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    return filtered.sort((a, b) => b.score - a.score);
  }, [leads, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredAndSortedLeads,
  };
};
