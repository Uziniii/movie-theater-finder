import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import type { Movie, Schedule } from "@/api"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Separator } from "./ui/separator"

type Props = {
  movie: Movie
  schedules: Schedule[]
}

export function CardMovie({ movie, schedules }: Props) {
  return <Card className="overflow-hidden">
    <div className="md:flex">
      <div className="md:w-1/3 p-4">
        <img
          src={movie.poster.replace("r_200_283", "r_800_1132")}
          alt={`${movie.title} Poster`}
          width={800}
          height={1132}
          className="w-full h-auto object-cover rounded-md"
        />
      </div>
      <div className="md:w-2/3 p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl mb-2">{movie.title}</CardTitle>
          <CardDescription>{movie.synopsis}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{movie.director}</Badge>
            <Badge>{Intl.DateTimeFormat("fr-FR").format(new Date(movie.release))}</Badge>
            {movie.genres.map((m, i) => (
              <Badge variant={"secondary"} key={i}>{m}</Badge>
            ))}
          </div>
          {movie.cast[0] !== "" && 
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Cast:</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.cast.map((m, i) => (
                  <Badge key={i}>{m}</Badge>
                ))}
              </div>
            </div>
          }
          <Separator className="my-4" />
          <Accordion type="single" collapsible className="w-full">
            {schedules.map((s, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{s.cinema}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {s.showTimes.split(",").map((showtime, i) => (
                      <Badge key={i} variant="default">
                        {Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(showtime))}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </div>
    </div>
  </Card>
}