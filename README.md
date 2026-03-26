# Micro SaaS Starter

A production-ready starter template for building SaaS applications. Fork this repo and start building.

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Auth** | [Clerk](https://clerk.com/) |
| **Database** | [Neon](https://neon.tech/) (Serverless Postgres) |
| **ORM** | [Prisma](https://www.prisma.io/) (with Neon serverless adapter) |
| **State / Data Fetching** | [TanStack Query](https://tanstack.com/query) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Hosting** | [Vercel](https://vercel.com/) (frontend, serverless functions, blob storage) |

## Node Environment

This project requires **Node.js 20.x or later** (LTS recommended). It has been tested with Node 20, 22, and 25.

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd micro-saas-starter
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your credentials:

- **Clerk** — Get keys from [dashboard.clerk.com](https://dashboard.clerk.com)
- **Neon** — Get the connection string from [console.neon.tech](https://console.neon.tech)
- **Vercel Blob** — Get the token from your Vercel dashboard under Storage > Blob

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Run database migrations (once your Neon database is connected)

```bash
npx prisma migrate dev --name init
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/
│   │   ├── contact/route.ts   # Example POST endpoint with Zod validation
│   │   └── posts/route.ts     # Example GET endpoint for TanStack Query
│   ├── contact/page.tsx       # Contact form page
│   ├── layout.tsx             # Root layout with Providers + Navbar
│   ├── page.tsx               # Home page
│   └── globals.css            # Tailwind + shadcn/ui theme
├── components/
│   ├── ui/                    # shadcn/ui components (button, card, input, label)
│   ├── contact-form.tsx       # React Hook Form + Zod + TanStack Query example
│   ├── navbar.tsx             # Top navigation bar
│   ├── posts-list.tsx         # TanStack Query data fetching example
│   └── providers.tsx          # Client-side providers (QueryClientProvider)
├── generated/prisma/          # Auto-generated Prisma client (gitignored)
├── lib/
│   ├── db.ts                  # Prisma client singleton with Neon adapter
│   ├── query-client.ts        # TanStack Query client factory
│   ├── utils.ts               # Utility functions (cn helper)
│   └── validators.ts          # Zod schemas (shared between client & server)
├── middleware.ts               # Clerk auth middleware
prisma/
├── schema.prisma              # Database schema (User, Post models)
prisma.config.ts               # Prisma configuration
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma migrate dev` | Create and apply a new migration |
| `npx prisma studio` | Open Prisma's visual database editor |

## Adding shadcn/ui Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

Browse all components at [ui.shadcn.com](https://ui.shadcn.com/docs/components).

## Commit Convention

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) via a GitHub Actions workflow that runs on every push to any branch. All commit messages must follow the format:

```
<type>: <description>

[optional body]

[optional footer]
```

**Allowed types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`, `perf`, `build`, `revert`

**Examples:**
```
feat: add user profile page
fix: resolve login redirect loop
docs: update API usage examples
chore: upgrade dependencies
```

The linting is powered by [commitlint](https://commitlint.js.org/) with the `@commitlint/config-conventional` ruleset. Configuration is in `commitlint.config.js`.

## Deployment

This project is designed to deploy on Vercel:

1. Push your repo to GitHub
2. Import the project in [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Vercel will auto-deploy on every push to `main`

See [Examples.md](./Examples.md) for detailed deployment and CI/CD setup.

## License

See [LICENSE](./LICENSE).
