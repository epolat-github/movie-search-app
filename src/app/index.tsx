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

const Index = () => {
    const flatListRef = useRef<FlatList | null>(null);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const [movieList, setMovieList] = useState<MovieListSingleItem[]>([]);
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
                // TODO show error
                console.log(movieListResult.Error);
                return;
            }

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

    const resetListState = () => {
        // reset pagination
        setCurrentPage(1);
        setMovieList([]);

        // scroll to top
        flatListRef?.current?.scrollToOffset({
            animated: false,
            offset: 0,
        });
    };

    const onSearchValueUpdate = (newValue: string) => {
        if (newValue.trim() === "") return;

        resetListState();

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
                        <BottomSheetTextInput
                            style={styles.filterTextInput}
                            placeholder="Start year to search"
                            value={startYear}
                            onChangeText={setStartYear}
                            keyboardType="numeric"
                            maxLength={4}
                        />
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
                        <Text>Filter by type</Text>
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
