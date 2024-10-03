import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
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

const IMAGE_HEIGHT = 500;

const Details = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { top } = useSafeAreaInsets();

    const imdbId = params.imdbId;

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useSharedValue(0);

    const [movieDetails, setMovieDetails] =
        useState<MovieDetailsResponseBody>();

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

    useEffect(() => {
        if (!imdbId) return;
        if (typeof imdbId !== "string") return;

        getMovieDetailsHandler(imdbId);
    }, [imdbId]);

    const openUrl = async (url: string) => {
        const canOpenUrl = await Linking.canOpenURL(url);

        if (canOpenUrl) {
            await Linking.openURL(url);
        }
    };

    if (!movieDetails) return null;

    const { Poster, Title, Year, imdbID } = movieDetails;

    return (
        <View style={{ flex: 1 }}>
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
                    <BlurImage source={Poster === "N/A" ? undefined : Poster} />

                    <Image
                        source={Poster === "N/A" ? undefined : Poster}
                        contentFit="contain"
                        transition={1000}
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
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 32,
                        }}
                    >
                        {Title}
                    </Text>
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

                        <Button
                            text="Dismiss"
                            onPress={() => router.dismiss()}
                            containerStyle={{
                                backgroundColor: "red",
                            }}
                        />
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
};

export default Details;
