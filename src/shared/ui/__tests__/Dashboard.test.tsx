import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Dashboard from "../Dashboard";

describe("Dashboard", () => {
  const defaultProps = {
    leadsCount: 150,
    opportunitiesCount: 45,
    conversionRate: 30,
    totalValue: 125000,
  };

  it("renders dashboard title and description", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    expect(
      screen.getByText("Track your sales performance and key metrics")
    ).toBeInTheDocument();
  });

  it("renders all four stat cards", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("Total Leads")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
    expect(screen.getByText("Total Value")).toBeInTheDocument();
  });

  it("displays correct values for all stats", () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("$125.000")).toBeInTheDocument();
  });

  it("formats large numbers correctly", () => {
    const propsWithLargeNumbers = {
      ...defaultProps,
      totalValue: 1500000,
    };
    render(<Dashboard {...propsWithLargeNumbers} />);
    expect(screen.getByText("$1.500.000")).toBeInTheDocument();
  });

  it("handles zero values correctly", () => {
    const zeroProps = {
      leadsCount: 0,
      opportunitiesCount: 0,
      conversionRate: 0,
      totalValue: 0,
    };
    render(<Dashboard {...zeroProps} />);
    expect(screen.getAllByText("0")).toHaveLength(2);
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("renders with different prop values", () => {
    const customProps = {
      leadsCount: 500,
      opportunitiesCount: 120,
      conversionRate: 24,
      totalValue: 750000,
    };
    render(<Dashboard {...customProps} />);
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("24%")).toBeInTheDocument();
    expect(screen.getByText("$750.000")).toBeInTheDocument();
  });

  it("applies correct CSS classes to stat cards", () => {
    render(<Dashboard {...defaultProps} />);
    const statCards = screen.getAllByText(
      /Total Leads|Opportunities|Conversion Rate|Total Value/
    );

    statCards.forEach((card) => {
      const cardContainer = card.closest("div")?.parentElement?.parentElement;
      expect(cardContainer).toHaveClass(
        "bg-white",
        "rounded-lg",
        "shadow-sm",
        "border",
        "border-gray-200",
        "p-6"
      );
    });
  });

  it("renders icons for each stat", () => {
    render(<Dashboard {...defaultProps} />);
    const icons = document.querySelectorAll("svg");
    expect(icons).toHaveLength(4);
  });

  it("applies correct color classes to icon containers", () => {
    render(<Dashboard {...defaultProps} />);
    const iconContainers = document.querySelectorAll(
      '[class*="bg-blue-500"], [class*="bg-green-500"], [class*="bg-purple-500"], [class*="bg-yellow-500"]'
    );
    expect(iconContainers).toHaveLength(4);
  });
});
