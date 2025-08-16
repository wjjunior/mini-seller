import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLead } from "@/shared/api/leads";
import type { Lead } from "@/entities/lead";
import type { LeadEditFormData } from "./validation";

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      data,
    }: {
      leadId: string;
      data: LeadEditFormData;
    }) => updateLead(leadId, data),
    onSuccess: (updatedLead: Lead) => {
      queryClient.setQueryData<Lead[]>(["leads"], (oldLeads) => {
        if (!oldLeads) return [updatedLead];
        return oldLeads.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead
        );
      });
    },
  });
};
