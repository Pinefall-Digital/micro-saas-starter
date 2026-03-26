# Examples & How-To Guide

This document shows how to build on the Micro SaaS Starter template. Each section covers a common task with code snippets you can copy and adapt.

---

## Table of Contents

1. [Define a New App Route](#1-define-a-new-app-route)
2. [Create a Vercel Serverless Function](#2-create-a-vercel-serverless-function)
3. [Configure Vercel for CI/CD Deployment](#3-configure-vercel-for-cicd-deployment)
4. [Create Database Tables and Run Migrations with Prisma](#4-create-database-tables-and-run-migrations-with-prisma)
5. [Build a Form with React Hook Form](#5-build-a-form-with-react-hook-form)
6. [Use Zod for Schema Validation](#6-use-zod-for-schema-validation)
7. [Use TanStack Query for Data Fetching](#7-use-tanstack-query-for-data-fetching)

---

## 1. Define a New App Route

Next.js App Router uses file-system routing. Create a folder under `src/app/` with a `page.tsx` file.

### Static page

```tsx
// src/app/about/page.tsx
export const metadata = {
  title: "About | Micro SaaS",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-muted-foreground">
        Learn more about our product.
      </p>
    </main>
  );
}
```

This is now accessible at `/about`.

### Dynamic page with a URL parameter

```tsx
// src/app/posts/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  // Fetch the post by id from your database
  return <h1>Post {id}</h1>;
}
```

### Route groups (shared layouts without affecting the URL)

```
src/app/
├── (marketing)/          # URL prefix is NOT included
│   ├── layout.tsx        # Shared layout for marketing pages
│   ├── page.tsx          # / (home)
│   └── pricing/page.tsx  # /pricing
├── (dashboard)/
│   ├── layout.tsx        # Shared layout for dashboard
│   └── settings/page.tsx # /settings
```

---

## 2. Create a Vercel Serverless Function

In Next.js App Router, serverless functions are just **API route handlers** in `src/app/api/`. Vercel deploys them automatically as serverless (or fluid compute) functions.

### Basic API route

```tsx
// src/app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from the API" });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Process the request...
  return NextResponse.json({ received: body });
}
```

### Configure function runtime and region

```tsx
// src/app/api/heavy-task/route.ts
import { NextResponse } from "next/server";

// Vercel fluid compute configuration
export const runtime = "nodejs"; // or "edge" for edge functions
export const maxDuration = 30;   // seconds (up to 300 on Pro plan)

export async function POST(request: Request) {
  // Long-running work here...
  return NextResponse.json({ done: true });
}
```

### Vercel-specific configuration (vercel.json)

Create `vercel.json` in your project root to customize function behavior:

```json
{
  "functions": {
    "src/app/api/heavy-task/route.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "regions": ["iad1"]
}
```

---

## 3. Configure Vercel for CI/CD Deployment

### Initial setup

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Pull environment variables to local:
   ```bash
   vercel env pull .env.local
   ```

### Automatic deployments

Once your GitHub repo is connected to Vercel:

- **Push to `main`** → Production deployment
- **Push to any other branch** → Preview deployment
- **Pull requests** → Preview deployment with a unique URL

No additional CI/CD configuration needed — Vercel handles it automatically.

### Environment variables

Set them in the Vercel dashboard (Settings > Environment Variables) or via CLI:

```bash
vercel env add DATABASE_URL production
vercel env add CLERK_SECRET_KEY production
vercel env add BLOB_READ_WRITE_TOKEN production
```

### Build settings

Vercel auto-detects Next.js. Default settings:

- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

These can be overridden in Project Settings if needed.

---

## 4. Create Database Tables and Run Migrations with Prisma

### Define a new model

Edit `prisma/schema.prisma`:

```prisma
model Subscription {
  id        String   @id @default(cuid())
  userId    String
  plan      String   @default("free")  // "free" | "pro" | "enterprise"
  status    String   @default("active")
  expiresAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId])
  @@map("subscriptions")
}
```

Don't forget to add the reverse relation in the `User` model:

```prisma
model User {
  // ... existing fields
  subscription Subscription?
}
```

### Create and apply a migration

```bash
# Create a migration file and apply it to your dev database
npx prisma migrate dev --name add-subscriptions

# Regenerate the Prisma client (happens automatically with migrate dev)
npx prisma generate
```

### Apply migrations in production

```bash
npx prisma migrate deploy
```

### Useful Prisma commands

```bash
# View your database in a web UI
npx prisma studio

# Reset the database (destructive — drops all data)
npx prisma migrate reset

# Format the schema file
npx prisma format

# Introspect an existing database into your schema
npx prisma db pull
```

---

## 5. Build a Form with React Hook Form

This starter includes a working example in `src/components/contact-form.tsx`. Here's the pattern broken down:

### Basic form setup

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 1. Define the schema
const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupValues = z.infer<typeof signupSchema>;

// 2. Build the form component
export function SignupForm() {
  const {
    register,       // Connects inputs to form state
    handleSubmit,   // Wraps your submit handler with validation
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  // 3. Handle submission
  async function onSubmit(data: SignupValues) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Signup failed");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}
```

### Key concepts

- **`register("fieldName")`** — Binds an input to React Hook Form (handles onChange, onBlur, ref)
- **`zodResolver(schema)`** — Validates the entire form against your Zod schema on submit
- **`formState.errors`** — Contains validation errors per field after a failed submission
- **`handleSubmit(fn)`** — Only calls `fn` if validation passes

---

## 6. Use Zod for Schema Validation

### Define a schema for API request/response payloads

```tsx
// src/lib/validators.ts
import { z } from "zod";

// Schema for creating a post (request body)
export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().optional(),
  published: z.boolean().default(false),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

// Schema for the API response
export const postResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  createdAt: z.string().datetime(),
});

export type PostResponse = z.infer<typeof postResponseSchema>;
```

### Validate in an API route

```tsx
// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { createPostSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();

  // safeParse returns { success, data, error } instead of throwing
  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // result.data is typed as CreatePostInput
  const { title, content, published } = result.data;

  // Save to database...
  return NextResponse.json({ id: "new-id", title, content, published });
}
```

### Validate API responses on the client

```tsx
import { postResponseSchema } from "@/lib/validators";

const res = await fetch("/api/posts/123");
const json = await res.json();

// Throws if the response doesn't match the expected shape
const post = postResponseSchema.parse(json);
```

---

## 7. Use TanStack Query for Data Fetching

This starter includes a working example in `src/components/posts-list.tsx`. Here are the patterns:

### Fetch data with useQuery

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  email: string;
}

export function UserProfile({ userId }: { userId: string }) {
  const { data, isPending, isError, error } = useQuery<User>({
    // queryKey identifies this data in the cache.
    // Include variables so different users get separate cache entries.
    queryKey: ["user", userId],

    // queryFn does the actual fetching
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  );
}
```

### Mutate data with useMutation

```tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function DeletePostButton({ postId }: { postId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      // Invalidate the posts cache so the list refetches
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### Key concepts

- **`queryKey`** — A unique array that identifies cached data. Use it like a cache key.
- **`queryFn`** — The async function that fetches data. Throw on error.
- **`staleTime`** — How long data is considered fresh (configured in `src/lib/query-client.ts`).
- **`invalidateQueries`** — Marks cached data as stale, triggering a refetch.
- **`useMutation`** — For create/update/delete operations (anything that changes server state).
