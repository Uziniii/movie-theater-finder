import * as cheerio from 'cheerio';

type Cinema = {
  name: string
  url: string
}

const cinemas: Cinema[] = []

let page = 0
while (true) {
  const response = await fetch(`https://www.allocine.fr/salle/cinema/ville-115755/?page=${page}`)
  const $ = cheerio.load(await response.text())
  
  const data = $("#content-layout > div.section.section-wrap.gd-2-cols.gd-gap-30 > div > ul > li > div > div > div > div.meta-theater-title > h2").extract({
    name: ["a"],
    url: [{
      selector: "a",
      value: "href"
    }]
  })
  
  const result = data.name.map((x, i) => ({
    name: x.trim(),
    url: data.url[i]
  }))
  
  cinemas.push(...result)
  
  if ($("#content-layout > div.section.section-wrap.gd-2-cols.gd-gap-30 > div > ul > nav > span.button-right.button-disabled").html() !== null)
    break

  page++
}

Bun.write("prisma/cinemas.json", JSON.stringify(cinemas))
