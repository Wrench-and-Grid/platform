# Infrastructure Setup

This folder contains AWS S3 + CloudFront configuration for PDF hosting.

## Quick Start

### 1. One-time AWS Setup (5 min)

```bash
./setup-aws.sh
```

This script will:
- ✅ Create the S3 bucket
- ✅ Block public access
- ✅ Apply CORS policy
- ⚠️  Prompt you to create CloudFront distribution manually (2 min in AWS Console)
- ✅ Apply bucket policy once you provide the Distribution ID
- ✅ Create `.env.local` with your CloudFront URL

You'll need:
- AWS CLI installed and configured (`aws configure`)
- AWS Account ID (displayed during setup)
- CloudFront Distribution ID (get from AWS Console after creation)

### 2. Upload PDFs (1 min)

```bash
./upload-pdfs.sh ~/path/to/your/pdfs
```

Or test first with:
```bash
./upload-pdfs.sh ~/path/to/your/pdfs --dry-run
```

### 3. Update Code

Add PDF references to `src/features/work/data/works.ts`:

```typescript
pdfFiles: [
  pdf("react-essential-guide.pdf"),
  pdf("your-new-file.pdf")
]
```

---

## Files

- `setup-aws.sh` — Automates AWS infrastructure setup
- `upload-pdfs.sh` — Syncs local PDFs to S3
- `s3-cors.json` — CloudFront CORS policy (configured for daisyg.studio)
- `s3-bucket-policy.json` — Restricts S3 access to CloudFront only

---

## Manual Steps (if needed)

### Create CloudFront Distribution

If setup script prompts you:

1. AWS Console → **CloudFront** → **Create distribution**
2. **Origin domain:** `dg-lxd-portfolio-assets.s3.amazonaws.com`
3. **Origin access:** `Origin access control (OAC)` → Create new
4. **HTTP methods:** `GET, HEAD`
5. **Cache policy:** `CachingOptimized`
6. Click **Create distribution**
7. Save: **Distribution ID** and **Domain name**

### Update Domain (after custom domain setup)

If you add a custom domain (e.g., `cdn.daisyg.studio`):

1. Update `.env.local`:
   ```
   VITE_CDN_BASE_URL=https://cdn.daisyg.studio
   ```
2. Update `s3-cors.json` AllowedOrigins if needed

---

## Troubleshooting

**"AWS CLI not found"**  
Install: https://aws.amazon.com/cli/

**"AWS credentials not configured"**  
Run: `aws configure` and enter your AWS Access Key and Secret Key

**"Bucket already exists"**  
If you get an error during setup, the bucket may exist. Verify in AWS Console and run setup again—it will skip creation.

**Upload fails with permission error**  
Make sure:
1. Bucket policy was applied (setup script step 4)
2. You used the correct Distribution ID
3. AWS credentials have S3 permissions

---

## Environment Variables

After setup, you'll have `.env.local` (git-ignored):

```
VITE_CDN_BASE_URL=https://d1abc123xyz.cloudfront.net
```

For production (Vercel), add the same env var in Vercel project settings.
