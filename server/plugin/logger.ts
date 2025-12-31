import Elysia from "elysia";

const requestStart = new WeakMap<Request, number>()

function getStatusCode(response: unknown): number | undefined {
  if (response && typeof response === "object") {
    const maybe = response as { code?: unknown }
    if (typeof maybe.code === "number") return maybe.code
  }
  return undefined
}

export const logger = new Elysia({ name: 'logger' })
  .onBeforeHandle({ as: 'global' }, ({ path, request }) => {
    requestStart.set(request, performance.now())
    console.log(`[${request.method}] ${path}`)
  })
  .onError({ as: "global" }, ({ path, request, error }) => {
    const start = requestStart.get(request)
    const durationMs = start !== undefined ? performance.now() - start : undefined
    const durationPart = durationMs !== undefined ? ` - ${durationMs.toFixed(1)}ms` : ""
    console.log(`[${request.method}] ${path}${durationPart}`, error)
  })
  .onAfterResponse({ as: "global" }, ({ request, path, response }) => {
    const start = requestStart.get(request)
    const durationMs = start !== undefined ? performance.now() - start : undefined
    const durationPart = durationMs !== undefined ? ` - ${durationMs.toFixed(1)}ms` : ""

    const statusCode = getStatusCode(response)
    const statusPart = statusCode !== undefined ? ` - ${statusCode}` : ""

    console.log(`[${request.method}] ${path}${statusPart}${durationPart}`)

    if (typeof response === "object" && response !== null) {
      const maybeResponse = response as { code: number, response?: { error?: unknown } };
      if (maybeResponse.response?.error) {
        const { code, response: { error } } = maybeResponse
        console.log(`[${request.method}] ${path} - ${code}${durationPart} - [Error: ${error}]`);
      }
    }
  })