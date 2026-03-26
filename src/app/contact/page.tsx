import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact | Micro SaaS",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <ContactForm />
    </main>
  );
}
