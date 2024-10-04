import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getMovieList } from "../services/movie.service";
import { MovieListSingleItem } from "../types/movieService.type";
import SearchBar from "../components/SearchBar";
import { spacing } from "../theme/spacing";
import MovieListItem from "../components/MovieListItem";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { colors } from "../theme/colors";
import { useSnackbarContext } from "../context/SnackbarContext";
import FilterBottomSheet, { FilterBody } from "../components/FilterBottomSheet";

const Index = () => {
    const flatListRef = useRef<FlatList | null>(null);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const { showSnackbar } = useSnackbarContext();

    const [movieList, setMovieList] = useState<MovieListSingleItem[] | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPageCount, setTotalPageCount] = useState<number | null>(null);

    const [filters, setFilters] = useState<FilterBody>({
        endYear: "",
        startYear: "",
    });

    useEffect(() => {
        getMovieListHandler(searchValue, currentPage);
    }, [searchValue, currentPage]);

    const getMovieListHandler = async (movieName: string, page = 1) => {
        try {
            if (movieName.trim() === "") return;

            setIsLoading(true);

            const { startYear, endYear, type } = filters;

            let yearSearch = "";

            if (startYear) yearSearch = startYear.toString();
            if (endYear) yearSearch = `${yearSearch}-${endYear}`;

            const movieListResult = await getMovieList({
                s: movieName,
                r: "json",
                page,
                type,
                y: yearSearch === "" ? undefined : yearSearch,
            });

            if (movieListResult.Response === "False") {
                showSnackbar(movieListResult.Error, {
                    variant: "error",
                });
                console.log(movieListResult.Error);
                return;
            }

            if (page === 1) {
                setMovieList(movieListResult.Search);
            } else {
                setMovieList((prev) => {
                    if (prev === null) return movieListResult.Search;
                    return [...prev, ...movieListResult.Search];
                });
            }

            setTotalPageCount(
                Math.ceil(Number(movieListResult.totalResults) / 10)
            );
        } catch (err: any) {
            showSnackbar(
                err?.message ||
                    "Something went wrong when searching for a value.",
                {
                    variant: "error",
                    duration: 1500,
                }
            );
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchNextPage = async () => {
        // when flatlist data is an empty array, end threshold is detected as "hit" and infinite loop occurs
        // only if the data is not loading and there are actual data, next page can be fetched
        if (!isLoading && movieList && movieList?.length !== 0) {
            setCurrentPage((prev) => {
                if (prev === totalPageCount) return prev;
                return prev + 1;
            });
        }
    };

    const resetListState = () => {
        // reset pagination
        setCurrentPage(1);
        // setMovieList([]);

        // scroll to top
        flatListRef?.current?.scrollToOffset({
            animated: false,
            offset: 0,
        });
    };

    // list position and pagination should be resetted when the input changes
    // if the value is an empty string (when search input is cleared), search value should be updated but list shouldn't be resetted
    const onSearchValueUpdate = (newValue: string) => {
        if (newValue.trim() !== "") {
            resetListState();
        }

        setSearchValue(newValue);
    };

    const openFilterSheet = () => {
        bottomSheetRef.current?.present();
    };

    const closeFilterSheet = () => {
        bottomSheetRef.current?.dismiss();
    };

    const onFilterHandler = async () => {
        resetListState();

        await getMovieListHandler(searchValue, 1);
        closeFilterSheet();
    };

    return (
        <View style={styles.mainContainer}>
            <SearchBar
                onSearch={onSearchValueUpdate}
                onFilterPress={openFilterSheet}
            />
            {!movieList && (
                <View style={styles.initialInformationContainer}>
                    <Text style={{ color: "#fff" }}>
                        You can search a movie, series or an episode from the
                        input field above. Next to it, there is a filtering
                        button that can be used to filter by years and types.
                    </Text>
                </View>
            )}
            {movieList && (
                <FlatList
                    ref={flatListRef}
                    contentInsetAdjustmentBehavior="always"
                    contentContainerStyle={styles.flatlistContentContainer}
                    ListEmptyComponent={
                        <Text>
                            Result not found. Please search by a different
                            title.
                        </Text>
                    }
                    data={movieList}
                    renderItem={({ item }) => <MovieListItem data={item} />}
                    keyExtractor={(item) => item.imdbID}
                    initialNumToRender={3}
                    onEndReachedThreshold={0.001}
                    ListFooterComponent={() =>
                        isLoading && <ActivityIndicator />
                    }
                    onEndReached={fetchNextPage}
                    keyboardDismissMode="on-drag"
                    // bounces={false}  // can be used in case onEndReached fired multiple times because of the bounce on IOS
                />
            )}
            <FilterBottomSheet
                ref={bottomSheetRef}
                onApprove={onFilterHandler}
                filters={filters}
                setFilters={setFilters}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        gap: spacing.large,
    },
    initialInformationContainer: {
        paddingHorizontal: spacing.large,
        backgroundColor: colors.secondary,
        paddingVertical: spacing.medium,
        marginHorizontal: spacing.small,
        borderRadius: spacing.small,
    },
    flatlistContentContainer: {
        gap: spacing.medium,
        paddingHorizontal: spacing.large,
    },
});

export default Index;
