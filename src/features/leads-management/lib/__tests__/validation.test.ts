import { describe, it, expect } from "vitest";
import { leadEditSchema } from "../validation";

describe("leadEditSchema", () => {
  describe("email validation", () => {
    it("should validate a correct email format", () => {
      const validData = {
        email: "test@example.com",
        status: "new" as const,
      };

      const result = leadEditSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject an invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        status: "new" as const,
      };

      const result = leadEditSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email format");
      }
    });

    it("should reject an empty email", () => {
      const invalidData = {
        email: "",
        status: "new" as const,
      };

      const result = leadEditSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email format");
      }
    });
  });

  describe("status validation", () => {
    it("should validate all valid status values", () => {
      const validStatuses = [
        "new",
        "contacted",
        "qualified",
        "disqualified",
      ] as const;

      validStatuses.forEach((status) => {
        const validData = {
          email: "test@example.com",
          status,
        };

        const result = leadEditSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it("should reject an invalid status", () => {
      const invalidData = {
        email: "test@example.com",
        status: "invalid-status",
      };

      const result = leadEditSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
