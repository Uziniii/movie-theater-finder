#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

bunx prisma db push

# Check the NODE_ENV environment variable
if [ "$NODE_ENV" = "development" ]; then
  echo "Starting Bun in development mode..."

  # Run the development server
  if [ "$FETCH" = "true" ]; then
    bun server:dev --fetch
  else
    bun server:dev
  fi
else
  echo "Starting Bun in production mode..."
  # Build the project
  bunx prisma generate
  # Start the production server

  if [ "$FETCH" = "true" ]; then
    bun server:start --fetch
  else
    bun server:start
  fi
fi
