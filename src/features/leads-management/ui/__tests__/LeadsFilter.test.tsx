import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LeadsFilter from "../LeadsFilter";

describe("LeadsFilter", () => {
  const defaultProps = {
    searchTerm: "",
    onSearchChange: vi.fn(),
    statusFilter: "all",
    onStatusFilterChange: vi.fn(),
    filteredCount: 10,
    totalCount: 15,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render search input and status filter", () => {
    render(<LeadsFilter {...defaultProps} />);

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("should display current search term", () => {
    render(<LeadsFilter {...defaultProps} searchTerm="test search" />);

    expect(screen.getByDisplayValue("test search")).toBeInTheDocument();
  });

  it("should display current status filter", () => {
    render(<LeadsFilter {...defaultProps} statusFilter="new" />);

    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toHaveValue("new");
  });

  it("should call onSearchChange when search input changes", () => {
    const onSearchChange = vi.fn();
    render(<LeadsFilter {...defaultProps} onSearchChange={onSearchChange} />);

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: "new search" } });

    expect(onSearchChange).toHaveBeenCalledWith("new search");
  });

  it("should call onStatusFilterChange when status filter changes", () => {
    const onStatusFilterChange = vi.fn();
    render(
      <LeadsFilter
        {...defaultProps}
        onStatusFilterChange={onStatusFilterChange}
      />
    );

    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: "qualified" } });

    expect(onStatusFilterChange).toHaveBeenCalledWith("qualified");
  });

  it("should display all status options", () => {
    render(<LeadsFilter {...defaultProps} />);

    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toHaveValue("all");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveValue("all");
    expect(options[1]).toHaveValue("new");
    expect(options[2]).toHaveValue("contacted");
    expect(options[3]).toHaveValue("qualified");
    expect(options[4]).toHaveValue("disqualified");
  });

  it("should display filtered count and total count", () => {
    render(<LeadsFilter {...defaultProps} filteredCount={5} totalCount={20} />);

    expect(screen.getByText("Showing 5 of 20 leads")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<LeadsFilter {...defaultProps} />);

    const searchInput = screen.getByLabelText(/search/i);
    expect(searchInput).toHaveAttribute("type", "text");
    expect(searchInput).toHaveAttribute(
      "placeholder",
      "Search by name or company..."
    );

    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toBeInTheDocument();
  });

  it("should handle empty search term", () => {
    const onSearchChange = vi.fn();
    render(
      <LeadsFilter
        {...defaultProps}
        onSearchChange={onSearchChange}
        searchTerm="initial"
      />
    );

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: "" } });

    expect(onSearchChange).toHaveBeenCalledWith("");
  });

  it("should handle special characters in search", () => {
    const onSearchChange = vi.fn();
    render(<LeadsFilter {...defaultProps} onSearchChange={onSearchChange} />);

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: "test@company.com" } });

    expect(onSearchChange).toHaveBeenCalledWith("test@company.com");
  });
});
