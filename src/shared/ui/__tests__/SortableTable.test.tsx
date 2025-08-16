import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SortableTable from "../SortableTable";
import type { SortableColumn } from "../SortableTable";

interface TestItem {
  id?: string;
  name: string;
  age: number;
  email: string;
}

const mockData: TestItem[] = [
  { id: "1", name: "Alice", age: 25, email: "alice@example.com" },
  { id: "2", name: "Bob", age: 30, email: "bob@example.com" },
  { id: "3", name: "Charlie", age: 22, email: "charlie@example.com" },
];

const mockColumns: SortableColumn<TestItem>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (value) => <span className="font-bold">{value}</span>,
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: false,
  },
];

describe("SortableTable", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render table with data", () => {
    render(<SortableTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("should render column headers", () => {
    render(<SortableTable data={mockData} columns={mockColumns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("should display empty message when no data", () => {
    render(<SortableTable data={[]} columns={mockColumns} />);

    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  it("should display custom empty message", () => {
    render(
      <SortableTable
        data={[]}
        columns={mockColumns}
        emptyMessage="No items available"
      />
    );

    expect(screen.getByText("No items available")).toBeInTheDocument();
  });

  it("should call onRowClick when row is clicked", () => {
    const onRowClick = vi.fn();
    render(
      <SortableTable
        data={mockData}
        columns={mockColumns}
        onRowClick={onRowClick}
      />
    );

    fireEvent.click(screen.getByText("Alice"));
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("should use custom render function", () => {
    render(<SortableTable data={mockData} columns={mockColumns} />);

    const nameCell = screen.getByText("Alice");
    expect(nameCell).toHaveClass("font-bold");
  });

  it("should handle items without id property", () => {
    const dataWithoutId: TestItem[] = [
      { name: "Alice", age: 25, email: "alice@example.com" },
      { name: "Bob", age: 30, email: "bob@example.com" },
    ];

    render(<SortableTable data={dataWithoutId} columns={mockColumns} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(
      <SortableTable
        data={mockData}
        columns={mockColumns}
        className="custom-table-class"
      />
    );

    const tableContainer = screen
      .getByRole("table")
      .closest("div")?.parentElement;
    expect(tableContainer).toHaveClass("custom-table-class");
  });
});
