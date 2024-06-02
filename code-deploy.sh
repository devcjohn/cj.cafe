#!/bin/sh

# Load environment variables from .env file
. ./.env

npm run build
aws s3 sync ./dist s3://"$AWS_BUCKET_NAME" --delete
aws cloudfront create-invalidation --distribution-id  "$AWS_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"