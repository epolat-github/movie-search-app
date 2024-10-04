import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { MovieDetailsResponseBody } from "../../types/movieService.type";
import { getMovieDetails } from "../../services";
import { spacing } from "../../theme/spacing";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import BlurImage from "../../components/BlurImage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/Button";
import favoritesService from "../../services/favorites.service";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CloseButton from "../../components/CloseButton";

const IMAGE_HEIGHT = 500;

const Details = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{
        imdbId: string;
    }>();
    const { top } = useSafeAreaInsets();

    const imdbId = params.imdbId;

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useSharedValue(0);

    const [movieDetails, setMovieDetails] =
        useState<MovieDetailsResponseBody>();
    const [isInFavorite, setIsInFavorite] = useState<boolean>();

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const inputRange = [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT];

        const translateY = interpolate(scrollOffset.value, inputRange, [
            -IMAGE_HEIGHT / 2,
            0,
            IMAGE_HEIGHT * 0.75,
        ]);

        const scale = interpolate(scrollOffset.value, inputRange, [2, 1, 1]);

        return {
            transform: [
                {
                    translateY,
                },
                {
                    scale,
                },
            ],
        };
    });

    const getMovieDetailsHandler = async (imdbId: string) => {
        try {
            const movieDetailsResult = await getMovieDetails(imdbId);

            setMovieDetails(movieDetailsResult);
        } catch (err) {
            // TODO show proper feedback with maybe snackbar?
            console.log(err);
            alert("Error!");
        }
    };

    const checkIsInFavorite = async (id: string) => {
        const result = await favoritesService.isMovieFavorite(id);
        setIsInFavorite(result);
    };

    useEffect(() => {
        if (!imdbId) return;

        getMovieDetailsHandler(imdbId);
        checkIsInFavorite(imdbId);
    }, [imdbId]);

    const toggleFavorite = async () => {
        if (isInFavorite) {
            await favoritesService.removeFavoriteMovie(imdbId);
            setIsInFavorite(false);
        } else {
            await favoritesService.addFavoriteMovie(imdbId);
            setIsInFavorite(true);
        }
    };

    const openUrl = async (url: string) => {
        const canOpenUrl = await Linking.canOpenURL(url);

        if (canOpenUrl) {
            await Linking.openURL(url);
        }
    };

    if (!movieDetails) return null;

    const { Poster, Title, Year, imdbID } = movieDetails;

    return (
        <View style={{ flex: 1, position: "relative" }}>
            <CloseButton
                onPress={() => router.dismiss()}
                style={{
                    top: spacing.medium,
                    right: spacing.medium,
                }}
            />
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
            >
                <StatusBar
                    style={Platform.OS === "ios" ? "light" : "auto"}
                    animated
                />
                <Animated.View
                    style={[
                        {
                            height: 450,
                            paddingVertical:
                                Platform.OS === "android" ? top : spacing.large,
                        },
                        headerAnimatedStyle,
                    ]}
                >
                    <BlurImage
                        source={Poster === "N/A" ? undefined : Poster}
                        tint="default"
                    />

                    <Image
                        source={Poster === "N/A" ? undefined : Poster}
                        contentFit="contain"
                        transition={300}
                        style={{
                            flex: 1,
                            zIndex: 3,
                        }}
                        placeholder="No Image"
                    />
                </Animated.View>

                <View
                    style={{
                        backgroundColor: "#fff",
                        flex: 1,
                        minHeight: 350,
                        padding: spacing.medium,
                        gap: spacing.medium,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: spacing.large,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 32,
                                flex: 0.9,
                            }}
                            numberOfLines={2}
                        >
                            {Title}
                        </Text>
                        <Pressable
                            onPress={toggleFavorite}
                            hitSlop={10}
                            style={{
                                flex: 0.1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <MaterialIcons
                                name={
                                    isInFavorite
                                        ? "favorite"
                                        : "favorite-outline"
                                }
                                size={30}
                                color="red"
                            />
                        </Pressable>
                    </View>
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            color: "gray",
                        }}
                    >
                        Released in{" "}
                        <Text
                            style={{
                                color: "#000",
                            }}
                        >
                            {Year}
                        </Text>
                    </Text>

                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            color: "gray",
                        }}
                    >
                        IMDB ID:{" "}
                        <Text
                            style={{
                                color: "#000",
                            }}
                        >
                            {imdbID}
                        </Text>
                    </Text>

                    <View
                        style={{
                            gap: spacing.medium,
                            marginTop: spacing.huge,
                        }}
                    >
                        <Button
                            text="Visit IMDB"
                            onPress={() =>
                                openUrl(`https://www.imdb.com/title/${imdbID}`)
                            }
                        />
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
};

export default Details;
