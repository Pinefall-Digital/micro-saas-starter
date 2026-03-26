"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// PostsList — Example of TanStack Query for data fetching
//
// useQuery handles:
//   - Caching: results are cached by the queryKey
//   - Deduplication: multiple components using the same key share one request
//   - Background refetching: data stays fresh automatically
//   - Loading & error states: isPending / isError / data are reactive
//
// The queryKey ["posts"] identifies this data in the cache. Any component
// calling useQuery with the same key will share the cached result.
// ---------------------------------------------------------------------------

interface Post {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
}

export function PostsList() {
  const {
    data: posts,
    isPending,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
        <CardDescription>
          Fetched with TanStack Query (see DevTools for cache state)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && <p className="text-sm text-muted-foreground">Loading posts...</p>}
        {isError && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}
        {posts && posts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No posts yet. Connect your database and create some!
          </p>
        )}
        {posts && posts.length > 0 && (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id} className="rounded-md border p-3">
                <p className="font-medium">{post.title}</p>
                {post.content && (
                  <p className="text-sm text-muted-foreground">
                    {post.content}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
