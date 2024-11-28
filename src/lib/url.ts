export function url(url: string, query?: Record<string, any>) {
  if (query) {
    const querys = Object.entries(query)

    if (querys.length > 0) {
      url += "?"

      for (const [key, value] of querys) {
        if (value) {
          url += `${key}=${encodeURIComponent(value)}&`
        }
      }
    }
  }

  return url
}