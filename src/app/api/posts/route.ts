import { NextResponse } from "next/server";

// GET /api/posts — example API route for TanStack Query to fetch
export async function GET() {
  // TODO: Replace with actual Prisma query once database is connected:
  //
  //   import { db } from "@/lib/db";
  //   const posts = await db.post.findMany({
  //     where: { published: true },
  //     orderBy: { createdAt: "desc" },
  //     take: 10,
  //   });
  //   return NextResponse.json(posts);

  // Placeholder response for demo purposes
  const posts = [
    {
      id: "1",
      title: "Getting Started with Micro SaaS Starter",
      content: "This is a demo post loaded from the API route.",
      published: true,
    },
    {
      id: "2",
      title: "Building with Next.js + Prisma + Neon",
      content: "Connect your Neon database to see real data here.",
      published: true,
    },
  ];

  return NextResponse.json(posts);
}
