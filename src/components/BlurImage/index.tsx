import { BlurTint, BlurView } from "expo-blur";
import { Image, ImageProps } from "expo-image";
import { StyleSheet, View } from "react-native";

interface BlurImageType {
    source: ImageProps["source"];
    tint?: BlurTint;
}

const BlurImage: React.FC<BlurImageType> = (props) => {
    const { source, tint = "dark" } = props;

    return (
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
            }}
        >
            <BlurView
                experimentalBlurMethod="dimezisBlurView"
                intensity={30}
                style={{
                    zIndex: 2,
                    ...StyleSheet.absoluteFillObject,
                }}
                tint={tint}
            />

            <Image
                source={source}
                contentFit="cover"
                transition={1000}
                style={{
                    flex: 1,
                    zIndex: 1,
                }}
                placeholder="No Image"
            />
        </View>
    );
};

export default BlurImage;
