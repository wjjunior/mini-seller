import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
    expect(screen.getByText("new")).toBeInTheDocument();
  });

  it("shows edit button for email field", () => {
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const emailEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("john@example.com")
    );

    expect(emailEditButton).toBeInTheDocument();
  });

  it("shows edit button for status field", () => {
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const statusEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("new")
    );

    expect(statusEditButton).toBeInTheDocument();
  });

  it("enters edit mode for email when edit button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const emailEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("john@example.com")
    );

    await user.click(emailEditButton!);

    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("enters edit mode for status when edit button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const statusEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("new")
    );

    await user.click(statusEditButton!);

    expect(screen.getByDisplayValue("new")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("validates email format and shows error for invalid email", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const emailEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("john@example.com")
    );

    await user.click(emailEditButton!);

    const emailInput = screen.getByDisplayValue("john@example.com");
    await user.clear(emailInput);
    await user.type(emailInput, "invalid-email");

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  it("calls onUpdate when valid email is submitted", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const emailEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("john@example.com")
    );

    await user.click(emailEditButton!);

    const emailInput = screen.getByDisplayValue("john@example.com");
    await user.clear(emailInput);
    await user.type(emailInput, "newemail@example.com");

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith("1", {
        email: "newemail@example.com",
        status: "new",
      });
    });
  });

  it("calls onUpdate when valid status is submitted", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const statusEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("new")
    );

    await user.click(statusEditButton!);

    const statusSelect = screen.getByDisplayValue("new");
    await user.selectOptions(statusSelect, "qualified");

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith("1", {
        email: "john@example.com",
        status: "qualified",
      });
    });
  });

  it("cancels edit mode when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LeadDetail
        lead={mockLead}
        isOpen={true}
        onClose={vi.fn()}
        onUpdate={mockOnUpdate}
      />
    );

    const editButtons = screen.getAllByRole("button");
    const emailEditButton = editButtons.find((button) =>
      button.closest("div")?.textContent?.includes("john@example.com")
    );

    await user.click(emailEditButton!);

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(
      screen.queryByDisplayValue("john@example.com")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });
});
