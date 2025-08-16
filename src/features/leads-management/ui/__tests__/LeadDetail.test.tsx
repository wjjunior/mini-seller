import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LeadDetail from "../LeadDetail";
import type { Lead } from "@/entities/lead";

const mockLead: Lead = {
  id: "1",
  name: "John Doe",
  company: "Test Company",
  email: "john@example.com",
  source: "Website",
  score: 85,
  status: "new",
};

const mockOnUpdate = vi.fn();

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe("LeadDetail", () => {
  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it("renders lead information correctly", () => {
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("new")).toHaveLength(2);
  });

  it("shows edit buttons", () => {
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          button.querySelector("svg")?.getAttribute("data-slot") === "icon"
      );
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it("shows convert to opportunity button", () => {
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("Convert to Opportunity")).toBeInTheDocument();
  });

  it("disables convert button when lead is already converted", () => {
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
        isLeadAlreadyConverted={true}
      />
    );

    const convertButton = screen.getByText("Convert to Opportunity");
    expect(convertButton).toBeDisabled();
  });

  it("shows lead source and score", () => {
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={onClose}
        onUpdate={mockOnUpdate}
      />
    );

    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
