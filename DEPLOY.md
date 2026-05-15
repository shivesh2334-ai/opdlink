# Deploy OPDLink to GitHub + Vercel

## Step 1 — Create GitHub Repo

1. Go to https://github.com/new
2. Repository name: `opdlink`
3. Visibility: **Public** (or Private)
4. Do NOT initialise with README
5. Click **Create repository**

## Step 2 — Push from Working Copy (iPad)

Open Working Copy app, then:

```
Remote URL: https://github.com/YOUR_USERNAME/opdlink.git
```

Or via terminal / GitHub web upload of the zip.

## Step 3 — Connect Vercel

1. Go to https://vercel.com/new
2. Import `opdlink` from GitHub
3. Framework: **Next.js** (auto-detected)
4. Root directory: `.` (leave default)
5. Add environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-real-key`
6. Click **Deploy**

Vercel auto-deploys on every push to `main`. ✓

## GitHub Actions CI

Every push/PR triggers:
- TypeScript type check
- ESLint
- Production build

Workflow file: `.github/workflows/ci.yml`
