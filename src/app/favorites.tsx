import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { MovieDetailsResponseBody } from "../types/movieService.type";
import favoritesService from "../services/favorites.service";
import { getMovieDetails } from "../services/movie.service";
import { spacing } from "../theme/spacing";
import MovieListItem from "../components/MovieListItem";
import { useFocusEffect } from "expo-router";
import Animated, { LinearTransition } from "react-native-reanimated";

const Favorites = () => {
    const [favorites, setFavorites] = useState<
        MovieDetailsResponseBody[] | null
    >(null);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const getFavorites = async () => {
                const favoriteIds = await favoritesService.getFavoriteMovies();

                /**
                 * if the favorites list would be fetched from an API, and the list could be changed from somewhere else (eg. web app or another phone),
                 * only checking lengths between focuses wouldn't be enough. Because in between focus changes in this particular app session, other clients might have added and/or removed some favorites.
                 * If that happens, lengths will be same but data won't be! But for this app, there is no API and between focuses, only favorites can be removed and/or re-added.
                 * In both cases, final length will either be same (no need to fetch again), or be less (fetch again because lengths are different)
                 */
                if (favoriteIds.length === favorites?.length) return;

                const favoritesData: MovieDetailsResponseBody[] = [];

                for await (const favoriteId of favoriteIds) {
                    try {
                        const detailsResponse = await getMovieDetails(
                            favoriteId
                        );
                        favoritesData.push(detailsResponse);
                    } catch (err) {
                        // gracefully handling the errors and showing only the success ones would be the proper way
                        console.log(
                            "Error when getting a favorite movie details: ",
                            err
                        );
                        continue;
                    }
                }

                if (isActive) {
                    setFavorites(favoritesData);
                }
            };

            getFavorites();

            return () => {
                isActive = false;
            };
        }, [favorites])
    );

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            {favorites && (
                <Animated.FlatList
                    contentContainerStyle={{
                        gap: spacing.medium,
                        paddingHorizontal: spacing.large,
                        paddingVertical: spacing.medium,
                    }}
                    itemLayoutAnimation={LinearTransition}
                    data={favorites}
                    ListEmptyComponent={
                        <View
                            style={{
                                gap: spacing.medium,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                }}
                            >
                                You don't have any favorite movies/series
                                currently
                            </Text>
                            <Text
                                style={{
                                    color: "gray",
                                }}
                            >
                                You can add new favorites from the movie/series
                                list details.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <MovieListItem
                            data={{
                                imdbID: item.imdbID,
                                Poster: item.Poster,
                                Title: item.Title,
                                Type: item.Type,
                                Year: item.Year,
                            }}
                        />
                    )}
                    keyExtractor={(item) => item.imdbID}
                />
            )}
        </View>
    );
};

export default Favorites;
