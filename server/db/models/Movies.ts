import { client } from "../client"

export const MOVIES_PER_PAGE = 20

export class Movies {
  async getCount(date: Date, search: string | undefined) {
    const count = await client.movies.count({
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
    })
    console.log(count);


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
        schedules: {
          where: {
            showTime: {
              gt: date
            }
          },
        }
      },
      orderBy: {
        schedules: {
          _count: "desc"
        }
      },
      take: MOVIES_PER_PAGE,
      skip: page * MOVIES_PER_PAGE
    })
    console.dir(m, {
      depth: Infinity
    });

    //     let a = await client.$queryRaw`
    // SELECT
    //   movies.id, movies.title, movies.director, movies.cast, movies.duration, movies.poster, movies.release, movies.synopsis, movies.genres
    // FROM movies 
    // LEFT JOIN (
    //   SELECT schedules.movieId, COUNT(*) AS orderby_aggregator
    //   FROM schedules WHERE 1=1 
    //   GROUP BY schedules.movieId
    // ) AS orderby_1_schedules ON (movies.id = orderby_1_schedules.movieId) 
    // WHERE movies.id IN (
    //   SELECT t1.movieId 
    //   FROM schedules AS t1 
    //   WHERE (
    //     t1.showTime > ${date} AND t1.movieId IS NOT NULL
    //   )
    // ) 
    // ORDER BY COALESCE(orderby_1_schedules.orderby_aggregator, 100) DESC
    // LIMIT ${MOVIES_PER_PAGE}
    // OFFSET ${page * MOVIES_PER_PAGE}
    // `
    //     console.log(a);


    return m
  }
}
