import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import type { Movie, Schedule } from "@/api"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"

const versionToText = {
  vo: "- VO",
  vf: "- VF",
  dub: "- Sous-titré",
  null: ""
}

type Props = {
  movie: Movie
}

export const CardMovie = React.memo(function CardMovie({ movie }: Props) {
  return <Card className="overflow-hidden flex flex-col">
    <div className="p-4 flex max-md:flex-col">
      <div className="md:w-1/3">
        <img
          src={movie.poster === "" ? "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png" : movie.poster.replace("r_200_283", "r_800_1132")}
          alt={`${movie.title} Poster`}
          width={800}
          height={1132}
          className="w-full h-auto object-cover rounded-md"
        />
      </div>
      <div className="pt-6 md:p-6 md:pt-0 md:w-2/3">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="mb-2">{movie.title}</CardTitle>
          <CardDescription>{movie.synopsis}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.director && <Badge>{movie.director}</Badge>}
            <Badge>{Intl.DateTimeFormat("fr-FR").format(new Date(movie.release))}</Badge>
            {movie.genres.split(",").map((m, i) => (
              <Badge variant={"secondary"} key={i}>{m}</Badge>
            ))}
          </div>
          {movie.cast !== "" &&
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Acteurs</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.cast.split(",").map((m, i) => (
                  <Badge key={i}>{m}</Badge>
                ))}
              </div>
            </div>
          }
        </CardContent>
      </div>
    </div>
    <div className="p-4 pt-0">
      <ScrollArea style={{ height: Math.min(86 * movie.schedules.length, 344) }} className="rounded-md border p-3">
        <Accordion type="single" collapsible className="w-full">
          {movie.schedules.map((s, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{s.cinema} {versionToText[s.version ?? "null"]}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {s.showTimes.map((showtime, i) => (
                    <Badge key={i} variant="default">
                      {Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(+showtime))}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  </Card>
})
