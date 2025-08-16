import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("renders with default message", () => {
    render(<ErrorMessage />);
    expect(
      screen.getByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    const customMessage = "Custom error message";
    render(<ErrorMessage message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage onRetry={mockRetry} />);
    const retryButton = screen.getByText("Retry");
    expect(retryButton).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorMessage />);
    expect(screen.queryByText("Retry")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage onRetry={mockRetry} />);
    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<ErrorMessage className="custom-class" />);
    const container = screen
      .getByText("Something went wrong. Please try again.")
      .closest("div");
    expect(container).toHaveClass("custom-class");
  });

  it("renders error icon", () => {
    render(<ErrorMessage />);
    const icon = screen.getByTestId("error-icon");
    expect(icon).toBeInTheDocument();
  });
});
