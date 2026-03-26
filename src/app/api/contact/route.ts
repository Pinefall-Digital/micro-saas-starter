import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validators";

// POST /api/contact — example API route with Zod validation
export async function POST(request: Request) {
  const body = await request.json();

  // Validate the request body against the Zod schema
  const result = contactFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // result.data is fully typed as ContactFormValues
  const { name, email, message } = result.data;

  // TODO: Replace with your actual logic (send email, save to DB, etc.)
  console.log("Contact form submission:", { name, email, message });

  return NextResponse.json({ success: true });
}
