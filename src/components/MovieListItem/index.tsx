import { Pressable, Text, View } from "react-native";
import { MovieListSingleItem } from "../../types/movieService.type";
import { Image } from "expo-image";
import { spacing } from "../../theme/spacing";
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";

interface MovieListItemType {
    data: MovieListSingleItem;
}

const MovieListItem: React.FC<MovieListItemType> = (props) => {
    const { data } = props;

    const { Title, Poster, imdbID } = data;

    const router = useRouter();

    return (
        <Pressable onPress={() => router.push(`/movie/${imdbID}`)}>
            <View
                style={{
                    borderRadius: spacing.small,
                    paddingHorizontal: spacing.medium,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    gap: spacing.small,
                }}
            >
                <Animated.View
                    style={{
                        flex: 1,
                        // width: "100%",
                        height: 400,
                        borderRadius: spacing.small,
                    }}
                >
                    <Image
                        source={Poster === "N/A" ? undefined : Poster}
                        contentFit="contain"
                        transition={300}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        placeholder="No Image"
                    />
                </Animated.View>

                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 24,
                    }}
                >
                    {Title}
                </Text>
            </View>
        </Pressable>
    );
};

export default MovieListItem;
