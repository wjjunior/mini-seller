import React from "react";
import type { Lead } from "@/entities/lead";
import LeadCard from "./LeadCard";
import { Grid } from "@/shared/ui";

interface LeadsGridProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  emptyMessage?: string;
  className?: string;
  itemsPerPage?: number;
}

const LeadsGrid: React.FC<LeadsGridProps> = ({
  leads,
  onLeadSelect,
  emptyMessage = "No leads found",
  className = "",
  itemsPerPage = 10,
}) => {
  return (
    <Grid
      items={leads}
      renderItem={(lead) => (
        <LeadCard key={lead.id} lead={lead} onClick={onLeadSelect} />
      )}
      emptyMessage={emptyMessage}
      className={className}
      itemsPerPage={itemsPerPage}
      gridCols={{
        mobile: 1,
        tablet: 2,
        desktop: 3,
      }}
      keyExtractor={(lead) => lead.id}
    />
  );
};

export default LeadsGrid;
