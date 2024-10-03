import { useState } from "react";
import { FlatList, View } from "react-native";
import { getMovieList } from "../services";
import { MovieListResponseBody } from "../types/movieService.type";
import SearchBar from "../components/SearchBar";
import { spacing } from "../theme/spacing";
import MovieListItem from "../components/MovieListItem";

const Index = () => {
    const [movieListResult, setMovieListResult] =
        useState<MovieListResponseBody>();

    const getMovieListHandler = async (movieName: string) => {
        try {
            if (movieName.trim() === "") return;

            const movieListResult = await getMovieList({
                s: movieName,
                r: "json",
            });

            setMovieListResult(movieListResult);
        } catch (err) {
            // TODO show proper feedback with maybe snackbar?
            console.log(err);
            alert("Error!");
        }
    };

    return (
        <View
            style={{
                flex: 1,
                gap: spacing.large,
            }}
        >
            <SearchBar onSearch={getMovieListHandler} />
            <FlatList
                contentInsetAdjustmentBehavior="always"
                contentContainerStyle={{
                    gap: spacing.medium,
                }}
                data={movieListResult?.Search}
                renderItem={({ item }) => <MovieListItem data={item} />}
                keyExtractor={(item) => item.imdbID}
            />
        </View>
    );
};

export default Index;
