import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { getMovieList } from "../services";
import { MovieListSingleItem } from "../types/movieService.type";
import SearchBar from "../components/SearchBar";
import { spacing } from "../theme/spacing";
import MovieListItem from "../components/MovieListItem";

const Index = () => {
    const flatListRef = useRef<FlatList | null>(null);

    const [movieList, setMovieList] = useState<MovieListSingleItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState<number | null>(null);

    useEffect(() => {
        getMovieListHandler(searchValue, currentPage);
    }, [searchValue, currentPage]);

    const getMovieListHandler = async (movieName: string, page = 1) => {
        try {
            if (movieName.trim() === "") return;

            setIsLoading(true);

            const movieListResult = await getMovieList({
                s: movieName,
                r: "json",
                page,
            });

            if (page === 1) {
                setMovieList(movieListResult.Search);
            } else {
                setMovieList((prev) => {
                    return [...prev, ...movieListResult.Search];
                });
            }

            setTotalPageCount(
                Math.ceil(Number(movieListResult.totalResults) / 10)
            );
        } catch (err) {
            // TODO show proper feedback with maybe snackbar?
            console.log(err);
            alert("Error!");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchNextPage = async () => {
        if (!isLoading) {
            setCurrentPage((prev) => {
                if (prev === totalPageCount) return prev;
                return prev + 1;
            });
        }
    };

    const onSearchValueUpdate = (newValue: string) => {
        if (newValue.trim() === "") return;

        // reset pagination
        setCurrentPage(1);
        setSearchValue(newValue);
        setMovieList([]);

        // scroll to top
        flatListRef?.current?.scrollToOffset({
            animated: false,
            offset: 0,
        });
    };

    return (
        <View
            style={{
                flex: 1,
                gap: spacing.large,
            }}
        >
            <SearchBar onSearch={onSearchValueUpdate} />
            <FlatList
                ref={flatListRef}
                contentInsetAdjustmentBehavior="always"
                contentContainerStyle={{
                    gap: spacing.medium,
                }}
                data={movieList}
                renderItem={({ item }) => <MovieListItem data={item} />}
                keyExtractor={(item) => item.imdbID}
                initialNumToRender={3}
                onEndReachedThreshold={0.001}
                ListFooterComponent={() => isLoading && <ActivityIndicator />}
                onEndReached={fetchNextPage}
                keyboardDismissMode="on-drag"
                // bounces={false}  // can be used in case onEndReached fired multiple times because of the bounce on IOS
            />
        </View>
    );
};

export default Index;
