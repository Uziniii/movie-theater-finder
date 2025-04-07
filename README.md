# Paris movies finder

Simple website to find movies showtimes of all theaters for films playing in Paris.

To install bun:

https://bun.sh/

To build project:

```bash
docker compose up db -d
docker buildx bake
```

To run:

```bash
# db should be already up from previous build
docker compose up db -d
# FETCH tell the app to fetch movies when starting
NODE_ENV=production FETCH=true docker compose up app -d
```

This project was created using `bun init` in bun v1.1.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
