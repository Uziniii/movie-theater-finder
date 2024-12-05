import { client } from "../client"

export const MOVIES_PER_PAGE = 20

export class Movies {
  async getCount(date: Date, search: string | undefined) {
    let count = await client.$queryRaw<number>`
      SELECT COUNT(DISTINCT m.id) as count 
      FROM movies m 
      LEFT JOIN schedules s ON m.id = s.movieId 
      WHERE DATE(s.showTime) = ${Intl.DateTimeFormat("en-CA").format(date)}
    `

    return count
  }

  async get(date: Date, page: number, search: string | undefined) {
    let m = await client.movies.findMany({
      where: {
        schedules: {
          some: {
            showTime: {
              gt: date
            }
          }
        },
        title: {
          contains: search
        }
      },
      include: {
        schedules: false
      },
      orderBy: {
        schedules: {
          _count: "desc"
        }
      },
      take: MOVIES_PER_PAGE,
      skip: page * MOVIES_PER_PAGE
    })

    return m
  }
}
