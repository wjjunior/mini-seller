import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { SlideOver } from "../index";

describe("SlideOver", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders when open", () => {
    render(
      <SlideOver isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test content</div>
      </SlideOver>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("is hidden when closed", () => {
    render(
      <SlideOver isOpen={false} onClose={mockOnClose} title="Test Title">
        <div>Test content</div>
      </SlideOver>
    );

    const slideOver = document.querySelector(".fixed.inset-y-0.right-0");
    expect(slideOver).toHaveClass("translate-x-full");
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <SlideOver isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test content</div>
      </SlideOver>
    );

    const closeButton = screen.getByRole("button", { name: /close panel/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    render(
      <SlideOver isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>Test content</div>
      </SlideOver>
    );

    const backdrop = document.querySelector(".fixed.inset-0");
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders with different max width sizes", () => {
    const { rerender } = render(
      <SlideOver isOpen={true} onClose={mockOnClose} title="Test Title" maxWidth="sm">
        <div>Test content</div>
      </SlideOver>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();

    rerender(
      <SlideOver isOpen={true} onClose={mockOnClose} title="Test Title" maxWidth="lg">
        <div>Test content</div>
      </SlideOver>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders children content correctly", () => {
    render(
      <SlideOver isOpen={true} onClose={mockOnClose} title="Test Title">
        <div>
          <h3>Custom Header</h3>
          <p>Custom paragraph</p>
        </div>
      </SlideOver>
    );

    expect(screen.getByText("Custom Header")).toBeInTheDocument();
    expect(screen.getByText("Custom paragraph")).toBeInTheDocument();
  });
});
