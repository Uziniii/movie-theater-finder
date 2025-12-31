import Elysia from "elysia";

const encoder = new TextEncoder()

export const compress = new Elysia({ name: 'compress' })
  .mapResponse(({ response, set }) => {
    const isJson = typeof response === 'object'

    const text = isJson
      ? JSON.stringify(response)
      : (response?.toString() ?? '')

    set.headers['Content-Encoding'] = 'gzip'

    let data = encoder.encode(text)
    let compressed = Bun.gzipSync(data, {level: 6})

    return new Response(compressed as unknown as BodyInit, {
      headers: {
        'Content-Type': `${
          isJson ? 'application/json' : 'text/plain'
        }; charset=utf-8`
      }
    })
  })
