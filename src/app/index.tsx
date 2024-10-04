import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getMovieList } from "../services";
import { MovieListSingleItem, MovieType } from "../types/movieService.type";
import SearchBar from "../components/SearchBar";
import { spacing } from "../theme/spacing";
import MovieListItem from "../components/MovieListItem";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { colors } from "../theme/colors";
import Button from "../components/Button";
import { useSnackbarContext } from "../context/SnackbarContext";

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

    // states for filtering
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [type, setType] = useState<MovieType>();

    useEffect(() => {
        getMovieListHandler(searchValue, currentPage);
    }, [searchValue, currentPage]);

    const getMovieListHandler = async (movieName: string, page = 1) => {
        try {
            if (movieName.trim() === "") return;

            setIsLoading(true);

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

    const snapPoints = useMemo(() => ["50%", "80%"], []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const onFilterTypeSelect = (selectedType: MovieType) => {
        setType((prev) => {
            if (prev === selectedType) {
                return undefined;
            }

            return selectedType;
        });
    };

    const onFilterHandler = async () => {
        resetListState();

        await getMovieListHandler(searchValue, 1);
        closeFilterSheet();
    };

    return (
        <View
            style={{
                flex: 1,
                gap: spacing.large,
            }}
        >
            <SearchBar
                onSearch={onSearchValueUpdate}
                onFilterPress={openFilterSheet}
            />
            {!movieList && (
                <View
                    style={{
                        paddingHorizontal: spacing.large,
                        backgroundColor: colors.secondary,
                        paddingVertical: spacing.medium,
                        marginHorizontal: spacing.small,
                        borderRadius: spacing.small,
                    }}
                >
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
                    contentContainerStyle={{
                        gap: spacing.medium,
                        paddingHorizontal: spacing.large,
                    }}
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
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                keyboardBehavior="extend"
                keyboardBlurBehavior="restore"
                index={0}
            >
                <BottomSheetView
                    style={{
                        flex: 1,
                        paddingHorizontal: spacing.medium,
                        gap: spacing.medium,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                        }}
                    >
                        Filter Your Search
                    </Text>

                    <View>
                        <Text style={{ color: "gray" }}>
                            Movies only use a start year
                        </Text>
                        <BottomSheetTextInput
                            style={styles.filterTextInput}
                            placeholder="Start year to search"
                            value={startYear}
                            onChangeText={setStartYear}
                            keyboardType="numeric"
                            maxLength={4}
                        />
                        <Text style={{ color: "gray" }}>
                            Series use an end year too
                        </Text>
                        <BottomSheetTextInput
                            style={styles.filterTextInput}
                            placeholder="End year to search"
                            value={endYear}
                            onChangeText={setEndYear}
                            keyboardType="numeric"
                            maxLength={4}
                        />
                    </View>

                    <View
                        style={{
                            gap: spacing.small,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            Filter by type
                        </Text>
                        <Text style={{ color: "gray" }}>
                            Select a type again to disable the filter
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: spacing.tiny,
                            }}
                        >
                            {(["series", "movie", "episode"] as const).map(
                                (typeName) => (
                                    <Pressable
                                        key={typeName}
                                        style={{
                                            flex: 1,
                                            backgroundColor:
                                                typeName === type
                                                    ? colors.secondary
                                                    : colors.gray,
                                            borderRadius: spacing.tiny,
                                            padding: spacing.small,
                                        }}
                                        onPress={() =>
                                            onFilterTypeSelect(typeName)
                                        }
                                    >
                                        <Text
                                            style={{
                                                textTransform: "capitalize",
                                                textAlign: "center",
                                                color:
                                                    typeName === type
                                                        ? "#fff"
                                                        : "#000",
                                            }}
                                        >
                                            {typeName}
                                        </Text>
                                    </Pressable>
                                )
                            )}
                        </View>
                    </View>

                    <Button
                        text="Filter Search"
                        containerStyle={{
                            marginTop: spacing.small,
                        }}
                        onPress={onFilterHandler}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};

const styles = StyleSheet.create({
    filterTextInput: {
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: colors.gray,
    },
});

export default Index;
