import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Micro SaaS
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          {/* Replace with <SignInButton /> / <UserButton /> from @clerk/nextjs */}
          <Button size="sm">Sign In</Button>
        </div>
      </nav>
    </header>
  );
}
