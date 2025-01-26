# Run as a non-privileged user
FROM bun:latest
RUN useradd -ms /bin/sh -u 1001 app
USER app

# Install dependencies
WORKDIR /app

# Copy source files into application directory
COPY --chown=app:app . /app

RUN bun install
