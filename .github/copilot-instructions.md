    # GitHub Copilot - Workspace Instructions

    ## 🎯 Project: PortfolYO Platform

    ### Git Workflow (ALWAYS ENFORCE)

    **CRITICAL: Never suggest direct commits to `main` branch!**

    Always follow this workflow:

    1. Create feature branch: `git checkout -b feature/name`
    2. Test in preview: merge to `preview` branch first
    3. Deploy to production: merge `preview` to `main`

    ```bash
    # ✅ CORRECT
    feature → preview → main

    # ❌ WRONG - Never suggest this
    feature → main (direct)
    ```

    ### When User Asks About Git/Deployment

    Always remind:

    - "Did you test in preview first?"
    - "Remember: feature → preview → main"
    - "Check docs/WORKFLOW.md for details"

    ### Branch Naming

    - Features: `feature/name`
    - Bugfixes: `bugfix/name`
    - Hotfixes: `hotfix/name`

    ### Environment URLs

    - Development: `localhost:3000`
    - Preview: `https://portfolyoplatform-git-preview-berkezaps-projects.vercel.app`
    - Production: `https://portfolyo.tech`

    ### Code Style

    - Next.js 15 App Router
    - TypeScript strict mode
    - Tailwind CSS for styling
    - Supabase for backend
    - NextAuth for authentication

    ### Testing Checklist

    Before suggesting production deployment:

    1. ✅ Tested on localhost
    2. ✅ Tested on preview URL
    3. ✅ GitHub OAuth works
    4. ✅ No console errors
    5. ✅ UI looks good on mobile

    ---

    **Remember: This project uses a strict workflow. Always enforce it!**
