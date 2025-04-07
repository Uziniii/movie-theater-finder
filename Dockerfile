# Run as a non-privileged user
FROM oven/bun:latest
RUN id -u app || useradd -ms /bin/sh -u 1001 app
USER app

# Install dependencies
WORKDIR /app

# Copy source files into application directory
COPY --chown=app:app . /app

RUN bun install
