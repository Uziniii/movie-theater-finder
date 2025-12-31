import { UAParser } from "ua-parser-js"

type MapsLink = {
  deepLinkUrl?: string
  fallbackUrl: string
  platform: "macos" | "ios" | "android" | "other"
}

function buildQuery(cinemaName: string, cinemaAddress?: string | null) {
  return cinemaAddress ? `${cinemaAddress} ${cinemaName}` : cinemaName
}

export function getCinemaMapsLink(options: {
  cinemaName: string
  cinemaAddress?: string | null
}): MapsLink {
  const query = buildQuery(options.cinemaName, options.cinemaAddress)
  const encoded = encodeURIComponent(query)

  const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`

  try {
    const parser = new UAParser(navigator.userAgent)
    const osName = (parser.getOS().name ?? "").toLowerCase()
    const deviceType = (parser.getDevice().type ?? "").toLowerCase()

    const isMobile = deviceType === "mobile" || deviceType === "tablet"

    // macOS: can deep-link to Apple Maps app via maps://
    if (osName.includes("mac")) {
      return {
        deepLinkUrl: `maps://?q=${encoded}`,
        fallbackUrl: `https://maps.apple.com/?q=${encoded}`,
        platform: "macos",
      }
    }

    if (!isMobile) {
      return { fallbackUrl, platform: "other" }
    }

    // iOS: use Apple Maps URL scheme
    if (osName.includes("ios") || osName.includes("iphone") || osName.includes("ipad")) {
      return {
        deepLinkUrl: `maps://?q=${encoded}`,
        fallbackUrl: `https://maps.apple.com/?q=${encoded}`,
        platform: "ios",
      }
    }

    // Android: geo URI opens default maps handler (often prompts / uses default)
    if (osName.includes("android")) {
      return {
        deepLinkUrl: `geo:0,0?q=${encoded}`,
        fallbackUrl,
        platform: "android",
      }
    }

    return { fallbackUrl, platform: "other" }
  } catch {
    return { fallbackUrl, platform: "other" }
  }
}

export function openCinemaInMaps(options: {
  cinemaName: string
  cinemaAddress?: string | null
  fallbackDelayMs?: number
}) {
  const { deepLinkUrl, fallbackUrl, platform } = getCinemaMapsLink(options)

  // Desktop: just open the web URL
  if (!deepLinkUrl) {
    window.open(fallbackUrl, "_blank", "noreferrer")
    return
  }

  // macOS deep links typically trigger an OS chooser dialog that does not
  // background the page; auto-fallback would open a second tab/window.
  // So on macOS we only attempt the deep link.
  if (platform === "macos") {
    window.location.href = deepLinkUrl
    return
  }

  // Mobile deep-link attempt with fallback
  const delay = options.fallbackDelayMs ?? 900
  let didHide = false

  const onVisibility = () => {
    if (document.hidden) didHide = true
  }

  document.addEventListener("visibilitychange", onVisibility, { once: true })

  // Use location change for schemes (more reliable than window.open for geo:/maps://)
  window.location.href = deepLinkUrl

  window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibility)

    // If the app opened, the page usually gets backgrounded.
    if (!didHide) {
      window.open(fallbackUrl, "_blank", "noreferrer")
    }
  }, delay)
}
