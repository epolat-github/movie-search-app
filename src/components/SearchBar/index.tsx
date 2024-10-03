import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    TextInput,
    ViewStyle,
    Pressable,
    Keyboard,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

import { EvilIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { spacing } from "../../theme/spacing";
import useDebounce from "../../hooks/useDebounce";
import { colors } from "../../theme/colors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface SearchBarType {
    style?: ViewStyle;
    onSearch: (value: string) => void;
    onFilterPress: () => void;
}

const SearchBar: React.FC<SearchBarType> = ({
    style,
    onSearch,
    onFilterPress,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue]);

    const onFocus = () => {
        setIsFocused(true);
    };
    const onBlur = () => {
        setIsFocused(false);
    };

    const containerStyle = useAnimatedStyle(() => ({
        paddingHorizontal: withTiming(isFocused ? "0%" : "7%"),
    }));

    const textInputStyle = useAnimatedStyle(() => ({
        borderRadius: withTiming(isFocused ? 0 : 10),
        height: withTiming(isFocused ? 50 : 40),
        paddingHorizontal: withTiming(
            isFocused ? spacing.large : spacing.small
        ),
        width: withTiming(isFocused ? "100%" : "90%"), // to leave space to the filtering button
    }));

    const clearIconStyle = useAnimatedStyle(
        () => ({
            transform: [
                {
                    translateX: withTiming(
                        isFocused || value ? 0 : 20 + spacing.large
                    ),
                },
            ],
        }),
        [value, isFocused]
    );

    const onClearIconPress = () => {
        setValue("");
        onBlur();
        Keyboard.dismiss();
    };

    return (
        <Animated.View
            style={[
                {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: spacing.small,
                    width: "100%",
                },
                containerStyle,
            ]}
        >
            <Animated.View style={[styles.container, style, textInputStyle]}>
                <EvilIcons name="search" size={25} color="#8E8D92" />
                <AnimatedTextInput
                    returnKeyType="search"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoCorrect={false}
                    value={value}
                    onChangeText={setValue}
                    style={{
                        flex: 1,
                        marginLeft: spacing.tiny,
                    }}
                    placeholder={"Start typing to search a movie"}
                    placeholderTextColor="#8E8D92"
                    // selectionColor={colors.primary}
                />
                <AnimatedPressable
                    onPress={onClearIconPress}
                    style={clearIconStyle}
                    hitSlop={10}
                >
                    <Entypo
                        name="circle-with-cross"
                        size={20}
                        color="#8e8d9289"
                    />
                </AnimatedPressable>
            </Animated.View>
            <Animated.View>
                <AnimatedPressable onPress={onFilterPress} hitSlop={10}>
                    <Ionicons
                        name="filter-sharp"
                        size={20}
                        color={colors.secondary}
                    />
                </AnimatedPressable>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f6f6f6",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        width: "100%",
    },
});

export default SearchBar;
