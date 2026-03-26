import { z } from "zod";

// ---------------------------------------------------------------------------
// Example Zod schema: Contact form validation
// This schema is shared between the client form and the API route so the
// validation rules are defined once and enforced everywhere.
// ---------------------------------------------------------------------------
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be under 1000 characters"),
});

// Infer the TypeScript type from the Zod schema — use this for type-safe
// form values, API request bodies, etc.
export type ContactFormValues = z.infer<typeof contactFormSchema>;
