export function url(url: string, query?: Record<string, any>) {
  if (query) {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(query)) {
      if (value) {
        params.set(key, String(value))
      }
    }

    const qs = params.toString()

    if (qs) {
      url += `?${qs}`
    }
  }

  return url
}