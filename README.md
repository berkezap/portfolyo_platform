# PortfolYO

> Turn your GitHub profile into a professional portfolio in minutes.

**Live at:** [portfolyo.tech](https://portfolyo.tech)

A full-stack SaaS platform that automatically generates beautiful portfolio websites from GitHub data. Built to solve the problem of developers spending hours creating portfolios instead of coding.

---

## What It Does

- **One-click portfolio generation** from GitHub profile
- **Real-time preview** before publishing
- **Custom domains** (yourname.portfolyo.tech)
- **Multiple professional templates** (Minimalist, Modern, Creative)
- **Responsive design** that works on any device
- **Analytics dashboard** to track portfolio views

## Tech Stack

**Frontend:** Next.js 15 (App Router), React 19, TypeScript  
**Backend:** Supabase (PostgreSQL + Storage)  
**Authentication:** NextAuth.js (GitHub OAuth)  
**Styling:** Tailwind CSS + shadcn/ui  
**Deployment:** Vercel (Edge Functions)  
**Payments:** Stripe (subscription billing)

## Key Features I Built

### 1. GitHub Integration

- OAuth flow with GitHub
- Fetches repos, stars, languages automatically
- Real-time data sync

### 2. Portfolio Editor

- Drag-and-drop project ordering
- Template switching with live preview
- CV/resume upload to Supabase Storage

### 3. Publishing System

- Subdomain routing (middleware-based)
- Environment-aware deployment (dev/staging/prod)
- SEO-optimized generated HTML

### 4. Subscription System

- Stripe integration for premium features
- Webhook handling for payment events
- Usage-based limits

## Development Workflow

This project uses a strict git workflow for quality control:

\`\`\`bash
feature branches → preview (staging) → main (production)
\`\`\`

Each environment has its own GitHub OAuth app and database to prevent conflicts.

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for details.

## Project Structure

\`\`\`
src/
├── app/
│ ├── api/ # REST API routes
│ ├── dashboard/ # User dashboard
│ ├── portfolio/[id]/ # Portfolio pages
│ └── [slug]/ # Public portfolio routes
├── components/ # React components
├── lib/
│ ├── auth.ts # NextAuth config
│ ├── supabase.ts # Database client
│ └── stripe.ts # Payment integration
└── middleware.ts # Auth + routing
\`\`\`

## Challenges Solved

**Challenge:** Preview deployments breaking GitHub OAuth  
**Solution:** Created separate OAuth apps per environment (dev/preview/prod)

**Challenge:** Portfolio edits not updating published version  
**Solution:** Environment-aware API that updates both \`generated_html\` and \`published_html\`

**Challenge:** CSP blocking Supabase storage in production  
**Solution:** Synced Content-Security-Policy headers between \`next.config.ts\` and \`middleware.ts\`

## Performance

- Lighthouse Score: 95+ on all metrics
- First Contentful Paint: <1.2s
- Time to Interactive: <2.5s

---

## License

© 2025 Berke Zap. Proprietary software - all rights reserved.

This is a private commercial project. The code is not available for redistribution or commercial use.

**Viewing this repo?** I'm open to discussing the technical decisions and architecture. Feel free to reach out for collaboration opportunities.

**Contact:** ihsanberke.ozsap@std.yeditepe.edu.tr
