import { useQuery } from "@tanstack/react-query";
import { fetchLeads } from "@/shared/api";
import type { Lead } from "@/entities/lead";

export const useLeads = () => {
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });
};
