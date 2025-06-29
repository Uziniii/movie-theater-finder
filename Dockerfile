# Run as a non-privileged user
FROM oven/bun:latest

USER root
RUN apt-get update -y && apt-get install -y openssl

RUN id -u app &>/dev/null || useradd -ms /bin/sh -u 1001 app

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN bun install

# Copy source files into application directory
COPY --chown=app:app . /app
USER app

