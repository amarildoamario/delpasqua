import { z } from "zod";
import { normalizeContactPhone } from "@/lib/contactPhone";

export const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(64).transform((value, ctx) => {
    const phone = value.startsWith("+") ? normalizeContactPhone(value) : null;
    if (!phone) ctx.addIssue({ code: "custom", message: "Numero di telefono non valido" });
    return phone ?? z.NEVER;
  }),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(5).max(5000),
  consent: z.literal(true),
});
