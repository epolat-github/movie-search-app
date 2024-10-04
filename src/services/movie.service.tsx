import {
    MovieListRequestBody,
    MovieListResponseBody,
} from "../types/movieService.type";

const API_URL = process.env.EXPO_PUBLIC_API_URL as string;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY as string;

export const getMovieList = async (body: MovieListRequestBody) => {
    const { s, r = "json", page, type, y } = body;

    console.log("get movie list");

    const searchParams = new URLSearchParams({
        s,
        r,
    });

    if (page) searchParams.append("page", page.toString());
    if (type) searchParams.append("type", type);
    if (y) searchParams.append("y", y);

    const url = `${API_URL}/?${searchParams.toString()}`;

    const response = await fetch(url, {
        headers: {
            "x-rapidapi-key": API_KEY,
        },
    });

    if (!response.ok) {
        return Promise.reject({
            message: "Get movie list error",
        });
    }

    const data = await response.json();

    return data as MovieListResponseBody;
};

export const getMovieDetails = async (imdbId: string) => {
    console.log("get movie details");

    const searchParams = new URLSearchParams({
        i: imdbId,
        r: "json",
    });

    const url = `${API_URL}/?${searchParams.toString()}`;

    const response = await fetch(url, {
        headers: {
            "x-rapidapi-key": API_KEY,
        },
    });

    if (!response.ok) {
        return Promise.reject({
            message: "Get movie details error",
        });
    }

    const data = await response.json();

    return data;
};
