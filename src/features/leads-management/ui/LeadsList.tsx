import React from "react";
import type { Lead } from "@/entities/lead";
import { useLeads } from "../lib/useLeads";
import { useLeadsFilter } from "../lib/useLeadsFilter";
import LeadsFilter from "./LeadsFilter";
import { SortableTable, LoadingSpinner, ErrorMessage } from "@/shared/ui";
import type { SortableColumn } from "@/shared/ui/SortableTable";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import { getStatusColor, getScoreColor } from "../lib/helpers";

interface LeadsListProps {
  onLeadSelect: (lead: Lead) => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ onLeadSelect }) => {
  const { data: leads = [], isLoading, error, refetch } = useLeads();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredAndSortedLeads,
  } = useLeadsFilter(leads);

  const columns: SortableColumn<Lead>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "company",
      label: "Company",
      sortable: true,
      render: (value) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "source",
      label: "Source",
      sortable: true,
      render: (value) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: "score",
      label: "Score",
      sortable: true,
      render: (value) => (
        <span className={`font-medium ${getScoreColor(value as number)}`}>
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            value as string
          )}`}
        >
          {value}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner size="md" label="Loading leads" className="h-64" />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load leads. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      <LeadsFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        filteredCount={filteredAndSortedLeads.length}
        totalCount={leads.length}
      />

      <SortableTable
        data={filteredAndSortedLeads}
        columns={columns}
        onRowClick={onLeadSelect}
        emptyMessage={
          leads.length === 0
            ? "No leads found"
            : "No leads match your search criteria"
        }
        initialSortConfig={{ key: "score", direction: "desc" }}
        storageKey={STORAGE_KEYS.LEADS_TABLE_SORT}
      />
    </div>
  );
};

export default LeadsList;
