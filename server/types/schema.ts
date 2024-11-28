export type Cinema = {
    id: number;
    name: string;
    url: string;
}

export type Movie = {
    id: number;
    title: string;
    director: string;
    cast: string[];
    duration: number;
    poster: string;
    release: Date;
    synopsis: string;
    genres: string[];
}

export type Schedule = {
    id: number;
    cinemaId: number;
    movieId: number;
    showTime: Date;
}
