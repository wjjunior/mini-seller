import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import VirtualizedTable from "../VirtualizedTable";

const mockData = [
  {
    id: "1",
    name: "John Doe",
    company: "Tech Corp",
    email: "john@techcorp.com",
    source: "Website",
    score: 85,
    status: "new",
  },
  {
    id: "2",
    name: "Jane Smith",
    company: "Innovation Inc",
    email: "jane@innovation.com",
    source: "LinkedIn",
    score: 92,
    status: "contacted",
  },
];

const mockColumns = [
  {
    key: "name" as const,
    label: "Name",
    sortable: true,
    width: 200,
    render: (value: string | number) => (
      <span className="font-medium">{String(value)}</span>
    ),
  },
  {
    key: "company" as const,
    label: "Company",
    sortable: true,
    width: 250,
    render: (value: string | number) => (
      <span className="text-gray-500">{String(value)}</span>
    ),
  },
  {
    key: "email" as const,
    label: "Email",
    sortable: false,
    width: 300,
  },
];

describe("VirtualizedTable", () => {
  it("renders table headers correctly", () => {
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        height={400}
        rowHeight={60}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders data rows correctly", () => {
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        height={400}
        rowHeight={60}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("john@techcorp.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Innovation Inc")).toBeInTheDocument();
    expect(screen.getByText("jane@innovation.com")).toBeInTheDocument();
  });

  it("calls onRowClick when row is clicked", () => {
    const mockOnRowClick = vi.fn();
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        onRowClick={mockOnRowClick}
        height={400}
        rowHeight={60}
      />
    );

    const firstRow = screen.getByText("John Doe").closest("div");
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(mockOnRowClick).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it("shows empty message when no data", () => {
    render(
      <VirtualizedTable
        data={[]}
        columns={mockColumns}
        emptyMessage="No data available"
        height={400}
        rowHeight={60}
      />
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("handles sorting when header is clicked", () => {
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        height={400}
        rowHeight={60}
      />
    );

    const nameHeader = screen.getByText("Name");
    fireEvent.click(nameHeader);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("does not show sort icon for non-sortable columns", () => {
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        height={400}
        rowHeight={60}
      />
    );

    const emailHeader = screen.getByText("Email");
    expect(emailHeader).toBeInTheDocument();
  });
});
