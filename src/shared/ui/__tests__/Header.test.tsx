import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../Header";

describe("Header", () => {
  const defaultProps = {
    activeTab: "dashboard",
    onTabChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the application title", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Mini Seller CRM")).toBeInTheDocument();
  });

  it("renders all navigation tabs", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
  });

  it("renders notification and account buttons", () => {
    render(<Header {...defaultProps} />);
    const notificationButton = screen.getByRole("button", { name: "" });
    const accountButton = screen.getByRole("button", { name: /account/i });

    expect(notificationButton).toBeInTheDocument();
    expect(accountButton).toBeInTheDocument();
  });

  it("highlights the active tab correctly", () => {
    render(<Header {...defaultProps} />);
    const dashboardTab = screen.getByText("Dashboard").closest("button");
    const leadsTab = screen.getByText("Leads").closest("button");
    const opportunitiesTab = screen
      .getByText("Opportunities")
      .closest("button");

    expect(dashboardTab).toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
    expect(leadsTab).not.toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
    expect(opportunitiesTab).not.toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
  });

  it("calls onTabChange when a tab is clicked", () => {
    const mockOnTabChange = vi.fn();
    render(<Header {...defaultProps} onTabChange={mockOnTabChange} />);

    const leadsTab = screen.getByText("Leads");
    fireEvent.click(leadsTab);

    expect(mockOnTabChange).toHaveBeenCalledWith("leads");
  });

  it("calls onTabChange with correct tab id for each tab", () => {
    const mockOnTabChange = vi.fn();
    render(<Header {...defaultProps} onTabChange={mockOnTabChange} />);

    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockOnTabChange).toHaveBeenCalledWith("dashboard");

    fireEvent.click(screen.getByText("Leads"));
    expect(mockOnTabChange).toHaveBeenCalledWith("leads");

    fireEvent.click(screen.getByText("Opportunities"));
    expect(mockOnTabChange).toHaveBeenCalledWith("opportunities");
  });

  it("renders with different active tab", () => {
    render(<Header {...defaultProps} activeTab="leads" />);
    const leadsTab = screen.getByText("Leads").closest("button");
    const dashboardTab = screen.getByText("Dashboard").closest("button");

    expect(leadsTab).toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
    expect(dashboardTab).not.toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
  });

  it("renders icons for each navigation tab", () => {
    render(<Header {...defaultProps} />);
    const icons = document.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThanOrEqual(5);
  });

  it("applies correct CSS classes to header container", () => {
    render(<Header {...defaultProps} />);
    const header = screen.getByText("Mini Seller CRM").closest("header");
    expect(header).toHaveClass(
      "bg-white",
      "shadow-sm",
      "border-b",
      "border-gray-200"
    );
  });

  it("renders notification bell icon", () => {
    render(<Header {...defaultProps} />);
    const notificationButton = screen.getByRole("button", { name: "" });
    expect(notificationButton.querySelector("svg")).toBeInTheDocument();
  });

  it("renders user account section with icon and text", () => {
    render(<Header {...defaultProps} />);
    const accountButton = screen.getByRole("button", { name: /account/i });
    expect(accountButton).toHaveTextContent("Account");
    expect(accountButton.querySelector("svg")).toBeInTheDocument();
  });

  it("applies hover and focus styles to navigation tabs", () => {
    render(<Header {...defaultProps} />);
    const inactiveTab = screen.getByText("Leads").closest("button");
    expect(inactiveTab).toHaveClass("hover:text-gray-700", "hover:bg-gray-50");
  });

  it("applies focus styles to buttons", () => {
    render(<Header {...defaultProps} />);
    const notificationButton = screen.getByRole("button", { name: "" });
    const accountButton = screen.getByRole("button", { name: /account/i });

    expect(notificationButton).toHaveClass(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500"
    );
    expect(accountButton).toHaveClass(
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500"
    );
  });
});
