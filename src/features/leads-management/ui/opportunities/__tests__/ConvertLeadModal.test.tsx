import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConvertLeadModal from "../ConvertLeadModal";
import type { Lead } from "@/entities/lead";

const mockLead: Lead = {
  id: "lead_123",
  name: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  source: "website",
  score: 85,
  status: "new",
};

describe("ConvertLeadModal", () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

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

    expect(screen.getByText("Convert Lead to Opportunity")).toBeInTheDocument();

    const nameInput = screen.getByLabelText("Name *") as HTMLInputElement;
    const accountInput = screen.getByLabelText(
      "Account Name *"
    ) as HTMLInputElement;
    const stageSelect = screen.getByLabelText("Stage *") as HTMLSelectElement;

    expect(nameInput.value).toBe("John Doe");
    expect(accountInput.value).toBe("Acme Corp");
    expect(stageSelect.value).toBe("Prospecting");
    expect(nameInput.disabled).toBe(true);
    expect(accountInput.disabled).toBe(true);
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

    const amountInput = screen.getByLabelText(
      "Amount (Optional)"
    ) as HTMLInputElement;
    fireEvent.change(amountInput, { target: { value: "5000" } });

    const submitButton = screen.getByText("Convert to Opportunity");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        stage: "Prospecting",
        amount: 5000,
        accountName: "Acme Corp",
        leadId: "lead_123",
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
