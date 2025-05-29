# Paris movies finder

Simple website to find movies showtimes of all theaters for films playing in Paris.

<img src="https://github.com/user-attachments/assets/7c1471b5-4aec-426b-9883-0613e8c534a8" width="60%"></img>
<img src="https://github.com/user-attachments/assets/4b473754-f759-49ff-a5c5-ad3faee633ac" width="30%"></img> 

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
