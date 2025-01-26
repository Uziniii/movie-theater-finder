import { client } from "../client"

export const MOVIES_PER_PAGE = 20

export class Movies {
  async getCount(date: Date, search: string | undefined) {
    const dateEnd = new Date(date)
    dateEnd.setDate(dateEnd.getDate() + 1)
    dateEnd.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    const count = await client.movies.count({
      where: {
        schedules: {
          some: {
            showTime: {
              gte: date,
              lte: dateEnd
            }
          }
        },
        title: {
          contains: search
        }
      },
    })

    return count
  }

  async get(date: Date, page: number, search: string | undefined) {
    const dateEnd = new Date(date)
    dateEnd.setDate(dateEnd.getDate() + 1)
    dateEnd.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    let m = await client.movies.findMany({
      where: {
        schedules: {
          some: {
            showTime: {
              gte: date,
              lte: dateEnd
            }
          }
        },
        OR: search ? [
          {
            originalTitle: {
              contains: `%${search}%`,
            },
          },
          {
            title: {
              contains: `%${search}%`,
            }
          }
        ] : undefined
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
