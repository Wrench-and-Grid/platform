#!/bin/bash

set -e

echo "🔧 AWS S3 + CloudFront PDF Hosting Setup"
echo "==========================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Install it first: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ AWS Account ID: $AWS_ACCOUNT_ID"
echo ""

# Step 1: Create S3 bucket
echo "📦 Step 1: Creating S3 bucket..."
BUCKET_NAME="dg-lxd-portfolio-assets"

if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "   ℹ️  Bucket already exists: $BUCKET_NAME"
else
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region us-east-1
    echo "   ✅ Bucket created: $BUCKET_NAME"
fi
echo ""

# Step 1b: Block all public access
echo "🔒 Blocking public access..."
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
echo "   ✅ Public access blocked"
echo ""

# Step 2: Apply CORS policy
echo "⚙️  Step 2: Applying CORS policy..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CORS_FILE="$SCRIPT_DIR/s3-cors.json"

if [ ! -f "$CORS_FILE" ]; then
    echo "❌ CORS config not found: $CORS_FILE"
    exit 1
fi

aws s3api put-bucket-cors \
  --bucket "$BUCKET_NAME" \
  --cors-configuration file://"$CORS_FILE"
echo "   ✅ CORS policy applied"
echo ""

# Step 3: Manual CloudFront setup
echo "🌐 Step 3: Create CloudFront distribution (MANUAL)"
echo "   1. Open AWS Console → CloudFront → Create distribution"
echo "   2. Origin domain: $BUCKET_NAME.s3.amazonaws.com"
echo "   3. Origin access: Origin access control (OAC) → Create new OAC"
echo "   4. Allowed HTTP methods: GET, HEAD"
echo "   5. Cache policy: CachingOptimized"
echo "   6. Create distribution and save:"
echo "      - Distribution ID"
echo "      - Domain name (e.g., d1abc123xyz.cloudfront.net)"
echo ""

# Step 4: Apply bucket policy
echo "🔐 Step 4: Ready to apply bucket policy?"
read -p "   Enter CloudFront Distribution ID (from AWS Console): " DIST_ID

if [ -z "$DIST_ID" ]; then
    echo "❌ Distribution ID required"
    exit 1
fi

POLICY_FILE="$SCRIPT_DIR/s3-bucket-policy.json"

if [ ! -f "$POLICY_FILE" ]; then
    echo "❌ Bucket policy template not found: $POLICY_FILE"
    exit 1
fi

# Create temporary policy with actual values
TEMP_POLICY=$(mktemp)
sed "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g; s/YOUR_DISTRIBUTION_ID/$DIST_ID/g" "$POLICY_FILE" > "$TEMP_POLICY"

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy file://"$TEMP_POLICY"
rm "$TEMP_POLICY"
echo "   ✅ Bucket policy applied"
echo ""

# Step 5: Setup .env.local
echo "📝 Step 5: Setting up environment variables..."
read -p "   Enter CloudFront domain name (e.g., d1abc123xyz.cloudfront.net): " CF_DOMAIN

if [ -z "$CF_DOMAIN" ]; then
    echo "❌ CloudFront domain required"
    exit 1
fi

ENV_LOCAL="../.env.local"
cat > "$ENV_LOCAL" << EOF
# Local environment variables (git-ignored)
VITE_CDN_BASE_URL=https://$CF_DOMAIN
EOF
echo "   ✅ Created .env.local"
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Upload PDFs to S3:"
echo "     aws s3 cp path/to/file.pdf s3://$BUCKET_NAME/pdfs/file.pdf --content-type 'application/pdf'"
echo ""
echo "  2. Or sync a folder:"
echo "     aws s3 sync ./local-pdfs/ s3://$BUCKET_NAME/pdfs/ --content-type 'application/pdf'"
echo ""
echo "  3. Add PDF references to src/features/work/data/works.ts"
echo "  4. Run 'npm run build' to test"
echo ""
