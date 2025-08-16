import { z } from "zod";

export const leadEditSchema = z.object({
  email: z.email("Invalid email format"),
  status: z.enum(["new", "contacted", "qualified", "disqualified"]),
});

export type LeadEditFormData = z.infer<typeof leadEditSchema>;
