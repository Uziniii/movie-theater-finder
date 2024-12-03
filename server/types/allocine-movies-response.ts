export type AllocineMoviesResponse = {
  error: boolean
  message: any
  messageParam: any
  nextDate: any
  results: Array<{
    movie: {
      synopsis: string
      synopsis_json: {
        __typename: string
        body: Array<{
          type: string
          children: Array<{
            text: string
          }>
        }>
      }
      __typename: string
      internalId: number
      id: string
      poster: {
        __typename: string
        id: string
        internalId: number
        url: string
        path: string
      }
      title: string
      originalTitle: string
      type: string
      runtime: string
      genres: Array<{
        id: number
        translate: string
        tag: string
      }>
      languages: Array<string>
      data: {
        __typename: string
        seo: {
          __typename: string
          browsable: boolean
          title: any
        }
        productionYear: number
      }
      stats: {
        userRating: {
          score: number
          count: number
        }
        userReview: {
          count: number
        }
        pressReview?: {
          score: number
          count: number
        }
        metric: {
          hits: number
          sessions: number
        }
        wantToSeeCount: number
      }
      editorialReviews: Array<any>
      releases: Array<{
        __typename: string
        releaseDate?: {
          __typename: string
          date: string
          precision: string
        }
        name: string
        certificate?: {
          __typename: string
          code: string
          label: string
        }
        advice: any
        companyLimitation?: {
          id: string
          internalId: number
          name: string
        }
        releaseTags: {
          tagTypes: Array<string>
          tagFlags?: Array<string>
        }
        visaNumber?: string
      }>
      credits: Array<{
        person: {
          __typename: string
          internalId: number
          lastName: string
          firstName: string
          seo: {
            __typename: string
            browsable: boolean
          }
          picture: {
            __typename: string
            id: string
            internalId: number
            url: string
            path: string
          }
          appearanceStats: {
            __typename: string
            totalMovies: number
            totalSeries: number
          }
        }
        position: {
          __typename: string
          name: string
          department: string
        }
        rank: number
      }>
      cast: {
        __typename: string
        edges: Array<{
          node: {
            actor: Actor
            voiceActor: Actor
            originalVoiceActor: Actor
            rank: number
          }
        }>
        nodes: Array<{
          actor: Actor
          voiceActor: Actor
          originalVoiceActor: Actor
          rank: number
        }>
      }
      countries: Array<{
        __typename: string
        id: number
        name: string
        localizedName: string
      }>
      relatedTags: Array<{
        __typename: string
        internalId: number
        name: string
        scope?: string
        data: {
          seo: {
            browsable: boolean
            friendly: boolean
            scope: {
              userRating: {
                movie: {
                  title?: string
                  subTitle?: string
                  description?: string
                }
                series: {
                  title?: string
                  subTitle?: string
                  description?: string
                }
              }
              pressRating: {
                movie: {
                  title: any
                  subTitle: any
                  description: any
                }
                series: {
                  title: any
                  subTitle: any
                  description: any
                }
              }
              popularity: {
                movie: {
                  title: any
                  subTitle: any
                  description: any
                }
                series: {
                  title: any
                  subTitle: any
                  description: any
                }
              }
              ranking: {
                movie: {
                  title: any
                  subTitle: any
                  description: any
                }
                series: {
                  title: any
                  subTitle: any
                  description: any
                }
              }
            }
          }
        }
        tags: {
          list: Array<string>
        }
      }>
      flags: {
        hasDvdRelease: boolean
        hasNews: boolean
        hasOnlineProduct: boolean
        hasOnlineRelease: boolean
        hasPhysicalProduct: boolean
        hasPreview: boolean
        hasShowtime: boolean
        hasSoundtrack: boolean
        hasTheaterRelease: boolean
        hasTrivia: boolean
        hasAwards: boolean
        isLesIndes: boolean
        isClub300Approved: boolean
        hasClub300News: boolean
        isComingSoon: boolean
        isPlayingNow: boolean
        tvRelease: boolean
      }
      customFlags: {
        isPremiere: boolean
        weeklyOuting: boolean
      }
      synopsisFull: string
    }
    showtimes: {
      dubbed: Showtime
      original: Showtime
      local: Showtime
      multiple: Showtime
    }
  }>
  params: {
    experience: any
    projection: any
    comfort: any
    picture: any
    sound: any
    version: any
    page: number
  }
  facets: {
    facets: Array<{
      __typename: string
      name: string
      values: Array<{
        key: string
        translation?: {
          tag: string
          name: string
        }
        version?: string
      }>
    }>
  }
  pagination: {
    page: number
    totalPages: number
    itemsPerPage: number
    totalItems: number
  }
  data: {
    filters: Array<any>
  }
}

type Showtime = Array<{
  __typename: string
  internalId: number
  startsAt: string
  timeBeforeStart: string
  service?: Array<string>
  experience: any
  comfort: any
  projection: Array<string>
  picture: any
  sound: any
  tags: Array<string>
  diffusionVersion: string
  data: {
    __typename: string
    ticketing: Array<{
      __typename: string
      urls: Array<string>
      type: string
      provider: string
    }>
  }
  isPreview: boolean
  isWeeklyMovieOuting: boolean
}>

type Actor = {
  __typename: string
  internalId: number
  lastName: string
  firstName: string
  seo: {
    __typename: string
    browsable: boolean
  }
  picture?: {
    __typename: string
    id: string
    internalId: number
    url: string
    path: string
  }
  appearanceStats: {
    __typename: string
    totalMovies: number
    totalSeries: number
  }
}
