# AWS S3 + CloudFront PDF Hosting

PDFs are served from a private S3 bucket (`dg-lxd-portfolio-assets`) fronted by CloudFront.
The app reads `VITE_CDN_BASE_URL` at build time to construct all PDF URLs.

---

## 1 — Create the S3 bucket

```bash
aws s3api create-bucket \
  --bucket dg-lxd-portfolio-assets \
  --region us-east-1
```

Block all public access (CloudFront will be the only reader):

```bash
aws s3api put-public-access-block \
  --bucket dg-lxd-portfolio-assets \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

---

## 2 — Apply the CORS policy

Edit `infra/s3-cors.json` and replace `yourdomain.com` with your real domain, then:

```bash
aws s3api put-bucket-cors \
  --bucket dg-lxd-portfolio-assets \
  --cors-configuration file://infra/s3-cors.json
```

---

## 3 — Create a CloudFront distribution

1. Open **AWS Console → CloudFront → Create distribution**
2. Origin domain: `dg-lxd-portfolio-assets.s3.amazonaws.com`
3. Origin access: **Origin access control (OAC)** — create a new OAC
4. Allowed HTTP methods: `GET, HEAD`
5. Cache policy: `CachingOptimized`
6. Price class: choose based on your audience
7. Create the distribution and note the **Distribution ID** and **Domain name**

---

## 4 — Apply the bucket policy

Open `infra/s3-bucket-policy.json` and replace:
- `YOUR_ACCOUNT_ID` → your 12-digit AWS account ID
- `YOUR_DISTRIBUTION_ID` → the CloudFront distribution ID from step 3

Then apply it:

```bash
aws s3api put-bucket-policy \
  --bucket dg-lxd-portfolio-assets \
  --policy file://infra/s3-bucket-policy.json
```

---

## 5 — Upload PDFs

Name your files to match the keys already in `works.ts`, then upload:

```bash
# Upload a single PDF
aws s3 cp path/to/react-essential-guide.pdf \
  s3://dg-lxd-portfolio-assets/pdfs/react-essential-guide.pdf \
  --content-type "application/pdf"

# Upload all PDFs at once
aws s3 sync ./local-pdfs/ s3://dg-lxd-portfolio-assets/pdfs/ \
  --content-type "application/pdf"
```

Files currently referenced in `works.ts`:

| Work item              | S3 key                                          |
|------------------------|-------------------------------------------------|
| React Essential Guide  | `pdfs/react-essential-guide.pdf`                |
| Applied Technology     | `pdfs/applied-technology.pdf`                   |

> To add a new PDF: upload it to S3, then add an entry to the `pdfFiles` array
> in `works.ts` using `pdf("your-filename.pdf")`.

---

## 6 — Set the environment variable

**Local dev** — create `.env.local` (git-ignored):

```
VITE_CDN_BASE_URL=https://d1abc123xyz.cloudfront.net
```

**Vercel (production)** — add `VITE_CDN_BASE_URL` in:
Project Settings → Environment Variables → Production

---

## (Optional) Custom domain on CloudFront

1. Request an ACM certificate for `cdn.yourdomain.com` in `us-east-1`
2. Add an Alternate domain name (CNAME) to the CloudFront distribution
3. Add a CNAME record in your DNS provider pointing to the CloudFront domain
4. Update `VITE_CDN_BASE_URL` to `https://cdn.yourdomain.com`
