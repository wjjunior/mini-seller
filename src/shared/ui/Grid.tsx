import React, { useState, useMemo } from "react";
import type { ReactNode } from "react";
import Pagination from "./Pagination";

interface GridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  className?: string;
  itemsPerPage?: number;
  gridCols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  showPagination?: boolean;
  showResultsInfo?: boolean;
  onPageChange?: (page: number) => void;
  keyExtractor?: (item: T, index: number) => string | number;
}

const Grid = <T,>({
  items,
  renderItem,
  emptyMessage = "No items found",
  className = "",
  itemsPerPage = 10,
  gridCols = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  showPagination = true,
  showResultsInfo = true,
  onPageChange,
  keyExtractor,
}: GridProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const getGridColsClass = () => {
    const mobile = gridCols.mobile || 1;
    const tablet = gridCols.tablet || mobile;
    const desktop = gridCols.desktop || tablet;

    return `grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`;
  };

  if (items.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={`grid gap-4 ${getGridColsClass()}`}>
        {paginatedItems.map((item, index) => (
          <React.Fragment
            key={keyExtractor ? keyExtractor(item, index) : index}
          >
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </div>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={items.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          showResultsInfo={showResultsInfo}
        />
      )}
    </div>
  );
};

export default Grid;
