export interface AllocineMoviesResponse {
  error: boolean
  message: any
  messageParam: any
  nextDate: any
  results: Result[]
  params: Params
  facets: Facets
  pagination: Pagination
  data: any
}

 interface Result {
  movie: Movie
  showtimes: Showtimes
}

 interface Movie {
  synopsis: string
  synopsis_json: SynopsisJson
  __typename: string
  internalId: number
  id: string
  poster: Poster
  title: string
  originalTitle: string
  type: string
  runtime: string
  genres: Genre[]
  languages: string[]
  data: Data
  stats: Stats
  editorialReviews: any[]
  releases: Release[]
  credits: Credit[]
  cast: Cast
  countries: Country[]
  relatedTags: RelatedTag[]
  flags: Flags
  customFlags: CustomFlags
  synopsisFull: string
}

 interface SynopsisJson {
  __typename: string
  body: Body[]
}

 interface Body {
  type: string
  children: Children[]
}

 interface Children {
  text: string
  italic?: boolean
}

 interface Poster {
  __typename: string
  id: string
  internalId: number
  url: string
  path: string
}

 interface Genre {
  id: number
  translate: string
  tag: string
}

 interface Data {
  __typename: string
  seo: Seo
  productionYear: number
  rules: Rules
}

 interface Seo {
  __typename: string
  browsable: boolean
  title: any
}

 interface Rules {
  rating: Rating
}

 interface Rating {
  has_warning_message: boolean
  has_mandatory_review: boolean
}

 interface Stats {
  userRating: UserRating
  userReview: UserReview
  pressReview?: PressReview
  metric: Metric
  wantToSeeCount: number
}

 interface UserRating {
  score: number
  count: number
}

 interface UserReview {
  count: number
}

 interface PressReview {
  score: number
  count: number
}

 interface Metric {
  hits: number
  sessions: number
}

 interface Release {
  __typename: string
  releaseDate: ReleaseDate
  name: string
  certificate?: Certificate
  advice?: string
  companyLimitation?: CompanyLimitation
  releaseTags: ReleaseTags
  visaNumber?: string
}

 interface ReleaseDate {
  __typename: string
  date: string
  precision: string
}

 interface Certificate {
  __typename: string
  code: string
  label: string
}

 interface CompanyLimitation {
  id: string
  internalId: number
  name: string
}

 interface ReleaseTags {
  tagTypes: string[]
  tagFlags?: string[]
}

 interface Credit {
  person: Person
  position: Position
  rank: number
}

 interface Person {
  __typename: string
  internalId: number
  lastName: string
  firstName: string
  seo: Seo2
}

 interface Seo2 {
  __typename: string
  browsable: boolean
}

 interface Position {
  __typename: string
  name: string
  department: string
}

 interface Cast {
  __typename: string
  edges: Edge[]
  nodes: Node2[]
}

 interface Edge {
  node: Node
}

 interface Node {
  actor: Actor
  voiceActor: any
  originalVoiceActor: any
  rank: number
}

 interface Actor {
  __typename: string
  internalId: number
  lastName: string
  firstName?: string
  seo: Seo3
}

 interface Seo3 {
  __typename: string
  browsable: boolean
}

 interface Node2 {
  actor: Actor2
  voiceActor: any
  originalVoiceActor: any
  rank: number
}

 interface Actor2 {
  __typename: string
  internalId: number
  lastName: string
  firstName?: string
  seo: Seo4
}

 interface Seo4 {
  __typename: string
  browsable: boolean
}

 interface Country {
  __typename: string
  id: number
  name: string
  localizedName: string
}

 interface RelatedTag {
  __typename: string
  internalId: number
  name: string
  scope?: string
  data: Data2
  tags: Tags
}

 interface Data2 {
  seo: Seo5
}

 interface Seo5 {
  browsable: boolean
  friendly: boolean
  scope: Scope
}

 interface Scope {
  userRating: UserRating2
  pressRating: PressRating
  popularity: Popularity
  ranking: Ranking
}

 interface UserRating2 {
  movie: Movie2
  series: Series
}

 interface Movie2 {
  title?: string
  subTitle?: string
  description?: string
}

 interface Series {
  title: any
  subTitle: any
  description: any
}

 interface PressRating {
  movie: Movie3
  series: Series2
}

 interface Movie3 {
  title: any
  subTitle: any
  description: any
}

 interface Series2 {
  title: any
  subTitle: any
  description: any
}

 interface Popularity {
  movie: Movie4
  series: Series3
}

 interface Movie4 {
  title: any
  subTitle: any
  description: any
}

 interface Series3 {
  title: any
  subTitle: any
  description: any
}

 interface Ranking {
  movie: Movie5
  series: Series4
}

 interface Movie5 {
  title: any
  subTitle: any
  description: any
}

 interface Series4 {
  title: any
  subTitle: any
  description: any
}

 interface Tags {
  list: string[]
}

 interface Flags {
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
  isIncontestable: boolean
  isClubApproved: any
  hasClubNews: any
  isComingSoon: boolean
  isPlayingNow: boolean
  tvRelease: boolean
}

 interface CustomFlags {
  isPremiere: boolean
  weeklyOuting: boolean
}

 interface Showtimes {
  original: Original[]
  original_st: any[]
  original_st_sme: any[]
  multiple: Multiple[]
  multiple_st: any[]
  multiple_st_sme: any[]
}

 interface Original {
  __typename: string
  internalId: number
  startsAt: string
  timeBeforeStart: string
  service: any
  experience: any
  comfort: any
  projection: string[]
  picture: any
  sound: any
  tags: string[]
  diffusionVersion: string
  data: Data3
  isPreview: boolean
  isWeeklyMovieOuting: boolean
}

 interface Data3 {
  __typename: string
  ticketing: Ticketing[]
}

 interface Ticketing {
  __typename: string
  urls: string[]
  type: string
  provider: string
}

 interface Multiple {
  __typename: string
  internalId: number
  startsAt: string
  timeBeforeStart: string
  service: any
  experience: any
  comfort: any
  projection: string[]
  picture: any
  sound: any
  tags: string[]
  diffusionVersion: string
  data: Data4
  isPreview: boolean
  isWeeklyMovieOuting: boolean
}

 interface Data4 {
  __typename: string
  ticketing: Ticketing2[]
}

 interface Ticketing2 {
  __typename: string
  urls: string[]
  type: string
  provider: string
}

 interface Params {
  experience: any
  projection: any
  comfort: any
  picture: any
  sound: any
  version: any
  page: number
}

 interface Facets {
  facets: Facet[]
}

 interface Facet {
  __typename: string
  name: string
  values: Value[]
}

 interface Value {
  key: string
  translation?: Translation
  version?: string
}

 interface Translation {
  tag: string
  name: string
}

 interface Pagination {
  page: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}
