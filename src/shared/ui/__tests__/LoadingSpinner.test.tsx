import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";
import { describe, it, expect } from "vitest";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText("Loading");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<LoadingSpinner label="Loading data" />);
    const spinner = screen.getByLabelText("Loading data");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = screen.getByLabelText("Loading");
    expect(spinner).toHaveClass("h-4", "w-4");

    rerender(<LoadingSpinner size="md" />);
    spinner = screen.getByLabelText("Loading");
    expect(spinner).toHaveClass("h-8", "w-8");

    rerender(<LoadingSpinner size="lg" />);
    spinner = screen.getByLabelText("Loading");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("applies custom className", () => {
    render(<LoadingSpinner className="custom-class" />);
    const container = screen.getByLabelText("Loading").parentElement;
    expect(container).toHaveClass("custom-class");
  });
});
