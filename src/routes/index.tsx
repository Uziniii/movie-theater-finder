import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { fetchMovies } from '@/api'
import { CardMovie } from '@/components/card-movie'
import z from "zod"
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from "use-debounce";
import { SearchIcon } from 'lucide-react'
import { Pagination } from '@/components/pagination'

const moviesSearchSchema = z.object({
  date: z.string().optional(),
  page: z.number().min(0).optional(),
  search: z.string().optional()
})

export type MoviesSearch = z.infer<typeof moviesSearchSchema>

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: moviesSearchSchema
})

function HomeComponent() {
  const search = Route.useSearch() as MoviesSearch
  const navigate = useNavigate({ from: Route.fullPath })

  const dates = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      let today = new Date(Date.now())
      today.setDate(today.getDate() + i)

      let [day, date] = Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(today).split(" ")
      let variant: "link" | "default" | "destructive" | "outline" | "outlineReducedOpacity" | "secondary" | "ghost" | null | undefined = "outlineReducedOpacity"
      const selectedDate = new Date(search.date ?? "")

      if ((i === 0 && !search.date) || (search.date && selectedDate.getDate() === today.getDate() && selectedDate.getMonth() === today.getMonth())) {
        variant = "default"
      }

      return <Link key={i} className='w-full' to="/" search={{ ...search, date: Intl.DateTimeFormat("en-CA").format(today).toString() }}>
        <Button className='w-full uppercase font-bold flex gap-0 max-md:px-1 max-md:py-1' variant={variant}>
          <div className='text-sm max-sm:hidden mr-1'>{day.slice(0, 3)}.</div>
          <div className='text-sm max-sm:text-sm'>{date}</div>
        </Button>
      </Link>
    })
  }, [search])

  const [searchInput, setSearchInput] = useState(search.search ?? "")
  const [debouncedSearch] = useDebounce(searchInput, 500);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)

  useEffect(() => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: debouncedSearch || undefined,
      })
    })
  }, [debouncedSearch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [search])

  const { data, isSuccess } = useQuery({
    queryKey: ["movies", search.date, search.page, search.search],
    queryFn: fetchMovies,
    enabled: true,
    refetchOnWindowFocus: false
  })

  return <>
    <header className='z-50 fixed w-full border-b backdrop-blur-xl bg-black/50'>
      <div className='flex max-md:gap-4 gap-12 justify-between px-4 p-2 container'>
        <Link to='/'>
          <h1 className="scroll-m-20 font-extrabold tracking-tight">Films</h1>
        </Link>
        <div className="items-center flex-grow flex flex-row gap-3">
          <Input className='h-10 bg-black/50' placeholder="Rechercher des films" value={searchInput} onChange={handleSearchInput} />
          <Button aria-label='search' className='h-10'>
            <SearchIcon />
          </Button>
        </div>
      </div>
      <Separator />
      <div className='px-4 p-2 container'>
        <div className='flex gap-2'>
          {dates}
        </div>
      </div>
      {/* <Separator />
      <div className='px-4 p-2 container'>
        {isSuccess &&
          <Pagination search={search} maxPage={data.maxPage}/>
        }
      </div> */}
    </header>
    <main className="flex min-h-screen flex-col items-center text-white">
      <div className="container flex flex-col gap-12 px-4 pt-32 pb-12">
        <div className="flex flex-col gap-4 md:gap-8">
          {isSuccess
            ? data.movies.map(m => (
              <CardMovie
                movie={m}
                key={m.id}
              />
            ))
            : [...Array(10)].map((_, i) => <Skeleton key={i} className='h-[500px]' />)
          }
        </div>
        {isSuccess &&
          <Pagination search={search} maxPage={data.maxPage}/>
        }
      </div>
    </main>
  </>
}
