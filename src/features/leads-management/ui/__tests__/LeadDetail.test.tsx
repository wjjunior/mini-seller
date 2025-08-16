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

    const emailSection = screen.getByText("john@example.com").closest("div");
    const editButton = emailSection?.querySelector("button");
    expect(editButton).toBeInTheDocument();
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

    const statusSection = screen.getByText("new").closest("div");
    const editButton = statusSection?.querySelector("button");
    expect(editButton).toBeInTheDocument();
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

    const emailSection = screen.getByText("john@example.com").closest("div");
    const editButton = emailSection?.querySelector("button");

    await user.click(editButton!);

    await waitFor(() => {
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
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

    const statusSection = screen.getByText("new").closest("div");
    const editButton = statusSection?.querySelector("button");

    await user.click(editButton!);

    await waitFor(() => {
      expect(screen.getByDisplayValue("New")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
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

    const emailSection = screen.getByText("john@example.com").closest("div");
    const editButton = emailSection?.querySelector("button");

    await user.click(editButton!);

    const emailInput = screen.getByPlaceholderText("Enter email address");
    await user.type(emailInput, "invalid-email");

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    await waitFor(
      () => {
        expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
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

    const emailSection = screen.getByText("john@example.com").closest("div");
    const editButton = emailSection?.querySelector("button");

    await user.click(editButton!);

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

    const statusSection = screen.getByText("new").closest("div");
    const editButton = statusSection?.querySelector("button");

    await user.click(editButton!);

    const statusSelect = screen.getByDisplayValue("New");
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

    const emailSection = screen.getByText("john@example.com").closest("div");
    const editButton = emailSection?.querySelector("button");

    await user.click(editButton!);

    await waitFor(() => {
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByDisplayValue("john@example.com")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Save")).not.toBeInTheDocument();
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    const setupErrorTest = (mockOnUpdate: ReturnType<typeof vi.fn>) => {
      const user = userEvent.setup();
      renderWithProviders(
        <LeadDetail
          lead={mockLead}
          isOpen={true}
          onClose={vi.fn()}
          onUpdate={mockOnUpdate}
        />
      );
      return user;
    };

    const findEmailEditButton = () => {
      const emailSection = screen.getByText("john@example.com").closest("div");
      return emailSection?.querySelector("button");
    };

    const createDelayedPromise = () => {
      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      return { promise, resolve: resolvePromise! };
    };

    it("shows error message when save fails", async () => {
      const mockOnUpdateWithError = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));
      const user = setupErrorTest(mockOnUpdateWithError);

      const emailEditButton = findEmailEditButton();
      await user.click(emailEditButton!);

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });

    it("clears error when starting new edit", async () => {
      const mockOnUpdateWithError = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));
      const user = setupErrorTest(mockOnUpdateWithError);

      const emailEditButton = findEmailEditButton();
      await user.click(emailEditButton!);

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });

      const cancelButton = screen.getByText("Cancel");
      await user.click(cancelButton);

      expect(screen.queryByText("Network error")).not.toBeInTheDocument();
    });

    it("disables buttons during save", async () => {
      const { promise, resolve } = createDelayedPromise();
      const mockOnUpdateWithDelay = vi.fn().mockImplementation(() => promise);
      const user = setupErrorTest(mockOnUpdateWithDelay);

      const emailEditButton = findEmailEditButton();
      await user.click(emailEditButton!);

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("john@example.com")
        ).toBeInTheDocument();
      });

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      await waitFor(() => {
        expect(saveButton).toBeDisabled();
        expect(screen.getByText("Saving...")).toBeInTheDocument();
      });

      resolve({});

      await waitFor(() => {
        expect(mockOnUpdateWithDelay).toHaveBeenCalled();
      });
    });
  });
});
