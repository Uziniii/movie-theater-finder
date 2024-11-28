import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { fetchMovies } from '@/api'
import { CardMovie } from '@/components/card-movie'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import z from "zod"
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

const searchParams = z.object({
  date: z.string().optional().transform(x => x ? new Date(x) : undefined)
})

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: zodSearchValidator(searchParams)
})

function HomeComponent() {
  let search = Route.useSearch()

  const { data, isSuccess } = useQuery({
    queryKey: ["movies", search.date],
    queryFn: fetchMovies,
  })

  return (
    <main className="flex min-h-screen flex-col items-center text-white">
      <div className="container flex flex-col gap-12 px-4 py-16">
        <div className="flex flex-col">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-4">Films</h1>
          <div className="flex flex-row gap-3">
            <Input placeholder="Search for films" />
            <Button>Search</Button>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-3 md h-24">
          {[...Array(7)].map((_, i) => {
            let today = new Date(Date.now())
            today.setDate(today.getDate() + i)

            let [day, date, month] = Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(today).split(" ")

            let variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined = "outline"

            if (i === 0 && !search.date) {
              variant = "default"
            } else if (search.date && search.date.getDate() === today.getDate() && search.date.getMonth() === today.getMonth()) {
              variant = "default"
            }

            return (
              <Link key={i} className='w-full h-full' to="/" search={{ date: today.toJSON() }}>
                <Button className='w-full h-full uppercase font-bold flex flex-col gap-0 max-md:px-1 max-md:py-1' variant={variant}>
                  <div className='text-xs'>{day.slice(0, 3)}.</div>
                  <div className='md:text-4xl text-2xl'>{date}</div>
                  <div className='text-xs'>{month.slice(0, 3)}.</div>
                </Button>
              </Link>
            )
          })}
        </div>
        <div className="flex flex-col gap-4 md:gap-8">
          {isSuccess
            ? data.movies.map(m => (
              <CardMovie 
                movie={m}
                schedules={data.schedules.filter(s => s.movieId === m.id)}
                key={m.id}
              />
            ))
            : [...Array(15)].map((_, i) => <Skeleton key={i} className='h-[500px]'/>)
          }
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  )
}
