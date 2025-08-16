import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Pagination from "../Pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: vi.fn(),
  };

  it("renders pagination controls", () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows results info by default", () => {
    render(<Pagination {...defaultProps} />);

    expect(
      screen.getByText(/Showing 1 to 10 of 50 results/)
    ).toBeInTheDocument();
  });

  it("can hide results info", () => {
    render(<Pagination {...defaultProps} showResultsInfo={false} />);

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it("calls onPageChange when page number is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange when Next button is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange when Previous button is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByText("Previous"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("disables Previous button on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const previousButton = screen.getByText("Previous").closest("button");
    expect(previousButton).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(<Pagination {...defaultProps} currentPage={5} />);

    const nextButton = screen.getByText("Next").closest("button");
    expect(nextButton).toBeDisabled();
  });

  it("returns null when totalPages is 1", () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when totalPages is 0", () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={0} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("shows ellipsis for many pages", () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={5} />);

    const ellipsisElements = screen.getAllByText("...");
    expect(ellipsisElements).toHaveLength(2);
  });

  it("applies custom className", () => {
    render(<Pagination {...defaultProps} className="custom-pagination" />);

    const paginationContainer = screen
      .getByText("Previous")
      .closest("div")?.parentElement;
    expect(paginationContainer).toHaveClass("custom-pagination");
  });

  it("shows correct results info for last page", () => {
    render(<Pagination {...defaultProps} currentPage={5} totalItems={47} />);

    expect(
      screen.getByText(/Showing 41 to 47 of 47 results/)
    ).toBeInTheDocument();
  });
});
