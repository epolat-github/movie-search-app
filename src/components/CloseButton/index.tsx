import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CloseButtonProps {
    style: ViewStyle;
    onPress: () => unknown;
}

const CloseButton: React.FC<CloseButtonProps> = ({ style, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    width: 32,
                    height: 32,
                    position: "absolute",
                    zIndex: 9,
                    ...style,
                },
            ]}
        >
            <MaterialCommunityIcons name="close" color="red" size={32} />
        </Pressable>
    );
};

export default CloseButton;
