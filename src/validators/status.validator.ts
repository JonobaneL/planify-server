import { z } from "zod";

export const StatusSchema = z.object({
  label: z.string().min(1).max(255),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  type: z.enum(["type", "status", "priority"]),
  orderIndex: z.number().int().min(0),
});

export const UpdateStatusSchema = StatusSchema.omit({
  type: true,
})
  .partial()
  .strict();

export type StatusT = z.infer<typeof StatusSchema>;
export type UpdateStatusT = z.infer<typeof UpdateStatusSchema>;
