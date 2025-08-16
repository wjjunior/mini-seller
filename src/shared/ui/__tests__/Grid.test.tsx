import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Grid from "../Grid";

interface TestItem {
  id: number;
  name: string;
}

const mockItems: TestItem[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" },
  { id: 6, name: "Item 6" },
  { id: 7, name: "Item 7" },
  { id: 8, name: "Item 8" },
  { id: 9, name: "Item 9" },
  { id: 10, name: "Item 10" },
  { id: 11, name: "Item 11" },
];

const renderItem = (item: TestItem) => (
  <div key={item.id} data-testid={`item-${item.id}`}>
    {item.name}
  </div>
);

describe("Grid", () => {
  it("renders items correctly", () => {
    render(
      <Grid
        items={mockItems.slice(0, 3)}
        renderItem={renderItem}
        itemsPerPage={10}
      />
    );

    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
    expect(screen.getByTestId("item-3")).toBeInTheDocument();
  });

  it("shows empty message when no items", () => {
    render(
      <Grid items={[]} renderItem={renderItem} emptyMessage="No items found" />
    );

    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("shows pagination when items exceed itemsPerPage", () => {
    render(<Grid items={mockItems} renderItem={renderItem} itemsPerPage={5} />);

    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show pagination when items fit in one page", () => {
    render(
      <Grid
        items={mockItems.slice(0, 3)}
        renderItem={renderItem}
        itemsPerPage={10}
      />
    );

    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("can disable pagination", () => {
    render(
      <Grid
        items={mockItems}
        renderItem={renderItem}
        itemsPerPage={5}
        showPagination={false}
      />
    );

    expect(screen.queryByText("Next")).not.toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("can disable results info", () => {
    render(
      <Grid
        items={mockItems}
        renderItem={renderItem}
        itemsPerPage={5}
        showResultsInfo={false}
      />
    );

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it("calls onPageChange when page changes", () => {
    const onPageChange = vi.fn();
    render(
      <Grid
        items={mockItems}
        renderItem={renderItem}
        itemsPerPage={5}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("uses custom keyExtractor", () => {
    const keyExtractor = vi.fn((item: TestItem) => `custom-${item.id}`);
    render(
      <Grid
        items={mockItems.slice(0, 3)}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    );

    expect(keyExtractor).toHaveBeenCalledTimes(3);
    expect(keyExtractor).toHaveBeenCalledWith(mockItems[0], 0);
    expect(keyExtractor).toHaveBeenCalledWith(mockItems[1], 1);
    expect(keyExtractor).toHaveBeenCalledWith(mockItems[2], 2);
  });

  it("applies custom className", () => {
    render(
      <Grid
        items={mockItems.slice(0, 3)}
        renderItem={renderItem}
        className="custom-class"
      />
    );

    const gridContainer =
      screen.getByTestId("item-1").parentElement?.parentElement;
    expect(gridContainer).toHaveClass("custom-class");
  });

  it("renders with default grid columns", () => {
    render(<Grid items={mockItems.slice(0, 3)} renderItem={renderItem} />);

    const gridElement = screen.getByTestId("item-1").parentElement;
    expect(gridElement).toHaveClass(
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3"
    );
  });

  it("renders with custom grid columns", () => {
    render(
      <Grid
        items={mockItems.slice(0, 3)}
        renderItem={renderItem}
        gridCols={{
          mobile: 2,
          tablet: 4,
          desktop: 6,
        }}
      />
    );

    const gridElement = screen.getByTestId("item-1").parentElement;
    expect(gridElement).toHaveClass(
      "grid-cols-2",
      "sm:grid-cols-4",
      "lg:grid-cols-6"
    );
  });
});
