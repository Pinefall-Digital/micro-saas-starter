import { PostsList } from "@/components/posts-list";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Micro SaaS Starter
        </h1>
        <p className="text-muted-foreground max-w-md">
          A production-ready template with Next.js, Tailwind, shadcn/ui,
          Prisma, Neon, Clerk, and Vercel.
        </p>
      </div>

      <PostsList />
    </main>
  );
}
