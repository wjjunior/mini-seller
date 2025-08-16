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
    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Leads")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Opportunities")[0]).toBeInTheDocument();
  });

  it("renders notification and account buttons", () => {
    render(<Header {...defaultProps} />);
    const notificationButton = screen
      .getAllByRole("button")
      .find(
        (button) =>
          button.querySelector("svg") &&
          !button.textContent?.includes("Account") &&
          !button.textContent?.includes("Dashboard") &&
          !button.textContent?.includes("Leads") &&
          !button.textContent?.includes("Opportunities")
      );
    const accountButton = screen.getByRole("button", { name: /account/i });

    expect(notificationButton).toBeInTheDocument();
    expect(accountButton).toBeInTheDocument();
  });

  it("highlights the active tab correctly", () => {
    render(<Header {...defaultProps} />);
    const dashboardTabs = screen.getAllByText("Dashboard");
    const leadsTabs = screen.getAllByText("Leads");
    const opportunitiesTabs = screen.getAllByText("Opportunities");

    const desktopDashboardTab = dashboardTabs[0].closest("button");
    const desktopLeadsTab = leadsTabs[0].closest("button");
    const desktopOpportunitiesTab = opportunitiesTabs[0].closest("button");

    expect(desktopDashboardTab).toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
    expect(desktopLeadsTab).not.toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
    expect(desktopOpportunitiesTab).not.toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
  });

  it("calls onTabChange when a tab is clicked", () => {
    const mockOnTabChange = vi.fn();
    render(<Header {...defaultProps} onTabChange={mockOnTabChange} />);

    const leadsTabs = screen.getAllByText("Leads");
    fireEvent.click(leadsTabs[0]);

    expect(mockOnTabChange).toHaveBeenCalledWith("leads");
  });

  it("calls onTabChange with correct tab id for each tab", () => {
    const mockOnTabChange = vi.fn();
    render(<Header {...defaultProps} onTabChange={mockOnTabChange} />);

    const dashboardTabs = screen.getAllByText("Dashboard");
    const leadsTabs = screen.getAllByText("Leads");
    const opportunitiesTabs = screen.getAllByText("Opportunities");

    fireEvent.click(dashboardTabs[0]);
    expect(mockOnTabChange).toHaveBeenCalledWith("dashboard");

    fireEvent.click(leadsTabs[0]);
    expect(mockOnTabChange).toHaveBeenCalledWith("leads");

    fireEvent.click(opportunitiesTabs[0]);
    expect(mockOnTabChange).toHaveBeenCalledWith("opportunities");
  });

  it("renders with different active tab", () => {
    render(<Header {...defaultProps} activeTab="leads" />);
    const leadsTabs = screen.getAllByText("Leads");
    const dashboardTabs = screen.getAllByText("Dashboard");

    const desktopLeadsTab = leadsTabs[0].closest("button");
    const desktopDashboardTab = dashboardTabs[0].closest("button");

    expect(desktopLeadsTab).toHaveClass(
      "bg-blue-50",
      "text-blue-700",
      "border-b-2",
      "border-blue-700"
    );
    expect(desktopDashboardTab).not.toHaveClass(
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
    const notificationButton = screen
      .getAllByRole("button")
      .find(
        (button) =>
          button.querySelector("svg") &&
          !button.textContent?.includes("Account") &&
          !button.textContent?.includes("Dashboard") &&
          !button.textContent?.includes("Leads") &&
          !button.textContent?.includes("Opportunities")
      );
    expect(notificationButton?.querySelector("svg")).toBeInTheDocument();
  });

  it("renders user account section with icon and text", () => {
    render(<Header {...defaultProps} />);
    const accountButton = screen.getByRole("button", { name: /account/i });
    expect(accountButton).toHaveTextContent("Account");
    expect(accountButton.querySelector("svg")).toBeInTheDocument();
  });

  it("applies hover and focus styles to navigation tabs", () => {
    render(<Header {...defaultProps} />);
    const leadsTabs = screen.getAllByText("Leads");
    const inactiveTab = leadsTabs[0].closest("button");
    expect(inactiveTab).toHaveClass("hover:text-gray-700", "hover:bg-gray-50");
  });

  it("applies focus styles to buttons", () => {
    render(<Header {...defaultProps} />);
    const notificationButton = screen
      .getAllByRole("button")
      .find(
        (button) =>
          button.querySelector("svg") &&
          !button.textContent?.includes("Account") &&
          !button.textContent?.includes("Dashboard") &&
          !button.textContent?.includes("Leads") &&
          !button.textContent?.includes("Opportunities")
      );
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
