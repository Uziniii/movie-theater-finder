import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { fetchMovies } from '@/api'
import { CardMovie } from '@/components/card-movie'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import z from "zod"
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { useDebounce } from "use-debounce";

const searchParams = z.object({
  date: z.string().optional(),
  page: z.number().min(0).optional(),
  search: z.string().optional()
})

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: zodSearchValidator(searchParams)
})

function HomeComponent() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  
  const [searchInput, setSearchInput] = useState(search.search ?? "")
  const [debouncedSearch] = useDebounce(searchInput, 500);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)

  useEffect(() => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: debouncedSearch,
      })
    })
  }, [debouncedSearch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [search])

  const { data, isSuccess } = useQuery({
    queryKey: ["movies", search.date, search.page, search.search],
    queryFn: fetchMovies,
    enabled: true
  })

  return <>
    <header className='fixed w-full border-b backdrop-blur-xl bg-black/50'>
      <div className='flex gap-12 justify-between px-4 p-2 container'>
        <Link to='/'>
          <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">Films</h1>
        </Link>
        <div className="items-center flex-grow flex flex-row gap-3">
          <Input className='h-8 bg-black/50' placeholder="Rechercher des films" value={searchInput} onChange={handleSearchInput} />
          <Button className='h-8'>Rechercher</Button>
        </div>
      </div>
      <Separator />
      <div className='px-4 p-2 container'>
        <div className='flex gap-2'>
          {[...Array(7)].map((_, i) => {
            let today = new Date(Date.now())
            today.setDate(today.getDate() + i)

            let [day, date] = Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(today).split(" ")
            let variant: "link" | "default" | "destructive" | "outline" | "outlineReducedOpacity" | "secondary" | "ghost" | null | undefined = "outlineReducedOpacity"
            const selectedDate = new Date(search.date)

            if ((i === 0 && !search.date) || (search.date && selectedDate.getDate() === today.getDate() && selectedDate.getMonth() === today.getMonth())) {
              variant = "default"
            }

            return <Link key={i} className='w-full' to="/" search={{ date: Intl.DateTimeFormat("en-CA").format(today).toString() }}>
              <Button className='w-full uppercase font-bold flex gap-0 max-md:px-1 max-md:py-1' variant={variant}>
                <div className='text-xs max-sm:hidden mr-1'>{day.slice(0, 3)}.</div>
                <div className='text-xs max-sm:text-sm'>{date}</div>
              </Button>
            </Link>
          })}
        </div>
      </div>
    </header>
    <main className="flex min-h-screen flex-col items-center text-white">
      <div className="container flex flex-col gap-12 px-4 pt-32 pb-12">
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
              <PaginationPrevious to="/" search={{ date: search.date, page: search.page === undefined ? 0 : search.page - 1 }}/>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext to="/" search={{ date: search.date, page: search.page === undefined ? 1 : search.page + 1 }}/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  </>
}
