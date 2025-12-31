import Elysia from "elysia";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function deepBigIntToString<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  if (typeof value === "bigint") {
    return value.toString() as unknown as T
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  // Don't touch streaming/response/binary types
  if (
    value instanceof Response ||
    value instanceof ReadableStream ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    value instanceof Blob
  ) {
    return value
  }

  // Preserve Date instances (JSON.stringify will turn them into ISO strings)
  if (value instanceof Date) {
    return value
  }

  if (seen.has(value as object)) {
    return seen.get(value as object) as T
  }

  if (Array.isArray(value)) {
    const out: unknown[] = []
    seen.set(value as object, out)
    for (let i = 0; i < value.length; i++) {
      out[i] = deepBigIntToString(value[i] as unknown, seen)
    }
    return out as unknown as T
  }

  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    seen.set(value as object, out)
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepBigIntToString(v as unknown, seen)
    }
    return out as unknown as T
  }

  // For class instances (e.g. Prisma Decimal), keep as-is.
  return value
}

export const safeJson = new Elysia({ name: "safeJson" })
  .mapResponse(({ response }) => {
    // Only transform "JSON-ish" payloads; let strings, numbers, files, etc pass through.
    if (response === null) return response
    if (typeof response === "bigint") return response.toString()
    if (typeof response !== "object") return response
    if (response instanceof Response) return response

    return deepBigIntToString(response)
  })
