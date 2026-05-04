#!/bin/bash

set -e

BUCKET_NAME="dg-lxd-portfolio-assets"

if [ $# -eq 0 ]; then
    echo "Usage: ./upload-pdfs.sh <directory-with-pdfs> [--dry-run]"
    echo ""
    echo "Examples:"
    echo "  ./upload-pdfs.sh ~/Downloads/my-pdfs"
    echo "  ./upload-pdfs.sh ./pdfs --dry-run"
    exit 1
fi

PDF_DIR="$1"
DRY_RUN="${2:-}"

if [ ! -d "$PDF_DIR" ]; then
    echo "❌ Directory not found: $PDF_DIR"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found"
    exit 1
fi

echo "📤 Uploading PDFs to S3..."
echo "   Bucket: $BUCKET_NAME"
echo "   Source: $PDF_DIR"
echo "   Destination: s3://$BUCKET_NAME/pdfs/"

if [ "$DRY_RUN" = "--dry-run" ]; then
    echo "   [DRY RUN - no files will be uploaded]"
fi

echo ""

# Count PDF files
PDF_COUNT=$(find "$PDF_DIR" -maxdepth 1 -name "*.pdf" | wc -l)

if [ "$PDF_COUNT" -eq 0 ]; then
    echo "❌ No PDF files found in: $PDF_DIR"
    exit 1
fi

echo "Found $PDF_COUNT PDF file(s)"
echo ""

# Upload files
if [ "$DRY_RUN" = "--dry-run" ]; then
    aws s3 sync "$PDF_DIR" s3://"$BUCKET_NAME"/pdfs/ \
      --content-type "application/pdf" \
      --dryrun \
      --exclude "*" \
      --include "*.pdf"
else
    aws s3 sync "$PDF_DIR" s3://"$BUCKET_NAME"/pdfs/ \
      --content-type "application/pdf" \
      --exclude "*" \
      --include "*.pdf"
    echo "✅ Upload complete!"
fi

echo ""
echo "Next: Update src/features/work/data/works.ts with PDF references"
