#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status


[ -f .env ] || { echo ".env file not found"; exit 1; }
# Load environment variables
. ./.env

npm run build
aws s3 sync ./dist s3://"$AWS_BUCKET_NAME" --delete
aws cloudfront create-invalidation --distribution-id  "$AWS_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"