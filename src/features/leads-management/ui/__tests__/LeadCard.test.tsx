import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LeadCard from "../LeadCard";
import type { Lead } from "@/entities/lead";

const mockLead: Lead = {
  id: "1",
  name: "John Doe",
  company: "Tech Corp",
  email: "john@techcorp.com",
  source: "Website",
  score: 85,
  status: "qualified",
};

describe("LeadCard", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders lead information correctly", () => {
    render(<LeadCard lead={mockLead} onClick={mockOnClick} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("john@techcorp.com")).toBeInTheDocument();
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Score: 85")).toBeInTheDocument();
    expect(screen.getByText("qualified")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    render(<LeadCard lead={mockLead} onClick={mockOnClick} />);

    const card = screen.getByText("John Doe").closest("div");
    fireEvent.click(card!);

    expect(mockOnClick).toHaveBeenCalledWith(mockLead);
  });

  it("applies correct status color classes", () => {
    render(<LeadCard lead={mockLead} onClick={mockOnClick} />);

    const statusElement = screen.getByText("qualified");
    expect(statusElement).toHaveClass("bg-green-100", "text-green-800");
  });

  it("applies correct score color classes", () => {
    render(<LeadCard lead={mockLead} onClick={mockOnClick} />);

    const scoreElement = screen.getByText("Score: 85");
    expect(scoreElement).toHaveClass("text-yellow-600");
  });

  it("handles different status values", () => {
    const newLead: Lead = { ...mockLead, status: "new" };
    render(<LeadCard lead={newLead} onClick={mockOnClick} />);

    const statusElement = screen.getByText("new");
    expect(statusElement).toHaveClass("bg-blue-100", "text-blue-800");
  });

  it("handles different score values", () => {
    const lowScoreLead: Lead = { ...mockLead, score: 30 };
    render(<LeadCard lead={lowScoreLead} onClick={mockOnClick} />);

    const scoreElement = screen.getByText("Score: 30");
    expect(scoreElement).toHaveClass("text-red-600");
  });
});
