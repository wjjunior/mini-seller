import React, { useState, useMemo } from "react";
import type { Lead } from "@/entities/lead";
import LeadCard from "./LeadCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import useIsMobile from "@/shared/hooks/useIsMobile";

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
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  const totalPages = Math.ceil(leads.length / itemsPerPage);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return leads.slice(startIndex, endIndex);
  }, [leads, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (leads.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={onLeadSelect} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start text-sm text-gray-700">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, leads.length)} of{" "}
              {leads.length} results
            </span>
          </div>

          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {getVisiblePages().map((page, index) => (
                <React.Fragment key={`page-${page}-${index}`}>
                  {page === "..." ? (
                    <span className="px-2 py-2 text-sm text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsGrid;
