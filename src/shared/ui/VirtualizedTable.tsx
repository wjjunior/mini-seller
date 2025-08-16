import React, { useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import {
  ArrowsUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import useLocalStorage from "@/shared/hooks/useLocalStorage";

export type SortDirection = "asc" | "desc" | null;

export interface SortableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  className?: string;
  width?: number;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: SortableColumn<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  initialSortConfig?: {
    key: keyof T;
    direction: "asc" | "desc";
  };
  storageKey?: string;
  height?: number;
  rowHeight?: number;
}

interface SortState<T> {
  key: keyof T | null;
  direction: SortDirection;
}

interface RowProps<T> {
  style: React.CSSProperties;
  item: T;
  columns: SortableColumn<T>[];
  onRowClick?: (item: T) => void;
}

const Row = <T extends { id?: string | number }>({
  style,
  item,
  columns,
  onRowClick,
}: RowProps<T>) => {
  const rowContent = (
    <>
      {columns.map((column) => (
        <div
          key={String(column.key)}
          className={`px-6 py-4 text-sm truncate ${column.className || ""}`}
          style={{ width: column.width || 200 }}
        >
          {column.render
            ? column.render(item[column.key], item)
            : String(item[column.key] || "")}
        </div>
      ))}
    </>
  );

  return onRowClick ? (
    <button
      style={style}
      onClick={() => onRowClick(item)}
      className="flex items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-left"
    >
      {rowContent}
    </button>
  ) : (
    <div style={style} className="flex items-center border-b border-gray-200">
      {rowContent}
    </div>
  );
};

function VirtualizedTable<T extends { id?: string | number }>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data found",
  className = "",
  initialSortConfig,
  storageKey = "virtualized-table-sort",
  height = 400,
  rowHeight = 60,
}: VirtualizedTableProps<T>) {
  const initialSortState: SortState<T> = initialSortConfig
    ? { key: initialSortConfig.key, direction: initialSortConfig.direction }
    : { key: null, direction: null };

  const [sortConfig, setSortConfig] = useLocalStorage<SortState<T>>(
    storageKey,
    initialSortState
  );

  const handleSort = (key: keyof T) => {
    const column = columns.find((col) => col.key === key);
    if (!column?.sortable) return;

    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }

    setSortConfig({ key: direction ? key : null, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortConfig]);

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />;
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUpIcon className="w-4 h-4 text-gray-900" />;
    }

    return <ChevronDownIcon className="w-4 h-4 text-gray-900" />;
  };

  if (sortedData.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg shadow overflow-hidden ${className}`}
      >
        <div className="px-6 py-4 text-center text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <div className="w-full">
          <div className="flex bg-gray-50 border-b border-gray-200">
            {columns.map((column) =>
              column.sortable ? (
                <button
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    column.className || ""
                  }`}
                  style={{ width: column.width || 200 }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </button>
              ) : (
                <div
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.className || ""
                  }`}
                  style={{ width: column.width || 200 }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                  </div>
                </div>
              )
            )}
          </div>

          <List
            height={height - 48}
            itemCount={sortedData.length}
            itemSize={rowHeight}
            width="100%"
          >
            {({ index, style }) => (
              <Row
                style={style}
                item={sortedData[index]}
                columns={columns}
                onRowClick={onRowClick}
              />
            )}
          </List>
        </div>
      </div>
    </div>
  );
}

export default VirtualizedTable;
