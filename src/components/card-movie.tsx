import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import type { Movie, Schedule } from "@/api"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Separator } from "./ui/separator"

const versionToText = {
  vo: "- VO",
  vf: "- VF",
  dub: "- Sous-titré",
  null: ""
}

type Props = {
  movie: Movie
  schedules: Schedule[]
}

export function CardMovie({ movie, schedules }: Props) {
  return <Card className="overflow-hidden">
    <article className="md:flex">
      <div className="md:w-1/3 p-4">
        <img
          src={movie.poster === "" ? "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png" : movie.poster.replace("r_200_283", "r_800_1132")}
          alt={`${movie.title} Poster`}
          width={800}
          height={1132}
          className="w-full h-auto object-cover rounded-md"
        />
      </div>
      <div className="md:w-2/3 p-6 border-l">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl mb-2">{movie.title}</CardTitle>
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
          <Accordion type="single" collapsible className="w-full">
            {schedules.map((s, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{s.cinema} {versionToText[s.version ?? "null"]}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {s.showTimes.split(",").map((showtime, i) => (
                      <Badge key={i} variant="default">
                        {Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(+showtime))}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </div>
    </article>
  </Card>
}