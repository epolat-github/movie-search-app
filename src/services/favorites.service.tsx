import asyncStorage from "../utils/asyncStorage";

const addFavoriteMovie = async (movieId: string) => {
    try {
        const favorites = await getFavoriteMovies();

        // latest added should be listed as the first in the screen
        const updatedFavorites = [movieId, ...favorites];
        await asyncStorage.storeData("favorites", updatedFavorites);
    } catch (error) {
        console.error("Error when adding favorite movie:", error);
    }
};

const getFavoriteMovies = async (): Promise<string[]> => {
    try {
        const favorites = await asyncStorage.getData("favorites");
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error("Error when getting favorite movies:", error);
        return [];
    }
};

const removeFavoriteMovie = async (movieId: string) => {
    try {
        const favorites = await getFavoriteMovies();
        const updatedFavorites = favorites.filter((id) => id !== movieId);
        await asyncStorage.storeData("favorites", updatedFavorites);
    } catch (error) {
        console.error("Error when removing a favorite:", error);
    }
};

const isMovieFavorite = async (movieId: string): Promise<boolean> => {
    try {
        const favorites = await getFavoriteMovies();
        return favorites.includes(movieId);
    } catch (error) {
        console.error("Error when checking a favorite exists:", error);
        return false;
    }
};

export default {
    isMovieFavorite,
    removeFavoriteMovie,
    getFavoriteMovies,
    addFavoriteMovie,
};
