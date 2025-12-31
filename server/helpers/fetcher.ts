import type FileSystemCache from "./filesystem-cache";

export type RateLimitedFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
  key?: string,
) => Promise<Response>;

export function createRateLimitedFetch(
  rps: number,
  cache?: FileSystemCache
): RateLimitedFetch {
  if (!Number.isFinite(rps) || rps <= 0) {
    throw new Error("rps must be a positive number");
  }
  const minIntervalMs = 1000 / rps;
  let chain: Promise<number> = Promise.resolve(0);

  const schedule = async (): Promise<void> => {
    chain = chain.then((prev) => {
      const now = Date.now();
      const base = prev === 0 ? now : prev;
      const scheduled = Math.max(base + minIntervalMs, now);
      const wait = scheduled - now;
      return new Promise<number>((resolve) =>
        setTimeout(() => resolve(scheduled), wait)
      );
    });
    await chain;
  };

  const limitedFetch: RateLimitedFetch = async (input, init, key) => {
    if (cache && key) {
      const cached = await cache.get(key);
      if (cached !== null) {
        return new Response(cached, {
          headers: {
            "X-Cache": "HIT",
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    }

    await schedule();
    const res = await fetch(input as any, init as any);

    if (!cache || !key) return res;

    const text = await res.text();
    if (res.ok || res.status === 404) {
      await cache.set(key, text);
    }
    return new Response(text, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  };

  return limitedFetch;
}

export default createRateLimitedFetch;
