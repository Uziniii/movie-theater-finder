# Run as a non-privileged user
FROM oven/bun:1.3.5-debian

USER root
RUN apt-get update -y && apt-get install -y openssl

# RUN id -u app &>/dev/null || useradd -ms /bin/sh -u 1001 app
RUN useradd -ms /bin/sh -u 1001 app

# Install dependencies
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

# Copy source files into application directory
COPY --chown=app:app . /app

RUN bunx prisma generate

# Fix ownership of node_modules to app user
RUN chown -R app:app /app/node_modules

# Build the application
RUN bun server:build
RUN bun vite:build

# Fix ownership of build outputs to app user
RUN chown -R app:app /app/server-dist

EXPOSE 3000

USER app
