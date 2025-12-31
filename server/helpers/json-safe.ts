export type DeepTransformRule = (value: unknown) => { transformed: true; value: unknown } | { transformed: false }

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function deepTransform<T>(
  value: T,
  rule: DeepTransformRule,
  seen = new WeakMap<object, unknown>()
): T {
  const ruled = rule(value)
  if (ruled.transformed) {
    return ruled.value as T
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  if (
    value instanceof Response ||
    value instanceof ReadableStream ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    value instanceof Blob
  ) {
    return value
  }

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
      out[i] = deepTransform(value[i] as unknown, rule, seen)
    }
    return out as unknown as T
  }

  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    seen.set(value as object, out)
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepTransform(v as unknown, rule, seen)
    }
    return out as unknown as T
  }

  return value
}

export function jsonSafe<T>(value: T): T {
  return deepTransform(value, (v) => {
    if (typeof v === "bigint") return { transformed: true, value: v.toString() }
    return { transformed: false }
  })
}
