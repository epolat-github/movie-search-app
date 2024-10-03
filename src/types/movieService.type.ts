export type MovieType = "series" | "movie" | "episode";

export interface MovieListRequestBody {
    s: string; // title
    r: "json" | "xml"; // response type
    page?: number;
    type?: MovieType;
    y?: number; // year
}

export interface MovieListSingleItem {
    Poster: string;
    Title: string;
    Type: MovieType;
    Year: string;
    imdbID: string;
}

export interface MovieListResponseBody {
    Response: "True" | "False";
    totalResults: string; // it's a stringified number
    Search: MovieListSingleItem[];
}

export interface MovieDetailsRequestBody {
    i: string; // IMDB ID
    r: "json" | "xml"; // response type
}

export interface Rating {
    Source: string;
    Value: string;
}

export interface MovieDetailsResponseBody {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
}