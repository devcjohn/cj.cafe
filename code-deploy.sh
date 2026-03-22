#!/bin/sh
set -e # Exit immediately if a command exits with a non-zero status

[ -f .env ] || { echo ".env file not found"; exit 1; }
. ./.env # Load environment variables

EXPECTED_HASH=$(git rev-parse --short HEAD)

npm run build
aws s3 sync ./dist s3://"$AWS_BUCKET_NAME" --delete
aws cloudfront create-invalidation --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"

# Post-deploy smoke check: verify the new build landed
echo "Waiting for CloudFront invalidation to propagate..."
RETRIES=0
MAX_RETRIES=30
while [ $RETRIES -lt $MAX_RETRIES ]; do
  DEPLOYED_HASH=$(curl -s "https://cj.cafe/build-info.json?cb=$(date +%s)" | grep -o '"hash":"[^"]*"' | cut -d'"' -f4)
  if [ "$DEPLOYED_HASH" = "$EXPECTED_HASH" ]; then
    echo "Deploy verified! Build $EXPECTED_HASH is live."
    exit 0
  fi
  RETRIES=$((RETRIES + 1))
  echo "Attempt $RETRIES/$MAX_RETRIES - got '$DEPLOYED_HASH', expected '$EXPECTED_HASH'"
  sleep 10
done

echo "WARNING: Deploy could not be verified after $MAX_RETRIES attempts."
exit 1
