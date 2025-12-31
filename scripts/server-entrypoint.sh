#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

TEST_ARG=""
if [ "$TEST" = "true" ]; then
  TEST_ARG="--test"
fi

FETCH_ARG=""
if [ "$FETCH" = "true" ]; then
  FETCH_ARG="--fetch"
fi

# Check the NODE_ENV environment variable
if [ "$NODE_ENV" = "development" ]; then
  echo "Starting Bun in development mode..."
  bunx prisma generate

  # Run the development server
  bun server:dev $FETCH_ARG $TEST_ARG
else
  echo "Starting Bun in production mode..."
  bunx prisma migrate deploy

  # Run the production server
  bun server:start $FETCH_ARG $TEST_ARG
fi
