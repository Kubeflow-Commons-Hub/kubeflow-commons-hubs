# Kubeflow Commons Hub

The one-stop community platform for Kubeflow in India. Learn, contribute, and grow with the community.

## Features

- **Public pages** - Events, News, CFPs, Badge catalog, Leaderboard, Member directory
- **Authentication** - Sign in with Google, GitHub, or email (powered by Supabase Auth)
- **User profiles** - GitHub contribution tracking, badges, journey timeline
- **CFP system** - Submit and track talk proposals with a multi-step form
- **Digital badges** - Earn verifiable badges for contributions, events, and community participation
- **Gamification** - Points, levels, and leaderboard to recognize contributors
- **Admin panel** - Manage events, CFPs, badges, users, and content

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Database & Auth | Supabase (PostgreSQL 15, Auth, Edge Functions, Realtime) |
| File Storage | Cloudflare R2 (S3-compatible, zero egress) |
| ORM | Drizzle ORM |
| UI | Tailwind CSS v4, shadcn/ui, Radix Primitives |
| Animation | motion (Framer Motion v11), native View Transitions |
| Forms | React Hook Form + Zod |
| Client State | TanStack Query v5 |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Setup

```bash
# Clone the repo
git clone https://github.com/your-org/kubeflow-common-hubs.git
cd kubeflow-common-hubs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Apache 2.0 - see [LICENSE](LICENSE).
