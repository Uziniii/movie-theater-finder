function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

export function formatDateYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function getAllocineCinemaShowtimesUrl(options: {
  cinemaUrlPath: string
  date: Date
}) {
  const path = options.cinemaUrlPath.startsWith("/")
    ? options.cinemaUrlPath
    : `/${options.cinemaUrlPath}`

  const dateStr = formatDateYYYYMMDD(options.date)

  return `https://www.allocine.fr${path}#shwt_date=${dateStr}`
}
