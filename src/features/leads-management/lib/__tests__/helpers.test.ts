import { describe, it, expect } from "vitest";
import { getStatusColor, getScoreColor } from "../helpers";

describe("Helper utilities", () => {
  describe("getStatusColor", () => {
    it("returns correct colors for each status", () => {
      expect(getStatusColor("new")).toBe("bg-blue-100 text-blue-800");
      expect(getStatusColor("contacted")).toBe("bg-yellow-100 text-yellow-800");
      expect(getStatusColor("qualified")).toBe("bg-green-100 text-green-800");
      expect(getStatusColor("disqualified")).toBe("bg-red-100 text-red-800");
    });

    it("returns default color for unknown status", () => {
      expect(getStatusColor("unknown")).toBe("bg-gray-100 text-gray-800");
    });
  });

  describe("getScoreColor", () => {
    it("returns green for high scores", () => {
      expect(getScoreColor(90)).toBe("text-green-600");
      expect(getScoreColor(95)).toBe("text-green-600");
      expect(getScoreColor(100)).toBe("text-green-600");
    });

    it("returns yellow for medium scores", () => {
      expect(getScoreColor(80)).toBe("text-yellow-600");
      expect(getScoreColor(85)).toBe("text-yellow-600");
      expect(getScoreColor(89)).toBe("text-yellow-600");
    });

    it("returns red for low scores", () => {
      expect(getScoreColor(79)).toBe("text-red-600");
      expect(getScoreColor(50)).toBe("text-red-600");
      expect(getScoreColor(0)).toBe("text-red-600");
    });
  });
});
