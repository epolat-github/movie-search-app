import { AntDesign, Entypo } from "@expo/vector-icons";
import { Portal } from "@gorhom/portal";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import { spacing } from "../theme/spacing";

type snackbarContextType = {
    showSnackbar: (textInput: string, options?: SnackbarOptions) => void;
};

const SnackbarContext = createContext<snackbarContextType | undefined>(
    undefined
);

export function useSnackbarContext() {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error(
            "useSnackbarContext must be used within a SnackbarContextProvider"
        );
    }
    return context;
}

type SnackbarContextProviderProps = {
    children: ReactNode;
};

type SnackbarVariants = "default" | "error" | "success";

interface SnackbarOptions {
    variant?: SnackbarVariants;
    duration?: number;
}

export const SnackbarContextProvider = ({
    children,
}: SnackbarContextProviderProps) => {
    const [text, setText] = useState<string>("");
    const [isShown, setIsShown] = useState<boolean>(false);
    const [variant, setVariant] = useState<SnackbarVariants>("default");

    const showSnackbar = useCallback(
        (textInput: string, options?: SnackbarOptions) => {
            const { duration = 3000, variant = "default" } = options || {};

            setVariant(variant);
            setIsShown(true);
            setText(textInput);

            setTimeout(() => {
                setIsShown(false);
            }, duration);

            setTimeout(() => {
                setText("");
                setVariant("default");
            }, duration + 200);
        },
        []
    );

    const icon = useMemo(() => {
        switch (variant) {
            case "default":
                return null;
            case "success":
                return <AntDesign name="checkcircle" size={18} color="#fff" />;
            case "error":
                return (
                    <Entypo name="circle-with-cross" size={18} color="#fff" />
                );

            default:
                return null;
        }
    }, [variant]);

    const backgroundColor = useMemo(() => {
        switch (variant) {
            case "default":
                return "#313131";
            case "success":
                return "#44A047";
            case "error":
                return "#D3302F";

            default:
                return "#313131";
        }
    }, [variant]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: isShown ? withSpring(-50) : withSpring(60),
                },
            ],
        };
    });

    return (
        <SnackbarContext.Provider
            value={{
                showSnackbar,
            }}
        >
            <Portal>
                <Animated.View
                    style={[
                        {
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 6,
                            elevation: 5,
                            backgroundColor,
                            justifyContent: "center",
                            alignItems: "flex-start",
                            paddingHorizontal: spacing.large,
                            paddingVertical: spacing.medium,
                            width: "90%",
                            alignSelf: "center",
                            minHeight: 50,
                            position: "absolute",
                            bottom: 0,
                            left: "5%",
                            right: "5%",
                            borderRadius: 10,
                        },
                        animatedStyle,
                    ]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            gap: spacing.medium,
                            alignItems: "center",
                        }}
                    >
                        {icon}
                        <Text
                            style={{
                                textAlign: "left",
                                color: "#fff",
                                fontWeight: "400",
                                flexShrink: 1,
                            }}
                        >
                            {text}
                        </Text>
                    </View>
                </Animated.View>
            </Portal>
            {children}
        </SnackbarContext.Provider>
    );
};
