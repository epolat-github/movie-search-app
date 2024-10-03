import { Pressable, PressableProps, TextStyle, ViewStyle } from "react-native";
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
    textStyle?: TextStyle;
    containerStyle?: ViewStyle;
    text: string;
    disabled?: boolean;
}

const Button = (props: ButtonProps) => {
    const { containerStyle, textStyle, text, disabled, ...rest } = props;

    const scale = useSharedValue(1);
    const backgroundColor = useDerivedValue(() => {
        return disabled
            ? withTiming(0, {
                  duration: 300,
                  easing: Easing.inOut(Easing.ease),
              })
            : withTiming(1, {
                  duration: 300,
                  easing: Easing.inOut(Easing.ease),
              });
    });

    const onPressIn = () => {
        scale.value = withTiming(0.95);
    };

    const onPressOut = () => {
        scale.value = withTiming(1);
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                backgroundColor.value,
                [0, 1],
                [
                    "gray",
                    containerStyle?.backgroundColor?.toString() ??
                        colors.primary,
                ]
            ),

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
            disabled={disabled}
            style={[
                {
                    height: 50,
                    borderRadius: spacing.medium,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                containerStyle,
                buttonAnimatedStyle,
            ]}
            {...rest}
        >
            <Animated.Text
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                    {
                        fontSize: 14,
                        fontWeight: "500",
                        color: "#fff",
                    },
                    textStyle,
                ]}
            >
                {text}
            </Animated.Text>
        </AnimatedPressable>
    );
};

export default Button;
