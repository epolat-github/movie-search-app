import { Platform, Pressable, Text, View } from "react-native";
import { MovieListSingleItem } from "../../types/movieService.type";
import { Image } from "expo-image";
import { spacing } from "../../theme/spacing";
import { useRouter } from "expo-router";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import BlurImage from "../BlurImage";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MovieListItemType {
    data: MovieListSingleItem;
}

const MovieListItem: React.FC<MovieListItemType> = (props) => {
    const { data } = props;

    const { Title, Poster, imdbID } = data;

    const router = useRouter();
    const scale = useSharedValue(1);

    const onPressIn = () => {
        scale.value = withTiming(0.95);
    };

    const onPressOut = () => {
        scale.value = withTiming(1);
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: scale.value,
                },
            ],
        };
    });

    return (
        <AnimatedPressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => router.push(`/movie/${imdbID}`)}
            style={[
                {
                    borderRadius: spacing.small,
                    overflow: "hidden",
                },
                buttonAnimatedStyle,
            ]}
        >
            <Animated.View
                style={{
                    height: 450,
                    borderRadius: spacing.small,
                    paddingTop: spacing.large,
                    justifyContent: "space-between",
                }}
            >
                {Platform.OS === "ios" && (
                    <BlurImage source={Poster === "N/A" ? undefined : Poster} />
                )}

                <Image
                    source={Poster === "N/A" ? undefined : Poster}
                    contentFit="contain"
                    transition={300}
                    style={{
                        flex: 0.8,
                        zIndex: 3,
                    }}
                    placeholder="No Image"
                />

                <View
                    style={{
                        flex: 0.2,
                        paddingHorizontal: spacing.large,
                        justifyContent: "center",
                        zIndex: 4,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 24,
                            color: Platform.select({
                                android: "#000",
                                ios: "#fff",
                            }),
                        }}
                    >
                        {Title}
                    </Text>
                </View>
            </Animated.View>
        </AnimatedPressable>
    );
};

export default MovieListItem;
