import { useQuery } from "@tanstack/react-query";
import { fetchLeads } from "../utils/api";
import type { Lead } from "../types";

export const useLeads = () => {
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });
};
