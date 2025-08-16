import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConvertLeadModal from "../ConvertLeadModal";
import type { Lead } from "../../../../../entities/lead";

const mockLead: Lead = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  status: "new",
  score: 85,
  source: "website",
};

describe("ConvertLeadModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with lead data pre-filled", () => {
    render(
      <ConvertLeadModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        lead={mockLead}
      />
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Acme Corp")).toBeInTheDocument();
  });

  it("should submit form with correct data", async () => {
    render(
      <ConvertLeadModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        lead={mockLead}
      />
    );

    const submitButton = screen.getByText("Convert to Opportunity");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        stage: "Prospecting",
        accountName: "Acme Corp",
        amount: undefined,
        leadId: "1",
      });
    });
  });

  it("should submit form with amount when provided", async () => {
    render(
      <ConvertLeadModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        lead={mockLead}
      />
    );

    const amountInput = screen.getByPlaceholderText("Enter amount in dollars");
    fireEvent.change(amountInput, { target: { value: "1000" } });

    const submitButton = screen.getByText("Convert to Opportunity");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        stage: "Prospecting",
        accountName: "Acme Corp",
        amount: 1000,
        leadId: "1",
      });
    });
  });

  it("should handle empty amount field correctly", async () => {
    render(
      <ConvertLeadModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        lead={mockLead}
      />
    );

    const amountInput = screen.getByPlaceholderText("Enter amount in dollars");
    fireEvent.change(amountInput, { target: { value: "" } });

    const submitButton = screen.getByText("Convert to Opportunity");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        stage: "Prospecting",
        accountName: "Acme Corp",
        amount: undefined,
        leadId: "1",
      });
    });
  });

  it("should not render when closed", () => {
    render(
      <ConvertLeadModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        lead={mockLead}
      />
    );

    expect(
      screen.queryByText("Convert Lead to Opportunity")
    ).not.toBeInTheDocument();
  });

  it("should close modal when cancel button is clicked", () => {
    render(
      <ConvertLeadModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        lead={mockLead}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should show validation errors for required fields", async () => {
    render(
      <ConvertLeadModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        lead={null}
      />
    );

    const submitButton = screen.getByText("Convert to Opportunity");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Opportunity name is required")
      ).toBeInTheDocument();
      expect(screen.getByText("Account name is required")).toBeInTheDocument();
    });
  });
});
