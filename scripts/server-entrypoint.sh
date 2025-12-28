#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e


# Check the NODE_ENV environment variable
if [ "$NODE_ENV" = "development" ]; then
  echo "Starting Bun in development mode..."
  bunx prisma generate

  # Run the development server
  if [ "$FETCH" = "true" ]; then
    bun server:dev --fetch
  else
    bun server:dev
  fi
else
  echo "Starting Bun in production mode..."
  bunx prisma migrate deploy
  bunx prisma generate

  # Run the production server
  if [ "$FETCH" = "true" ]; then
    bun server:start --fetch
  else
    bun server:start
  fi
fi
